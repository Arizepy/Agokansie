import { useContext, useState, useRef, useEffect, } from 'react'
import { gsap } from 'gsap'
import PageWrapper from '../../../../WelcomeScreen/PageWrapper'
import bg from '../../../../assets/background-collage.png'
import thinking_image  from '../../../../assets/black_man_thinking.webp'
import { ArrowRight, ArrowLeft, CornerDownLeft, CornerDownRight, House} from 'lucide-react'
import { useNavigate } from "react-router-dom";
import placePiece from '../../../../assets/sound/piecePlacement.mp3'
import Hightlight from '../../../../assets/sound/blocked.mp3'
import errorSound from '../../../../assets/sound/error.mp3'
import victorySound from '../../../../assets/sound/victory.mp3'
import woodTapSound from '../../../../assets/sound/woodTap.mp3'

//Lesson sounds
import soundOne from '../../../../assets/sound/oware/gameEndOne.m4a'
import soundTwo from '../../../../assets/sound/oware/gameEndTwo.m4a'
import soundThree from '../../../../assets/sound/oware/gameEndThree.m4a'
import soundFour from '../../../../assets/sound/oware/gameEndFour.m4a'


function OwareLesson6(){
    

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
        text: "A round comes to an end when only four seeds remain on the board. If one player has already captured four more seeds than the other, that player receives the remaining four seeds.",
        voice: soundOne
 
    },{
        step: '2',
        text: "After all captured and remaining seeds have been counted, the player with the highest total number of seeds is declared the winner.",
        voice: soundTwo

    },{
        step: '3',
        text: "If both players finish with the same number of seeds, the game is considered a draw.",
        voice: soundThree

    },{
        step: '4',
        text: "Once the winner has been announced, return all forty-eight seeds to the board to prepare for the next game.",
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
    navigate('/owarelesson7')
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

//Animation

const step1Sequence = [
    // 1. Initial State: Pits have a few remaining seeds left on each side
    // Player 1 side (0-5) has 2 seeds total, Player 2 side (6-11) has 2 seeds total
    { 
        type: "setupBoardState", 
        boardState: [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0] 
    },
    { type: "setStoreScores", store1: 24, store2: 18 },
    { type: "pause", duration: 0.8 },

    // 2. Sweep remaining seeds into their respective player containers
    { type: "sweepRemainingSeeds" },
    { type: "pause", duration: 0.8 },

    // 3. Declare the winner (Player 1 has 26 vs Player 2 has 20)
    { type: "declareWinner", winnerStore: 1 },
    { type: "pause", duration: 2 }
];

const step2Sequence = [
    // 1. End-game state: Pits have a few remaining seeds left
    // Player 1 territory (0-5) has 2 seeds total, Player 2 territory (6-11) has 2 seeds total
    { 
        type: "setupBoardState", 
        boardState: [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0] 
    },
    { type: "setStoreScores", store1: 24, store2: 18 },
    { type: "pause", duration: 0.8 },

    // 2. Sweep remaining seeds into respective collection containers
    { type: "sweepRemainingSeeds" },
    { type: "pause", duration: 0.8 },

    // 3. Declare winner based on highest total (Player 1: 26 vs Player 2: 20)
    { type: "declareWinner", winnerStore: 1 },
    { type: "pause", duration: 2 }
];

const step3Sequence = [
    // 1. Set equal end-game scores (24 vs 24)
    { 
        type: "setupBoardState", 
        boardState: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
    },
    { type: "setStoreScores", store1: 24, store2: 24 },
    { type: "pause", duration: 0.8 },

    // 2. Trigger tie game effect highlighting both stores equally
    { type: "declareDraw" },
    { type: "pause", duration: 2 }
];

const step4Sequence = [
    // 1. Start from end-game state: Pits are empty, stores contain the seeds
    { 
        type: "setupBoardState", 
        boardState: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
    },
    { type: "setStoreScores", store1: 24, store2: 24 },
    { type: "pause", duration: 0.8 },

    // 2. Clear stores back to zero
    { type: "clearStores" },
    { type: "pause", duration: 0.3 },

    // 3. Fill board back up with 4 seeds per pit (48 total)
    { type: "fillBoard" },
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

        });

        tl.to({}, { duration: 0.18 });

    }
    tl.call(playPlacePiece)

    break;

    case "clearStores": {
    tl.call(() => {
        setStore1(0);
        setStore2(0);

        // Flash store glows white/gold to signal reset
        [1, 2].forEach(player => {
            const storeGlow = storeGlowRefs.current[player];
            if (storeGlow) {
                gsap.to(storeGlow, {
                    boxShadow: "0 0 20px 5px rgba(255, 255, 255, 0.8)",
                    duration: 0.3,
                    repeat: 1,
                    yoyo: true
                });
            }
        });
    });
    tl.to({}, { duration: 0.3 });
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

        
    });

    tl.to({}, { duration: 0.3 });
    tl.call(playHighLight)
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

    tl.to({}, { duration: 0.2 });
    tl.call(playVictory)
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


    case "setupBoardState":
    tl.call(() => {
        setBoard(action.boardState);
    });
    tl.to({}, { duration: 0.1 });
    break;

   

case "pause":
    tl.to({}, { duration: action.duration || 1 });
    break;


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
            <p>{nextLesson ? 'Next Lesson' : 'Next'}</p>
            <CornerDownRight /> 
        </button>

        <button onClick={PreviousLessonNavigation} className='absolute bottom-5 left-5 border-none p-3 w-40 text-xl rounded-lg cursor-pointer bg-gradient-to-br from-[#A47551] to-[#6B4226] text-[#F7E7CE] uppercase font-bold hover:scale-95 transition-smooth duration-300 flex items-center justify-center gap-3'> 
            <CornerDownLeft /> 
            <p>Previous</p>
        </button>

    
        <div className='absolute left-1/2 -translate-x-1/2 border-2 border-t-0 border-midGold rounded-br-lg rounded-bl-lg px-6 py-2 text-center bg-dark/90 text-darkgold shadow-midgold shadow-sm'>

            <div>
                <p className='uppercase text-3xl font-bold font-fingerpaint'>The end of the game</p>
            </div>

            <div className='flex items-center justify-between'>
                <p className=' text-midGold'>Lesson 6</p>
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

export default OwareLesson6