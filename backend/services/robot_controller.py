



import serial
import time
import threading


class RobotController:

    def __init__(self, port="COM6", baudrate=115200):

        self.port = port
        self.baudrate = baudrate
        self.serial = None

        self.safe_z = 0
        self.pick_z = -85
        self.SUPPLY = {
                    0: (267, 5),
                    1: (267, 80),
                    2: (267, 153),
                }
        self.drop_off_dame= {
                    0: (299, 0),
                    1: (299, 35),
                    2: (299, 70),
                    3: (299, 105),
                    4: (299, 140),
                    5: (299, 175),
                    6: (270, 0),
                    7: (270, 35),
                    8: (270, 70),
                    9: (270, 105),
                    10: (270, 140),
                    11: (270, 175),
                }
        self.oware_pick_z=-10
        self.dame_drop_index = 0


    # =========================================================
    # CONNECT
    # =========================================================
    def connect(self):

        if self.serial and self.serial.is_open:
            return

        try:
            # self.serial = serial.Serial(self.port, self.baudrate, timeout=1)
            # time.sleep(2)
            # print(f"[OK] Connected to {self.port}")
            
            self.serial = serial.Serial(self.port, self.baudrate, timeout=1)

            # Wait for FluidNC to boot
            time.sleep(2)

            # Clear startup messages
            self.serial.reset_input_buffer()

            print(f"[OK] Connected to {self.port}")

            # Initialize the servo to the stop position
            
            self.send_gcode("G0 A-90")

        except serial.SerialException as e:
            print(f"[SERIAL ERROR] {e}")
            self.serial = None

    # =========================================================
    # GCODE SENDER
    # =========================================================
    # def send_gcode(self, cmd):

    #     self.connect()

    #     if not self.serial:
    #         print("[ERROR] Serial not connected")
    #         return

    #     print(">>", cmd)
    #     self.serial.write((cmd + "\n").encode())

    #     while True:
    #         response = self.serial.readline().decode().strip()

    #         if response:
    #             print("<<", response)

    #         if "ok" in response.lower():
    #             break
    #         if "error" in response.lower():
    #             print("[FLUIDNC ERROR]", response)
    #             return False
    
    # def send_gcode(self, cmd):

    #     self.connect()

    #     if not self.serial:
    #         print("[ERROR] Serial not connected")
    #         return False

    #     print(">>", cmd)
    #     self.serial.write((cmd + "\n").encode())

    #     while True:

    #         response_bytes = self.serial.readline()

    #         # Debug: see exactly what the controller sent  
    #         print("RAW:", response_bytes)

    #         try:
    #             response = response_bytes.decode("utf-8").strip()
    #         except UnicodeDecodeError:
    #             print("[WARNING] Invalid UTF-8 data received")
    #             continue

    #         if response:
    #             print("<<", response)

    #         if "ok" in response.lower():
    #             return True

    #         if "error" in response.lower():
    #             print("[FLUIDNC ERROR]", response)
    #             return False
    
    def send_gcode(self, cmd):

        self.connect()

        if not self.serial or not self.serial.is_open:
            print("[ERROR] Serial not connected")
            return False

        try:
            # Clear any stale data
            self.serial.reset_input_buffer()
            self.serial.reset_output_buffer()

            print(">>", cmd)
            self.serial.write((cmd + "\n").encode("utf-8"))
            self.serial.flush()

            timeout = 5.0      # seconds
            start = time.time()

            while time.time() - start < timeout:

                response_bytes = self.serial.readline()

                if not response_bytes:
                    continue

                print("RAW:", response_bytes)

                try:
                    response = response_bytes.decode(
                        "utf-8",
                        errors="replace"
                    ).strip()
                except Exception as e:
                    print(f"[WARNING] Decode failed: {e}")
                    continue

                if not response:
                    continue

                print("<<", response)

                lower = response.lower()

                if lower == "ok" or lower.startswith("ok"):
                    return True

                if lower.startswith("error"):
                    print("[FLUIDNC ERROR]", response)
                    return False

                if lower.startswith("alarm"):
                    print("[FLUIDNC ALARM]", response)
                    return False

            print(f"[ERROR] Timeout waiting for response to '{cmd}'")
            return False

        except serial.SerialException as e:
            print(f"[SERIAL ERROR] {e}")
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
    # MOTION
    # =========================================================
    def home(self):
        self.send_gcode("$H")

    # def move(self, x, y, z=None, feed=6000):

    #     if z is None:
    #         self.send_gcode(f"G0 X{x} Y{y}")
    #     else:
    #         self.send_gcode(f"G1 Z{z} F3000")
    #         self.send_gcode(f"G1 X{x} Y{y} F{feed}")
    #         # self.send_gcode(f"G1 X{x} Y{y} Z{z} F{feed}")
    
    def move(self, x, y, z=None, feed=12000):
        if z is None:
            self.send_gcode(f"G0 X{x} Y{y}")
        else:
            self.send_gcode(f"G1 Z{z} F3000")
            self.wait_for_idle()          # <-- ensure Z motion truly finished
            self.send_gcode(f"G1 X{x} Y{y} F{feed}")
            self.wait_for_idle()          # <-- ensure XY motion truly finished
        
       
    def pick(self):
        print("magnet on//////////////////////////////////////////////////")
        self.send_gcode("M62 P0")

    def drop(self):
        print("magnet off/////////////////////////////////////////////////////////")
        self.send_gcode("M63 P0")
    def camera_cal_for_achi(self):
        self.send_gcode("G0 Y10")
    def pick_up(self):
        self.send_gcode("G1 Z-180 F3000 M3 S1000")
        
    def wait_for_idle(self, poll_interval=0.05, timeout=30):
        """Block until FluidNC reports Idle (all queued motion actually complete)."""
        self.connect()
        if not self.serial:
            return False

        start = time.time()
        while time.time() - start < timeout:
            self.serial.write(b"?")
            line = self.serial.readline().decode("utf-8", errors="ignore").strip()

            if line.startswith("<"):
                # e.g. "<Idle|MPos:..." or "<Run|MPos:..."
                state = line[1:].split("|")[0]
                if state == "Idle":
                    return True

            time.sleep(poll_interval)

        print("[WARNING] wait_for_idle timed out")
        return False
    # =========================================================
    # 🚀 NEW UNIFIED EXECUTION SYSTEM
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
            # self.move(ex, ey, self.pick_z)

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
                    self.move(sx, sy, self.oware_pick_z)

                    self.pick()

                    self.move(sx, sy, self.safe_z)

                    # Move to destination
                    self.move(tx, ty)
                    self.move(tx, ty, self.oware_pick_z)

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
                    self.move(sx, sy, self.oware_pick_z)

                    self.pick()

                    self.move(sx, sy, self.safe_z)

                    # Drop into capture container
                    self.move(cx, cy)
                    self.move(cx, cy, self.oware_pick_z)

                    self.drop()

                    self.move(cx, cy, self.safe_z)
            self.home()
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
            # self.move(tx, ty, self.pick_z)

            self.drop()

            self.move(tx, ty, self.safe_z)

            self.home()
        
                # =====================================================
        # DAME: CAPTURE PIECE(S)
        # =====================================================
        elif action == "capture":

            # Move information
            sx, sy = game.map_to_coordinates(data["from"])
            ex, ey = game.map_to_coordinates(data["to"])

            # -------------------------------------------------
            # Move attacking piece
            # -------------------------------------------------
            self.move(sx, sy)
            self.move(sx, sy, self.pick_z)

            self.pick()

            self.move(sx, sy, self.safe_z)

            self.move(ex, ey)
            # self.move(ex, ey, self.pick_z)

            self.drop()

            self.move(ex, ey, self.safe_z)

            # -------------------------------------------------
            # Remove captured pieces
            # -------------------------------------------------
            # Choose capture tray depending on whose turn made
            # the capture. Adjust if your game stores this differently.
            # if game.current_player == 1:
            #     cx, cy = self.DAME_CAPTURE_P1
            # else:
            #     cx, cy = self.DAME_CAPTURE_P2
            

            # -------------------------------------------------
            # Remove captured pieces
            # -------------------------------------------------
            for square in data["captured"]:

                # No more storage locations
                if self.dame_drop_index >= len(self.drop_off_dame):
                    print("[WARNING] Dame drop-off area is full.")
                    break

                px, py = game.map_to_coordinates(square)

                dx, dy = self.drop_off_dame[self.dame_drop_index]

                # Pick captured piece
                self.move(px, py)
                self.move(px, py, self.pick_z)

                self.pick()

                self.move(px, py, self.safe_z)

                # Move to drop-off slot
                self.move(dx, dy)
                # self.move(dx, dy, self.pick_z)

                self.drop()

                self.move(dx, dy, self.safe_z)

                # Advance to next slot
                self.dame_drop_index += 1
            self.home()

        else:
            print("[ERROR] Unknown action:", action)

    
    def game_over_dispenser(self):
        # self.send_gcode("""G28
        #                 G0 A-100""")
        # time.sleep(1)
        self.send_gcode("G0 A0")
        # self.send_gcode("G4 P1000")
        time.sleep(0.7)
        self.send_gcode("G0 A-180")
        # self.send_gcode("G4 P1000")
        time.sleep(1.2)
        
        self.send_gcode("G0 A-90")

    # def start_dispenser(self):
    #     threading.Thread(
    #         target=self.game_over_dispenser,
    #         daemon=True
    #     ).start()    



    # def execute_action(self, game, action_packet):

    #     print("\nEXECUTING ACTION:", action_packet)

    #     action = action_packet["action"]
    #     data = action_packet["data"]

    #     commands = []

    #     # =====================================================
    #     # DAME / ACHI
    #     # =====================================================
    #     if action == "move":

    #         sx, sy = game.map_to_coordinates(data["from"])
    #         ex, ey = game.map_to_coordinates(data["to"])

    #         commands.extend([
    #             "G28",

    #             f"G1 X{sx} Y{sy} Z{self.safe_z} F10000",
    #             f"G1 X{sx} Y{sy} Z{self.pick_z} F10000",

    #             "M3 S1000",

    #             f"G1 X{sx} Y{sy} Z{self.safe_z} F10000",

    #             f"G1 X{ex} Y{ey} Z{self.safe_z} F10000",
    #             f"G1 X{ex} Y{ey} Z{self.pick_z} F10000",

    #             "M5",

    #             f"G1 X{ex} Y{ey} Z{self.safe_z} F10000",

    #             "G28"
    #         ])

    #     # =====================================================
    #     # OWARE
    #     # =====================================================
    #     elif action == "sow":

    #         for move_data in data["moves"]:

    #             if move_data["type"] == "sow":

    #                 sx, sy = game.map_to_coordinates(move_data["from"])
    #                 tx, ty = game.map_to_coordinates(move_data["to"])

    #                 commands.extend([
    #                     f"G1 X{sx} Y{sy} Z{self.pick_z} F10000",
    #                     "M3 S1000",
    #                     f"G1 X{sx} Y{sy} Z{self.safe_z} F10000",

    #                     f"G1 X{tx} Y{ty} Z{self.safe_z} F10000",
    #                     f"G1 X{tx} Y{ty} Z{self.pick_z} F10000",
    #                     "M5",
    #                     f"G1 X{tx} Y{ty} Z{self.safe_z} F10000"
    #                 ])

    #             elif move_data["type"] == "capture":

    #                 sx, sy = game.map_to_coordinates(move_data["from"])

    #                 if move_data["owner"] == 1:
    #                     cx, cy = 70, 80
    #                 else:
    #                     cx, cy = 70, 200

    #                 commands.extend([
    #                     f"G1 X{sx} Y{sy} Z{self.safe_z} F10000",
    #                     f"G1 X{sx} Y{sy} Z{self.pick_z} F10000",
    #                     "M3 S1000",
    #                     f"G1 X{sx} Y{sy} Z{self.safe_z} F10000",

    #                     f"G1 X{cx} Y{cy} Z{self.safe_z} F10000",
    #                     f"G1 X{cx} Y{cy} Z{self.pick_z} F10000",
    #                     "M5",
    #                     f"G1 X{cx} Y{cy} Z{self.safe_z} F10000"
    #                 ])

    #         # commands.append("G28")

    #     else:
    #         print("[ERROR] Unknown action:", action)
    #         return

    #     self.send_gcode_block(commands)
    # =========================================================
    # CLEANUP
    # =========================================================
    def close(self):

        if self.serial and self.serial.is_open:
            self.serial.close()
# robot = RobotController()

# robot.connect()
# # robot.start_dispenser()
# robot.game_over_dispenser()