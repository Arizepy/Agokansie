import serial
import time
import threading


class RobotController:

    def __init__(self, port="COM6", baudrate=115200):

        self.port = port
        self.baudrate = baudrate
        self.serial = None

        self.safe_z = -180
        self.pick_z = -111
        self.SUPPLY = {
                    0: (267, 5),
                    1: (267, 80),
                    2: (267, 153),
                }

    # =========================================================
    # CONNECT
    # =========================================================
    def connect(self):

        if self.serial and self.serial.is_open:
            return

        try:
            # IMPORTANT: short per-line timeout (0.1s), NOT 1s.
            # query_status() polls repeatedly within its own timeout budget;
            # if this is 1s, a single readline() can eat the whole budget.
            self.serial = serial.Serial(self.port, self.baudrate, timeout=0.1)
            time.sleep(2)
            print(f"[OK] Connected to {self.port}")

        except serial.SerialException as e:
            print(f"[SERIAL ERROR] {e}")
            self.serial = None

    # =========================================================
    # GCODE SENDER
    # =========================================================
    def send_gcode(self, cmd):

        self.connect()

        if not self.serial:
            print("[ERROR] Serial not connected")
            return False

        print(">>", cmd)
        self.serial.write((cmd + "\n").encode())

        while True:

            response_bytes = self.serial.readline()

            if not response_bytes:
                # readline timed out with no data (expected, timeout=0.1) - keep waiting for 'ok'
                continue

            print("RAW:", response_bytes)

            try:
                response = response_bytes.decode("utf-8").strip()
            except UnicodeDecodeError:
                print("[WARNING] Invalid UTF-8 data received")
                continue

            if response:
                print("<<", response)

            if "ok" in response.lower():
                return True

            if "error" in response.lower():
                print("[FLUIDNC ERROR]", response)
                return False

    def send_gcode_block(self, commands):

        self.connect()

        if not self.serial:
            return False

        for i, cmd in enumerate(commands):
            print(f"{i}: {cmd}")

        program = "\n".join(commands) + "\n"

        self.serial.write(program.encode())

        ok_count = 0

        while ok_count < len(commands):

            response = self.serial.readline().decode(
                "utf-8",
                errors="ignore"
            ).strip()

            if response:
                print("<<", response)

            if response.lower() == "ok":
                ok_count += 1

            elif "error" in response.lower():
                print(f"[ERROR after command {ok_count}]")
                print("Command was:", commands[ok_count])
                return False

        return True

    # =========================================================
    # STATUS / SYNC (FluidNC real-time reports)
    # =========================================================
    def query_status(self, timeout=2):
        """Send a real-time '?' status query and return the raw <...> report line."""
        self.connect()
        if not self.serial:
            raise ConnectionError("Serial not connected")

        self.serial.write(b"?")   # no newline for FluidNC real-time queries

        start = time.time()
        while time.time() - start < timeout:
            line = self.serial.readline().decode("utf-8", errors="ignore").strip()
            if line.startswith("<") and line.endswith(">"):
                return line
            # ignore blank lines / stray 'ok' / [MSG:...] chatter
        raise TimeoutError("No status report received from FluidNC")

    def wait_until_idle(self, poll_interval=0.05, timeout=15):
        """Block until FluidNC reports Idle. Requires having seen Run/Jog first,
        or enough time elapsed, to avoid a false-positive Idle read taken
        before motion has actually started."""
        start = time.time()
        seen_run = False
        while time.time() - start < timeout:
            status = self.query_status()
            print("STATUS:", status)

            if "Run" in status or "Jog" in status:
                seen_run = True

            if "Alarm" in status:
                raise RuntimeError(f"FluidNC ALARM state: {status}")

            if "Idle" in status and (seen_run or time.time() - start > 0.3):
                return True

            time.sleep(poll_interval)

        raise TimeoutError("Machine did not reach Idle state")

    # =========================================================
    # MOTION
    # =========================================================
    def home(self):
        self.send_gcode("$H")
        self.wait_until_idle()

    def move(self, x, y, z=None, feed=6000):
        if z is None:
            self.send_gcode(f"G0 X{x} Y{y}")
            self.wait_until_idle()
        else:
            self.send_gcode(f"G1 Z{z} F3000")
            self.wait_until_idle()
            time.sleep(0.3)   # let the RC servo physically finish settling — not tracked by FluidNC
            self.send_gcode(f"G1 X{x} Y{y} F{feed}")
            self.wait_until_idle()
    def pick(self):
        print("magnet on//////////////////////////////////////////////////")
        self.send_gcode("M3 S1000")

    def drop(self):
        print("magnet off/////////////////////////////////////////////////////////")
        self.send_gcode("M5")

    def camera_cal_for_achi(self):
        self.send_gcode("G0 Y5")
        self.wait_until_idle()
    

    # =========================================================
    # UNIFIED EXECUTION SYSTEM
    # =========================================================
    def execute_action(self, game, action_packet):

        print("\nEXECUTING ACTION:", action_packet)

        action = action_packet["action"]
        data = action_packet["data"]

        # =====================================================
        # DAME / ACHI: MOVE PIECE
        # =====================================================
        if action == "move":

            sx, sy = game.map_to_coordinates(data["from"])
            ex, ey = game.map_to_coordinates(data["to"])

            # Go to source
            self.move(sx, sy)
            self.move(sx, sy, self.pick_z)

            self.pick()

            self.move(sx, sy, self.safe_z)

            # Go to destination
            self.move(ex, ey)
            self.move(ex, ey, self.pick_z)

            self.drop()

            self.move(ex, ey, self.safe_z)

            self.home()

        # =====================================================
        # OWARE: SOWING
        # =====================================================
        elif action == "sow":

            moves = data["moves"]

            for move_data in moves:

                # =====================================
                # SOW ONE BEAD
                # =====================================
                if move_data["type"] == "sow":

                    sx, sy = game.map_to_coordinates(move_data["from"])
                    tx, ty = game.map_to_coordinates(move_data["to"])

                    # Move to source
                    self.move(sx, sy)
                    self.move(sx, sy, self.pick_z)

                    self.pick()

                    self.move(sx, sy, self.safe_z)

                    # Move to destination
                    self.move(tx, ty)
                    self.move(tx, ty, self.pick_z)

                    self.drop()

                    self.move(tx, ty, self.safe_z)

                # =====================================
                # CAPTURE ONE BEAD
                # =====================================
                elif move_data["type"] == "capture":

                    sx, sy = game.map_to_coordinates(move_data["from"])

                    # Capture containers
                    if move_data["owner"] == 1:
                        cx, cy = 90, 195
                    else:
                        cx, cy = 90, 10

                    # Pick captured bead
                    self.move(sx, sy)
                    self.move(sx, sy, self.pick_z)

                    self.pick()

                    self.move(sx, sy, self.safe_z)

                    # Drop into capture container
                    self.move(cx, cy)
                    self.move(cx, cy, self.pick_z)

                    self.drop()

                    self.move(cx, cy, self.safe_z)

        # =====================================================
        # ACHI: PLACE A NEW PIECE
        # =====================================================
        elif action == "place":

            supply = data["supply"]      # 0, 1 or 2
            target = data["position"]

            sx, sy = self.SUPPLY[supply]
            tx, ty = game.map_to_coordinates(target)

            # Pick from supply
            self.move(sx, sy)
            self.move(sx, sy, self.pick_z)

            self.pick()

            self.move(sx, sy, self.safe_z)

            # Place on board
            self.move(tx, ty)
            self.move(tx, ty, self.pick_z)

            self.drop()

            self.move(tx, ty, self.safe_z)

            self.home()

        else:
            print("[ERROR] Unknown action:", action)

    def game_over_dispenser(self):
        self.send_gcode("""G28
                        G0 A-100""")
        self.wait_until_idle()

    # =========================================================
    # CLEANUP
    # =========================================================
    def close(self):

        if self.serial and self.serial.is_open:
            self.serial.close()