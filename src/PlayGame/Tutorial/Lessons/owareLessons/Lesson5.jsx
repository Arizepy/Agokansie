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

//Lesson Sounds 
import soundOne from '../../../../assets/sound/oware/captureOne.m4a'
import soundTwo from '../../../../assets/sound/oware/captureTwo.m4a'
import soundThree from '../../../../assets/sound/oware/captureThree.m4a'
import soundFour from '../../../../assets/sound/oware/captureFour.m4a'


export default function OwareLesson5(){
    

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
        text: "You can capture seeds when your final seed lands in your opponent's territory and creates exactly four seeds in that pit.",
        voice: soundOne

    },{
        step: '2',
        text: "Captured seeds should immediately be removed from the board and placed into your collection container.",
        voice: soundTwo

    },{
        step: '3',
        text: "Capturing is only allowed in your own territory. Seeds that form four in your opponent's territory cannot be captured.",
        voice: soundThree

    },{
        step: '4',
        text: "Keep careful track of every captured seed, as the player with the most captured seeds at the end of the game wins.",
        voice: soundFour

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
    if (nextLesson){
        navigate('/owarelesson6')
    } 
    else{
        nextStep()
    }
}

const PreviousLesson = () => {
    if(currentStep === 0){
        setPreviousLessonVariable(true)
    } else {
        setPreviousLessonVariable(false)
    }
}

const PreviousLessonNavigation = () => {
    if (previousLessonVariable){
        navigate('/owarelesson4')
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


// STORE STATE (captured seeds)


const [store1, setStore1] = useState(0) // user's captured seeds
const [store2, setStore2] = useState(0) // opponent's captured seeds

const storeSeedRefs = useRef({ 1: [], 2: [] })
const storeGlowRefs = useRef({ 1: null, 2: null })

const registerStoreSeedRef = (player, index, el) => {
    if (!storeSeedRefs.current[player]) storeSeedRefs.current[player] = []
    storeSeedRefs.current[player][index] = el
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



//ANIMATION   
const step1Sequence = [
    // Setup: Pit 6 (opponent side) has 3 seeds. Player 1 has 2 seeds in Pit 5.
    { 
        type: "setupBoardState", 
        boardState: [0, 0, 0, 0, 0, 2, 3, 0, 0, 0, 0, 0] 
    },
    { type: "pause", duration: 0.5 },

    // Player 1 picks up 2 seeds from Pit 5
    { type: "pickUpSeeds", pitIndex: 5 },
    { type: "pause", duration: 0.3 },

    // Sow seeds: 1 in Pit 5 (not possible, moves to Pit 6 and Pit 7)
    // Sowing 2 seeds from Pit 5 lands in Pit 6 and Pit 7 (or 1 in 6, bringing pit 6 count to 4)
    { type: "sowSeedsCounterClockwise", startPit: 5, seedCount: 1 }, 
    { type: "pause", duration: 0.3 },

    // Pit 6 now has 4 seeds! Animate the capture into Store 1
    { 
        type: "captureSeeds", 
        targetPit: 6, 
        playerStore: 1 
    },
    { type: "pause", duration: 1.5 }
];

const step2Sequence = [
    // Setup: Opponent Pit 6 has 4 captured seeds ready, Player 1 Store is empty
    { 
        type: "setupBoardState", 
        boardState: [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0] 
    },
    { type: "pause", duration: 0.5 },

    // Highlight the captured pit with a golden ring
    { type: "highlightCapturedPit", targetPit: 6 },
    { type: "pause", duration: 0.3 },

    // Lift seeds directly out of Pit 6 and move them into Store 1
    { 
        type: "moveSeedsToContainer", 
        targetPit: 6, 
        playerStore: 1 
    },
    { type: "pause", duration: 1.5 }
];

const step3Sequence = [
    // Setup: Opponent Pit 7 has 3 seeds. Player 1 has 1 seed in Pit 5.
    { 
        type: "setupBoardState", 
        boardState: [0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0] 
    },
    { type: "pause", duration: 0.5 },

    // Player 1 picks up 1 seed from Pit 5
    { type: "pickUpSeeds", pitIndex: 5 },
    { type: "pause", duration: 0.3 },

    // Sows 1 seed into Pit 6 (Opponent side), bringing its total to 4
    { type: "sowSeedsCounterClockwise", startPit: 5, seedCount: 1 },
    { type: "pause", duration: 0.3 },

    // Deny capture! Highlight Pit 6 in red to show it CANNOT be captured
    { 
        type: "denyCaptureInOpponentTerritory", 
        targetPit: 6 
    },
    { type: "pause", duration: 1.5 }
];

const step4Sequence = [
    // 1. Initial end-game state: Player 1 has 22 seeds, Player 2 has 20 seeds
    { 
        type: "setupBoardState", 
        boardState: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
    },
    { type: "setStoreScores", store1: 22, store2: 20 },
    { type: "pause", duration: 0.8 },

    // 2. Final capture: Player 1 captures 4 more seeds (making 26 seeds total)
    { 
        type: "scoreUpdate", 
        winnerStore: 1, 
        addedSeeds: 4 
    },
    { type: "pause", duration: 0.5 },

    // 3. Highlight the winning collection container with a victory glow!
    { type: "highlightWinner", winnerStore: 1 },
    { type: "pause", duration: 2 }
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

            woodTap.current.currentTime = 0;
            woodTap.current.play();

        });

        tl.to({}, { duration: 0.18 });

    }
    tl.call (playPlacePiece)

    break;

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

case "setStoreScores": {
    tl.call(() => {
        setStore1(action.store1);
        setStore2(action.store2);
    });
    tl.to({}, { duration: 0.1 });
    tl.call(playHighLight)
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
    tl.call(playHighLight)
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

    tl.to({}, { duration: 0.3 });
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

    tl.to({}, { duration: 2.5 });

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

     tl.call(playPlacePiece)
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
            <p>{nextLesson ? 'Next Lesson' : 'Next'}</p>
            <CornerDownRight /> 
        </button>

        <button onClick={PreviousLessonNavigation} className='absolute bottom-5 left-5 border-none p-3 w-40 text-xl rounded-lg cursor-pointer bg-gradient-to-br from-[#A47551] to-[#6B4226] text-[#F7E7CE] uppercase font-bold hover:scale-95 transition-smooth duration-300 flex items-center justify-center gap-3'> 
            <CornerDownLeft /> 
            <p>Previous</p>
        </button>

    
        <div className='absolute left-1/2 -translate-x-1/2 border-2 border-t-0 border-midGold rounded-br-lg rounded-bl-lg px-6 py-2 text-center bg-dark/90 text-darkgold shadow-midgold shadow-sm'>

            <div>
                <p className='uppercase text-3xl font-bold font-fingerpaint'>Capturing Seeds</p>
            </div>

            <div className='flex items-center justify-between'>
                <p className=' text-midGold'>Lesson 5</p>
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


