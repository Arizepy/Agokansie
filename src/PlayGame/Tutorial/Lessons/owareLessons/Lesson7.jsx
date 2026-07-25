import { useContext, useState, useRef, useEffect, } from 'react'
import { gsap } from 'gsap'
import PageWrapper from '../../../../WelcomeScreen/PageWrapper'
import bg from '../../../../assets/background-collage.png'
import thinking_image  from '../../../../assets/black_man_thinking.webp'
import { ArrowRight, ArrowLeft, CornerDownLeft, CornerDownRight, House} from 'lucide-react'
import { useNavigate } from "react-router-dom";
import woodTapSound from '../../../../assets/sound/woodTap.mp3'
import placePiece from '../../../../assets/sound/piecePlacement.mp3'
import Hightlight from '../../../../assets/sound/blocked.mp3'
import errorSound from '../../../../assets/sound/error.mp3'
import victorySound from '../../../../assets/sound/victory.mp3'


//Lesson Sound
import tipsOne from '../../../../assets/sound/oware/tipsOne.m4a'
import tipsTwo from '../../../../assets/sound/oware/tipsTwo.m4a'
import tipsThree from '../../../../assets/sound/oware/tipsThree.m4a'
import tipsFour from '../../../../assets/sound/oware/tipsFour.m4a'
import endSound from '../../../../assets/sound/oware/endSound.m4a'



function OwareLesson7(){
    

const woodTap = useRef(new Audio(woodTapSound))
const thinking = "..."
const pieceSound = useRef(new Audio(placePiece))
const hightlight  = useRef(new Audio(Hightlight))
const error = useRef (new Audio(errorSound))
const victory = useRef(new Audio(victorySound))

const voiceRef = useRef(new Audio());

const playPlacePiece = () => {
    if (pieceSound.current){
        pieceSound.current.currentTime = 0; 
        pieceSound.current.play()
    }
}

const playHighLight = () => {
    if (hightlight.current) {
        hightlight.current.currentTime = 0;
        hightlight.current.play();
    }
}

const playError = () => {
    if (error.current) {
        error.current.currentTime = 0; 
        error.current.play()
    }
}

const playVictory = () => {
    if (victory.current){
        victory.current.currentTime = 0;
        victory.current.play()
    }
}
const playWoodTap = () => {
    if (woodTap.current){
        woodTap.current.currentTime = 0;
        woodTap.current.play()
    }
}

const steps = [{
        step: '1',
        text: "Always try to predict where your final seed will land before making a move. Thinking several steps ahead greatly improves your chances of creating captures and avoiding mistakes.",
        voice: tipsOne
    },{
        step: '2',
        text: "Maintaining two or three seeds in several of your pits gives you more options for future turns and increases your chances of creating chain moves.",
        voice: tipsTwo

    },{
        step: '3',
        text: "Make good use of pits containing five or more seeds. These allow you to spread seeds farther around the board and gain better control of the game.",
        voice: tipsThree

    },{
        step: '4',
        text: "Watch your opponent's possible moves carefully. Anticipating their strategy helps you avoid giving away easy captures while creating opportunities for yourself.",
        voice: tipsFour

    }, {
        step: '5',
        text: "Congratulations! You've completed the Oware tutorial. You now understand the basic rules, how to sow seeds, capture your opponent's seeds, and think strategically before each move. Keep practising to sharpen your skills, challenge stronger opponents, and enjoy one of Africa's greatest traditional board games. Good luck, and have fun playing!",
        voice : endSound
    } ]

//Navigate
const navigate = useNavigate()

const goBack = () => {
        navigate(-1)
        woodTap.current.currentTime = 0
        woodTap.current.play()
    }

const goForward = () => {
    navigate(1)
    woodTap.current.currentTime = 0
    woodTap.current.play()  
}

const getBoardState = () => {
    console.log('i have played')    
}


const [currentStep, setCurrentStep] = useState(0)
    const [nextLesson, setNextLesson] = useState(false)
    const [previousLesson, setPreviousLesson] = useState(false)
    const [previousLessonVariable, setPreviousLessonVariable] = useState(false)

    const previousStep = () => {
        setCurrentStep((previous) => previous === 0 ? previous :  previous - 1)
        console.log(steps[currentStep].step)

        
    }

    const nextStep = () => {
        setCurrentStep((previous) => previous === steps.length - 1 ? previous : previous + 1)
        console.log(steps[currentStep].step)
    }

    const LessonState = () => {
        if(currentStep === steps.length - 1){
            setNextLesson(true)
        } else {
            setNextLesson(false)
        }
    }

    useEffect(() => {
        LessonState()
        PreviousLesson()
    }, [currentStep])

     const nextLessonNavigation = () => {
        playWoodTap()
        if (nextLesson){
            navigate('/selectionScreen')
        } else {
            nextStep()
        }
    }


    
    const PreviousLesson = () => {
        playWoodTap()
        if(currentStep === 0){
            setPreviousLessonVariable(true)
        } else {
            setPreviousLessonVariable(false)
        }
    }

    const PreviousLessonNavigation = () => {
        playWoodTap()
        if (previousLessonVariable){
            navigate('/owarelesson5')
        } else {
            previousStep()
        }
    }
    

    useEffect (() =>{
        const audio = voiceRef.current; 
    
        audio.src = steps[currentStep].voice; 
        audio.currentTime = 0; 
        
        audio.play().catch(() =>{
    
        })
    
        return () =>{
            audio.pause(); 
            audio.currentTime = 0;
        }
    
    }, [currentStep])
// BOARD STATE


const PIT_COUNT = 12
const STARTING_SEEDS = 4

const createEmptyBoard = () => Array(PIT_COUNT).fill(0)

const [board, setBoard] = useState(createEmptyBoard)
const seedRefs = useRef({}) // seedRefs.current[pitIndex] = array of seed DOM nodes
const pitRefs = useRef({}) // pitRefs.current[pitIndex] = the pit container DOM node

const registerSeedRef = (pitIndex, seedIndex, el) => {
    if (!seedRefs.current[pitIndex]) seedRefs.current[pitIndex] = []
    seedRefs.current[pitIndex][seedIndex] = el
}

const registerPitRef = (pitIndex, el) => {
    pitRefs.current[pitIndex] = el
}

// STORE STATE 

const [store1, setStore1] = useState(0) // user's captured seeds
const [store2, setStore2] = useState(0) // opponent's captured seeds

const storeSeedRefs = useRef({ 1: [], 2: [] })
const storeGlowRefs = useRef({ 1: null, 2: null })

const registerStoreSeedRef = (player, index, el) => {
    if (!storeSeedRefs.current[player]) storeSeedRefs.current[player] = []
    storeSeedRefs.current[player][index] = el
}

 const Pit = ({ pitIndex, beadCount }) => {
        return(
            <>
                 <div
                    ref={(el) => registerPitRef(pitIndex, el)}
                    className="w-27 h-27 rounded-full bg-[#5c3317] shadow-inner flex flex-wrap items-center justify-center gap-1 p-4">
                    {Array.from( {length: beadCount }).map((_, seedIndex) =>(
                        <div key={seedIndex}
                        ref={(el) => registerSeedRef(pitIndex, seedIndex, el)}
                        className='rounded-full bg-gradient-to-br from-grey-600 to-green-300 size-4'></div>

                    ))}
                </div>
            </>

        )
    }

    const StoreSeeds = ({ player, count }) => (
        <div
            ref={(el) => (storeGlowRefs.current[player] = el)}
            className="flex flex-wrap gap-1 justify-center items-center rounded-full px-2"
        >
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    ref={(el) => registerStoreSeedRef(player, i, el)}
                    className="rounded-full bg-gradient-to-br from-grey-600 to-green-300 size-3"
                />
            ))}
        </div>
    )

   

//Animation
const step1Sequence = [
    // 1. Board setup: Player 1 has 3 seeds in Pit 2
    { 
        type: "setupBoardState", 
        boardState: [2, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
    },
    { type: "pause", duration: 0.5 },

    // 2. Predict the move: Target Pit 2 (3 seeds) -> Lands in Pit 5
    { 
        type: "previewMovePrediction", 
        startPit: 2, 
        seedCount: 3 
    },
    { type: "pause", duration: 1.0 },

    // 3. Execute the move after prediction
    { type: "pickUpSeeds", pitIndex: 2 },
    { type: "pause", duration: 0.2 },
    { type: "sowSeedsCounterClockwise", startPit: 2, seedCount: 3 },
    { type: "pause", duration: 2.0 }
];

const step2Sequence = [
    // 1. Board setup: Player 1 has 2-3 seeds across Pits 1, 2, 3, and 4.
    // Opponent Pits 7 & 8 have 2 seeds each (ready to be captured when bumped to 4 or standard capture target).
    { 
        type: "setupBoardState", 
        boardState: [0, 2, 3, 2, 3, 0, 0, 3, 3, 0, 0, 0] 
    },
    { type: "pause", duration: 0.5 },

    // 2. Highlight Player 1's loaded pits to demonstrate multiple tactical options
    { 
        type: "highlightStrategicPits", 
        pits: [1, 2, 3, 4] 
    },
    { type: "pause", duration: 0.8 },

    // 3. Pick up 3 seeds from Pit 4
    { type: "pickUpSeeds", pitIndex: 4 },
    { type: "pause", duration: 0.3 },

    // 4. Sow seeds into Pits 5, 6, 7 (lands in Pit 7, bringing count from 3 -> 4)
    { type: "sowSeedsCounterClockwise", startPit: 4, seedCount: 3 },
    { type: "pause", duration: 0.3 },

    // 5. Execute capture on Pit 7
    { 
        type: "captureSeeds", 
        targetPit: 7, 
        playerStore: 1 
    },
    { type: "pause", duration: 1.5 }
];

const step3Sequence = [
    // 1. Board setup: Player 1 has a "heavy pit" (Pit 1 has 6 seeds).
    { 
        type: "setupBoardState", 
        boardState: [0, 6, 1, 0, 1, 0, 0, 2, 1, 0, 0, 0] 
    },
    { type: "pause", duration: 0.5 },

    // 2. Highlight Pit 1 (6 seeds) and preview its long sowing trajectory (reaches Pit 7)
    { 
        type: "highlightHeavyPit", 
        pitIndex: 1, 
        seedCount: 6 
    },
    { type: "pause", duration: 0.8 },

    // 3. Pick up all 6 seeds from Pit 1
    { type: "pickUpSeeds", pitIndex: 1 },
    { type: "pause", duration: 0.3 },

    // 4. Sow seeds continuously across 6 pits (Pits 2, 3, 4, 5, 6, 7)
    { type: "sowSeedsCounterClockwise", startPit: 1, seedCount: 6 },
    { type: "pause", duration: 0.5 },

    // 5. Highlight opponent pit 7 showing deep reach into enemy territory
    { 
        type: "highlightTerritoryReach", 
        targetPit: 7 
    },
    { type: "pause", duration: 1.5 }
];

const step4Sequence = [
    // 1. Board setup: Opponent (Pits 6-11) has Pit 7 prepped with 3 seeds,
    // threatening to sow into Pit 8 to make 4 seeds (an easy capture).
    { 
        type: "setupBoardState", 
        boardState: [0, 2, 1, 0, 0, 0, 0, 3, 3, 0, 0, 0] 
    },
    { type: "pause", duration: 0.5 },

    // 2. Highlight Opponent's threat pit (Pit 7) in Red to signal anticipation
    { 
        type: "highlightOpponentThreat", 
        threatPit: 7, 
        targetPit: 8 
    },
    { type: "pause", duration: 1.0 },

    // 3. Player 1 makes a defensive / proactive move from Pit 1 to block or adapt
    { type: "pickUpSeeds", pitIndex: 1 },
    { type: "pause", duration: 0.3 },

    // 4. Sow 2 seeds from Pit 1 into Pits 2 and 3 to reinforce Player 1's position
    { type: "sowSeedsCounterClockwise", startPit: 1, seedCount: 2 },
    { type: "pause", duration: 0.5 },

    // 5. Highlight Player 1's safe board state
    { type: "highlightSafeTerritory", player: 1 },
    { type: "pause", duration: 1.5 }
];
const stepSequences = {
    "1": step1Sequence,
    "2": step2Sequence,
    "3": step3Sequence,
    "4": step4Sequence,
};

useEffect(() => {

    const currentSequence = stepSequences[steps[currentStep].step];
    if (!currentSequence) return;

    const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 2,
        onRepeat: () => {
            resetBoard();
        }
    });

    currentSequence.forEach(action => {
        runAction(tl, action);
        tl.to({}, { duration: 1 });
    });

    return () => {
        tl.kill();
        resetBoard();
    };

}, [currentStep]);

const runAction = (tl, action) => {

switch(action.type){

        case "showBoard":
            tl.call(() => {
                setBoard(createEmptyBoard());
                setStore1(0);
                setStore2(0);
            });
            break;

case "fillBoard":

    for (let pit = 0; pit < PIT_COUNT; pit++) {

        // Put 4 seeds in this pit
        tl.call(() => {

            setBoard(prev => {
                const next = [...prev];
                next[pit] = STARTING_SEEDS;
                return next;
            });

        });

        // Let React mount the seeds
        tl.to({}, { duration: 0.05 });

        // Animate each seed dropping
        tl.call(() => {

            const seeds = seedRefs.current[pit] || [];

            seeds.forEach((seed, i) => {

                if (!seed) return;

                gsap.fromTo(
                    seed,
                    {
                        y: -30,
                        scale: 0,
                        opacity: 0
                    },
                    {
                        y: 0,
                        scale: 1,
                        opacity: 1,
                        duration: 0.28,
                        delay: i * 0.06,
                        ease: "back.out(2)"
                    }
                );

            });

           tl.call(playPlacePiece)
        });

        tl.to({}, { duration: 0.18 });

    }

    break;

    case "previewMovePrediction": {
    const { startPit, seedCount } = action;

    tl.call(() => {
        // 1. Highlight selected starting pit with a pulse
        const startEl = pitRefs.current[startPit];
        if (startEl) {
            gsap.to(startEl, {
                boxShadow: "0 0 25px 8px rgba(59, 130, 246, 0.9)", // Blue selection
                scale: 1.08,
                duration: 0.3,
                yoyo: true,
                repeat: 1
            });
        }

        // 2. Trace the path and highlight predicted landing pit
        for (let i = 1; i <= seedCount; i++) {
            const targetPit = (startPit + i) % PIT_COUNT;
            const pitEl = pitRefs.current[targetPit];
            const isLandingPit = i === seedCount;

            if (pitEl) {
                gsap.to(pitEl, {
                    boxShadow: isLandingPit
                        ? "0 0 30px 10px rgba(255, 215, 0, 1)"  // Gold target for landing pit
                        : "0 0 15px 4px rgba(96, 165, 250, 0.7)", // Light blue path
                    scale: isLandingPit ? 1.08 : 1.0,
                    duration: 0.4,
                    delay: i * 0.15,
                    yoyo: true,
                    repeat: 1
                });
            }
        }

        tl.call(playHighLight)
    });

    tl.to({}, { duration: 0.2 });
    break;
    
}
case "highlightOpponentThreat": {
    const { threatPit, targetPit } = action;

    tl.call(() => {
        // Flash threat pit in warning red
        const threatEl = pitRefs.current[threatPit];
        if (threatEl) {
            gsap.fromTo(
                threatEl,
                { boxShadow: "0 0 0px rgba(239, 68, 68, 0)" },
                {
                    boxShadow: "0 0 28px 10px rgba(239, 68, 68, 0.95)", // Warning Red
                    scale: 1.08,
                    duration: 0.4,
                    repeat: 2,
                    yoyo: true
                }
            );
        }

        // Trace line to potential capture target
        const targetEl = pitRefs.current[targetPit];
        if (targetEl) {
            gsap.to(targetEl, {
                boxShadow: "0 0 18px 6px rgba(248, 113, 113, 0.8)",
                duration: 0.4,
                delay: 0.2,
                repeat: 1,
                yoyo: true
            });
        }

       tl.call(playHighLight)
    });

    tl.to({}, { duration: 1.2 });
    break;
}

case "highlightSafeTerritory": {
    const { player } = action;
    const pits = player === 1 ? [0, 1, 2, 3, 4, 5] : [6, 7, 8, 9, 10, 11];

    tl.call(() => {
        pits.forEach((index, idx) => {
            const pit = pitRefs.current[index];
            if (!pit) return;

            gsap.to(pit, {
                boxShadow: "0 0 20px 6px rgba(34, 197, 94, 0.9)", // Green safety glow
                duration: 0.3,
                delay: idx * 0.05,
                repeat: 1,
                yoyo: true
            });
        });
    });

    tl.to({}, { duration: 0.4 });
    tl.call(playHighLight)
    
    break;
}
    case "declareDraw": {
    // Pulse both stores simultaneously in a neutral gold glow to signal a tie
    tl.call(() => {
        [1, 2].forEach(player => {
            const storeGlow = storeGlowRefs.current[player];
            if (storeGlow) {
                gsap.fromTo(
                    storeGlow,
                    { boxShadow: "0 0 0px rgba(234, 179, 8, 0)" },
                    {
                        boxShadow: "0 0 30px 10px rgba(234, 179, 8, 0.9)", // Gold glow for both
                        scale: 1.05,
                        duration: 0.5,
                        repeat: 2,
                        yoyo: true
                    }
                );
            }
        });

     tl.call(playError)
    });

    tl.to({}, { duration: 1.2 });
    break;

    
}

case "captureSeeds":
    const { targetPit, playerStore } = action;

    // 1. Gold pulse highlight on the pit to signal a valid 4-seed capture
    tl.call(() => {
        const pitEl = pitRefs.current[targetPit];
        if (pitEl) {
            gsap.to(pitEl, {
                boxShadow: "0 0 28px 10px rgba(255, 215, 0, 1)",
                scale: 1.08,
                duration: 0.35,
                yoyo: true,
                repeat: 1
            });
        }
    });

    tl.to({}, { duration: 0.5 });

    // 2. Animate the 4 seeds flying from the pit toward the player's store
    tl.call(() => {
        const seeds = seedRefs.current[targetPit] || [];

        seeds.forEach((seed, i) => {
            if (!seed) return;

            gsap.to(seed, {
                y: playerStore === 1 ? 80 : -80, // Move toward bottom store for Player 1
                scale: 0.5,
                opacity: 0,
                duration: 0.45,
                delay: i * 0.05,
                ease: "power2.in"
            });
        });

        if (woodTap.current) {
            woodTap.current.currentTime = 0;
            woodTap.current.play();
        }
    });

    tl.to({}, { duration: 0.5 });

    // 3. Clear target pit and update captured store count
    tl.call(() => {
        setBoard(prev => {
            const next = [...prev];
            next[targetPit] = 0;
            return next;
        });

        if (playerStore === 1) {
            setStore1(prev => prev + 4);
        } else {
            setStore2(prev => prev + 4);
        }
    });

    // 4. Highlight the store glowing to celebrate the point scored
    tl.call(() => {
        const storeGlow = storeGlowRefs.current[playerStore];
        if (storeGlow) {
            gsap.to(storeGlow, {
                boxShadow: "0 0 25px 8px rgba(34, 197, 94, 0.9)", // Green store glow
                duration: 0.4,
                yoyo: true,
                repeat: 1
            });
        }
    });

    tl.to({}, { duration: 0.5 });
    break;

    case "highlightStrategicPits": {
    const { pits } = action;

    // Pulse all strategic pits with cyan/emerald glows to emphasize options
    tl.call(() => {
        pits.forEach((pitIndex, idx) => {
            const pitEl = pitRefs.current[pitIndex];
            if (pitEl) {
                gsap.fromTo(
                    pitEl,
                    { boxShadow: "0 0 0px rgba(6, 182, 212, 0)" },
                    {
                        boxShadow: "0 0 22px 7px rgba(6, 182, 212, 0.9)", // Cyan strategy glow
                        scale: 1.06,
                        duration: 0.35,
                        delay: idx * 0.1,
                        repeat: 1,
                        yoyo: true
                    }
                );
            }
        });

        tl.call(playHighLight)
    });

    tl.to({}, { duration: 1.0 });
    break;
}
case "sweepRemainingSeeds": {
    // 1. Animate remaining board seeds sweeping into each player's store
    tl.call(() => {
        // Player 1 sweeps Pits 0-5
        for (let i = 0; i <= 5; i++) {
            const seeds = seedRefs.current[i] || [];
            seeds.forEach((seed, idx) => {
                if (!seed) return;
                gsap.to(seed, {
                    y: 120,
                    scale: 0.5,
                    opacity: 0,
                    duration: 0.5,
                    delay: idx * 0.05,
                    ease: "power2.in"
                });
            });
        }

        // Player 2 sweeps Pits 6-11
        for (let i = 6; i <= 11; i++) {
            const seeds = seedRefs.current[i] || [];
            seeds.forEach((seed, idx) => {
                if (!seed) return;
                gsap.to(seed, {
                    y: -120,
                    scale: 0.5,
                    opacity: 0,
                    duration: 0.5,
                    delay: idx * 0.05,
                    ease: "power2.in"
                });
            });
        }

        if (woodTap.current) {
            woodTap.current.currentTime = 0;
            woodTap.current.play();
        }
    });

    tl.to({}, { duration: 0.6 });

    // 2. Clear remaining pits and add swept seeds to final scores
    tl.call(() => {
        setBoard(createEmptyBoard());
        setStore1(26); // 24 initial + 2 swept
        setStore2(20); // 18 initial + 2 swept
    });

    tl.to({}, { duration: 0.4 });
    break;
}

case "declareWinner": {
    const { winnerStore } = action;

    // Pulse the winning store with a glowing crown / victory effect
    tl.call(() => {
        const winningGlow = storeGlowRefs.current[winnerStore];
        if (winningGlow) {
            gsap.fromTo(
                winningGlow,
                { boxShadow: "0 0 0px rgba(255, 215, 0, 0)" },
                {
                    boxShadow: "0 0 35px 12px rgba(255, 215, 0, 1)", // Bright Gold
                    scale: 1.1,
                    duration: 0.5,
                    repeat: 3,
                    yoyo: true
                }
            );
        }
    });

    tl.to({}, { duration: 1.2 });
    break;
}

case "highlightHeavyPit": {
    const { pitIndex, seedCount } = action;

    // 1. Pulse the heavy pit with a purple power glow
    tl.call(() => {
        const pitEl = pitRefs.current[pitIndex];
        if (pitEl) {
            gsap.fromTo(
                pitEl,
                { boxShadow: "0 0 0px rgba(168, 85, 247, 0)" },
                {
                    boxShadow: "0 0 28px 10px rgba(168, 85, 247, 0.95)", // Purple power glow
                    scale: 1.1,
                    duration: 0.4,
                    repeat: 1,
                    yoyo: true
                }
            );
        }
    });

    // 2. Trace the long trajectory across the board
    tl.call(() => {
        for (let i = 1; i <= seedCount; i++) {
            const targetPit = (pitIndex + i) % PIT_COUNT;
            const pitEl = pitRefs.current[targetPit];

            if (pitEl) {
                gsap.to(pitEl, {
                    boxShadow: "0 0 16px 5px rgba(192, 132, 252, 0.8)", // Light purple trace path
                    duration: 0.3,
                    delay: i * 0.08,
                    repeat: 1,
                    yoyo: true
                });
            }
        }

      tl.call(playHighLight)
    });

    tl.to({}, { duration: 1.2 });
    break;
}

case "highlightTerritoryReach": {
    const { targetPit } = action;

    // Gold/Green highlight on distant pit reached in opponent territory
    tl.call(() => {
        const pitEl = pitRefs.current[targetPit];
        if (pitEl) {
            gsap.to(pitEl, {
                boxShadow: "0 0 25px 8px rgba(34, 197, 94, 0.9)", // Emerald success glow
                scale: 1.08,
                duration: 0.4,
                repeat: 2,
                yoyo: true
            });
        }
    });

    tl.to({}, { duration: 0.8 });
    break;
}

case "setStoreScores": {
    tl.call(() => {
        setStore1(action.store1);
        setStore2(action.store2);
    });
    tl.to({}, { duration: 0.1 });
    break;
}

case "scoreUpdate": {
    const { winnerStore, addedSeeds } = action;

    // Pulse store and increment total count
    tl.call(() => {
        if (winnerStore === 1) {
            setStore1(prev => prev + addedSeeds);
        } else {
            setStore2(prev => prev + addedSeeds);
        }

        if (woodTap.current) {
            woodTap.current.currentTime = 0;
            woodTap.current.play();
        }
    });

    tl.to({}, { duration: 0.4 });
    break;
}

case "highlightWinner": {
    const { winnerStore } = action;

    tl.call(() => {
        const storeGlow = storeGlowRefs.current[winnerStore];
        if (storeGlow) {
            gsap.to(storeGlow, {
                boxShadow: "0 0 35px 12px rgba(255, 215, 0, 1)", // Gold Victory Glow
                scale: 1.08,
                duration: 0.5,
                repeat: 3,
                yoyo: true
            });
        }
    });

    tl.to({}, { duration: 0.5 });
    tl.call(playVictory)
    break;
}

case "denyCaptureInOpponentTerritory": {
    const { targetPit } = action;

    // 1. Flash target pit in red to indicate an invalid/disallowed capture
    tl.call(() => {
        const pitEl = pitRefs.current[targetPit];
        if (pitEl) {
            gsap.to(pitEl, {
                boxShadow: "0 0 25px 8px rgba(239, 68, 68, 0.9)", // Warning Red
                scale: 1.05,
                duration: 0.3,
                repeat: 2,
                yoyo: true
            });
        }
    });

    tl.to({}, { duration: 0.8 });

    // 2. Keep seeds in the pit without moving them to the store
    tl.call(() => {
        // Pits remain untouched, state stays at 4
        console.log(`Pit ${targetPit} formed 4 seeds in opponent territory - No capture made.`);
    });

    tl.to({}, { duration: 0.5 });
    tl.call(playError)
    break;
}

case "sweepRemainingSeeds": {
    // 1. Animate remaining board seeds sweeping into each player's store
    tl.call(() => {
        // Player 1 sweeps Pits 0-5
        for (let i = 0; i <= 5; i++) {
            const seeds = seedRefs.current[i] || [];
            seeds.forEach((seed, idx) => {
                if (!seed) return;
                gsap.to(seed, {
                    y: 120, // Down into Player 1 store
                    scale: 0.5,
                    opacity: 0,
                    duration: 0.5,
                    delay: idx * 0.05,
                    ease: "power2.in"
                });
            });
        }

        // Player 2 sweeps Pits 6-11
        for (let i = 6; i <= 11; i++) {
            const seeds = seedRefs.current[i] || [];
            seeds.forEach((seed, idx) => {
                if (!seed) return;
                gsap.to(seed, {
                    y: -120, // Up into Player 2 store
                    scale: 0.5,
                    opacity: 0,
                    duration: 0.5,
                    delay: idx * 0.05,
                    ease: "power2.in"
                });
            });
        }

        if (woodTap.current) {
            woodTap.current.currentTime = 0;
            woodTap.current.play();
        }
    });

    tl.to({}, { duration: 0.6 });

    // 2. Clear board and finalize total seed scores
    tl.call(() => {
        setBoard(createEmptyBoard());
        setStore1(26); // 24 initial + 2 remaining
        setStore2(20); // 18 initial + 2 remaining
    });

    tl.to({}, { duration: 0.4 });
    break;
}

case "declareWinner": {
    const { winnerStore } = action;

    // Highlight winning store container with victory animation
    tl.call(() => {
        const winningGlow = storeGlowRefs.current[winnerStore];
        if (winningGlow) {
            gsap.fromTo(
                winningGlow,
                { boxShadow: "0 0 0px rgba(255, 215, 0, 0)" },
                {
                    boxShadow: "0 0 35px 12px rgba(255, 215, 0, 1)", // Gold Victory Glow
                    scale: 1.1,
                    duration: 0.5,
                    repeat: 3,
                    yoyo: true
                }
            );
        }
    });

    tl.to({}, { duration: 0.6 });
    tl.call(playVictory)
    break;
}

case "highlightCapturedPit": {
    tl.call(() => {
        const pitEl = pitRefs.current[action.targetPit];
        if (pitEl) {
            gsap.to(pitEl, {
                boxShadow: "0 0 25px 8px rgba(255, 215, 0, 1)",
                scale: 1.05,
                duration: 0.3,
                repeat: 1,
                yoyo: true
            });
        }
    });
    tl.to({}, { duration: 0.4 });
    tl.call(playHighLight)
    break;
}

case "moveSeedsToContainer": {
    const { targetPit, playerStore } = action;

    // 1. Animate seeds lifting and sliding toward the collection store
    tl.call(() => {
        const seeds = seedRefs.current[targetPit] || [];

        seeds.forEach((seed, i) => {
            if (!seed) return;

            gsap.to(seed, {
                y: playerStore === 1 ? 120 : -120, // Moves downward into Player 1's store
                scale: 0.6,
                opacity: 0,
                duration: 0.5,
                delay: i * 0.06,
                ease: "power2.inOut"
            });
        });

        if (woodTap.current) {
            woodTap.current.currentTime = 0;
            woodTap.current.play();
        }
    });

    tl.to({}, { duration: 0.6 });

    // 2. Empty pit state and add seeds to the collection container count
    tl.call(() => {
        setBoard(prev => {
            const next = [...prev];
            next[targetPit] = 0;
            return next;
        });

        if (playerStore === 1) {
            setStore1(prev => prev + 4);
        } else {
            setStore2(prev => prev + 4);
        }
    });

    // 3. Pulse the collection container in green to show receipt of seeds
    tl.call(() => {
        const storeGlow = storeGlowRefs.current[playerStore];
        if (storeGlow) {
            gsap.to(storeGlow, {
                boxShadow: "0 0 25px 8px rgba(34, 197, 94, 0.9)",
                duration: 0.4,
                repeat: 1,
                yoyo: true
            });
        }
    });

    tl.to({}, { duration: 0.5 });
    break;
}

case "verifyBoard":

    tl.call(()=>{

        Object.values(pitRefs.current).forEach(pit=>{

            if(!pit) return;

            gsap.to(pit,{
                boxShadow:"0 0 18px rgba(255,215,0,.8)",
                duration:.25,
                yoyo:true,
                repeat:1
            });

        });

    });

    tl.to({}, {duration:2});

break;

case "highlightTerritories":

    tl.call(() => {

        const user = [0, 1, 2, 3, 4, 5];
        const robot = [6, 7, 8, 9, 10, 11];

        user.forEach(index => {

            const pit = pitRefs.current[index];
            if (!pit) return;

            gsap.to(pit, {
                boxShadow: "0 0 20px 6px rgba(124,255,124,0.9)",
                duration: 0.35,
                repeat: 3,
                yoyo: true
            });

        });

        robot.forEach(index => {

            const pit = pitRefs.current[index];
            if (!pit) return;

            gsap.to(pit, {
                boxShadow: "0 0 20px 6px rgba(255,80,80,0.9)",
                duration: 0.35,
                repeat: 3,
                yoyo: true
            });

        });

    });

    tl.to({}, { duration: 0.5 });

    break;

    case "sowSeedsCounterClockwise":
    const { startPit, seedCount } = action;

    for (let step = 1; step <= seedCount; step++) {
        // Calculate counter-clockwise pit index: (start + step) % 12
        const targetPit = (startPit + step) % PIT_COUNT;

        // 1. Highlight the current pit being sown into
        tl.call(() => {
            const pitEl = pitRefs.current[targetPit];
            if (pitEl) {
                gsap.fromTo(
                    pitEl,
                    { boxShadow: "0 0 0px rgba(255, 215, 0, 0)" },
                    {
                        boxShadow: "0 0 20px 5px rgba(255, 215, 0, 0.9)",
                        duration: 0.2,
                        yoyo: true,
                        repeat: 1
                    }
                );
            }
        });

        // 2. Increment state count for target pit
        tl.call(() => {
            setBoard(prev => {
                const next = [...prev];
                next[targetPit] += 1;
                return next;
            });
        });

        // 3. Small render buffer for React DOM node creation
        tl.to({}, { duration: 0.05 });

        // 4. Animate the newly placed seed dropping into place
        tl.call(() => {
            const seeds = seedRefs.current[targetPit] || [];
            const lastSeedIndex = seeds.length - 1;
            const newSeed = seeds[lastSeedIndex];

            if (newSeed) {
                gsap.fromTo(
                    newSeed,
                    { y: -30, scale: 0, opacity: 0 },
                    {
                        y: 0,
                        scale: 1,
                        opacity: 1,
                        duration: 0.25,
                        ease: "back.out(2)"
                    }
                );
            }

            // Play tap sound
            if (woodTap.current) {
                woodTap.current.currentTime = 0;
                woodTap.current.play();
            }
        });

        // Stagger time delay between dropping seeds into consecutive pits
        tl.to({}, { duration: 0.35 });
    }
    break;

    case "setupBoardState":
    tl.call(() => {
        setBoard(action.boardState);
    });
    tl.to({}, { duration: 0.1 });
    break;

    case "verifyPits":

    for (let pit = 0; pit < PIT_COUNT; pit++) {

        tl.call(() => {

            const target = pitRefs.current[pit];
            if (!target) return;

            gsap.timeline()

                .to(target, {
                    boxShadow: "0 0 22px 7px rgba(255,215,0,0.9)",
                    duration: 0.25
                })

                .to(target, {
                    boxShadow: "none",
                    duration: 0.25
                });

        });

        tl.to({}, { duration: 0.22 });

    }

    break;

case "pause":
    tl.to({}, { duration: action.duration || 1 });
    break;

case "pickUpSeeds":
    tl.call(() => {
        const pitToPick = action.pitIndex;
        
        // Highlight picked pit
        const pitEl = pitRefs.current[pitToPick];
        if (pitEl) {
            gsap.to(pitEl, {
                boxShadow: "0 0 25px 8px rgba(255, 215, 0, 0.9)",
                duration: 0.3,
                yoyo: true,
                repeat: 1
            });
        }

        // Lift seeds out
        const seeds = seedRefs.current[pitToPick] || [];
        seeds.forEach((seed, i) => {
            if (!seed) return;
            gsap.to(seed, {
                y: -40,
                scale: 1.2,
                opacity: 0,
                duration: 0.3,
                delay: i * 0.04
            });
        });

        if (woodTap.current) {
            woodTap.current.currentTime = 0;
            woodTap.current.play();
        }
    });

    tl.to({}, { duration: 0.4 });

    // Clear board state for pit
    tl.call(() => {
        setBoard(prev => {
            const next = [...prev];
            next[action.pitIndex] = 0;
            return next;
        });
    });
    break;

}}

const placeSeeds = (tl, pit, count) => {

    tl.call(() => {

        setBoard(prev => {

            const next = [...prev];
            next[pit] = count;
            return next;

        });

    });

    tl.to({}, { duration: .05 });

    tl.call(() => {

        const seeds = seedRefs.current[pit] || [];

        seeds.forEach((seed, i) => {

            if(!seed) return;

            gsap.fromTo(
                seed,
                {
                    scale:0,
                    y:-20,
                    opacity:0
                },
                {
                    scale:1,
                    y:0,
                    opacity:1,
                    duration:.3,
                    delay:i*.05,
                    ease:"back.out(2)"
                }
            );

        });

    });

}

const resetBoard = () => {

    // Reset board state
    setBoard(createEmptyBoard());

    // Reset stores
    setStore1(0);
    setStore2(0);

    // Stop and clear every seed animation
    Object.values(seedRefs.current).forEach(seeds => {
        (seeds || []).forEach(seed => {
            if (!seed) return;

            gsap.killTweensOf(seed);
            gsap.set(seed, {
                clearProps: "all"
            });
        });
    });

    // Stop and clear pit highlights
    Object.values(pitRefs.current).forEach(pit => {
        if (!pit) return;

        gsap.killTweensOf(pit);
        gsap.set(pit, {
            clearProps: "boxShadow"
        });
    });

    // Stop and clear store seed animations
    [1, 2].forEach(player => {

        (storeSeedRefs.current[player] || []).forEach(seed => {
            if (!seed) return;

            gsap.killTweensOf(seed);
            gsap.set(seed, {
                clearProps: "all"
            });
        });

        const glow = storeGlowRefs.current[player];

        if (glow) {
            gsap.killTweensOf(glow);
            gsap.set(glow, {
                clearProps: "boxShadow"
            });
        }

    });

};




return(
<PageWrapper>
    <div className='absolute inset-0 bg-linear-to-r from-[#d4a017]/80 via-[#8b5a2b]/70 to-[#3b1f0f]/80 -z-1 min-h-screen flex flex-col items-center justify-center'>
        <img src={bg} alt="background image" className="absolute object-cover w-full h-full -z-1 opacity-[0.3]"/>   
    </div> 

    <div className='flex flex-col h-screen w-full'>

    <div className="absolute top-0 right-0 flex items-center gap-4 z-50 bg-dark/50 p-3 rounded-bl-lg">
        <ArrowLeft className=' left-3 size-8 cursor-pointer text-midGold' onClick={goBack} />
        <ArrowRight className=' size-8 text-gold-300 cursor-pointer text-midGold' onClick={goForward} />
        <House className=' size-7 text-gold-300 cursor-pointer text-midGold' onClick={() => {navigate('/selectionScreen')}}/>

    </div>


    <div className='flex flex-row items-start gap-4 p-6 shrink-0 ' >
        
            <img src={thinking_image} className='h-40 mt-15'/>

            <div>
                {/* <div>
                    <p className='text-4xl text-white'>
                        {
                            thinking.split("").map((dot, index) => (
                                <span
                                    key={index}
                                    style={{animationDelay: `${index * 0.2}s`}}
                                    className='inline-block animate-float'
                                >{dot}
                                </span>
                            ))
                        }
                    </p>
                </div> */}
                        
                <div className='relative w-[50%] shadow-lg rounded-lg p-3 text-[17px] backdrop-blur-md text-white bg-dark/30 mt-20 -ml-10'>
                    <p>{steps[currentStep].text}</p>
                </div>
                
            </div>          
        </div>

       <button onClick={nextLessonNavigation} className='absolute bottom-5 right-5 border-none p-3 text-xl rounded-lg cursor-pointer bg-gradient-to-br from-[#A47551] to-[#6B4226] text-[#F7E7CE] uppercase font-bold hover:scale-95 transition-smooth duration-300 flex items-center justify-center gap-3 bg-dark/30'> 
            <p>{nextLesson ? 'Complete Tutorial' : 'Next'}</p>
            <CornerDownRight /> 
        </button>

        <button onClick={PreviousLessonNavigation} className='absolute bottom-5 left-5 border-none p-3 w-40 text-xl rounded-lg cursor-pointer bg-gradient-to-br from-[#A47551] to-[#6B4226] text-[#F7E7CE] uppercase font-bold hover:scale-95 transition-smooth duration-300 flex items-center justify-center gap-3'> 
            <CornerDownLeft /> 
            <p>Previous</p>
        </button>

    
        <div className='absolute left-1/2 -translate-x-1/2 border-2 border-t-0 border-midGold rounded-br-lg rounded-bl-lg px-6 py-2 text-center bg-dark/90 text-darkgold shadow-midgold shadow-sm'>

            <div>
                <p className='uppercase text-3xl font-bold font-fingerpaint'>Tips and tricks</p>
            </div>

            <div className='flex items-center justify-between'>
                <p className=' text-midGold'>Lesson 7</p>
                <p className='text-midGold'>{`Step ${steps[currentStep].step}`}</p>
            </div>
            
        </div>

        <div className="flex-1 flex items-center justify-center">

            <div className="flex flex-col items-center">

                <div className="w-67 h-22 bg-[#6b3f1d] border-4 border-b-0 border-[#4a2a12] rounded-t-[3rem] shadow-2xl flex items-center justify-center gap-3 p-4">
                    <div className="w-65 h-17 bg-[#5c3317] rounded-t-[3rem] shadow-2xl flex items-center justify-center gap-3 p-4">
                        <StoreSeeds player={2} count={store2} />
                    </div>
                </div>

                <div className="bg-[#8b5a2b] p-6 border-x-4 border-[#5a3418] shadow-2xl rounded-4xl">

                <div className="flex gap-4 mb-5">

                    {[11, 10, 9, 8, 7, 6].map(i => (
                        <Pit key={i} pitIndex={i} beadCount={board[i]} />
                    ))}

                </div>

                <div className="flex gap-4">
                    {[0, 1, 2, 3, 4, 5].map(i => (
                        <Pit key={i} pitIndex={i} beadCount={board[i]} />
                    ))}
                </div>

                </div>

                <div className="w-67 h-22 bg-[#6b3f1d] border-4 border-t-0 border-[#4a2a12] rounded-b-[3rem] shadow-2xl flex items-center justify-center gap-3 p-4">
                    <div className="w-65 h-17 bg-[#5c3317] rounded-b-[3rem] flex items-center justify-center gap-3 p-4">
                        <StoreSeeds player={1} count={store1} />
                    </div>
                </div>

            </div>

        </div>
        
        

        
    
    </div>
</PageWrapper>


)
}

export default OwareLesson7