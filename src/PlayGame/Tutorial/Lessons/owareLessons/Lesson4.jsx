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

//Tutorial sounds 
import stepOneAudio from '../../../../assets/sound/oware/sowingOne.m4a'
import stepTwoAudio from '../../../../assets/sound/oware/sowingTwo.m4a'
import stepThreeAudio from '../../../../assets/sound/oware/sowingThree.m4a'
import stepFourAudio from '../../../../assets/sound/oware/sowingFour.m4a'


export default function OwareLesson4(){
    

const woodTap = useRef(new Audio(woodTapSound))
const pieceSound = useRef(new Audio(placePiece))
const hightlight  = useRef(new Audio(Hightlight))

const playPlacePiece = () => {
    if (pieceSound.current){
        pieceSound.current.currentTime = 0; 
        pieceSound.current.volume = 0.1
        pieceSound.current.play()
    }
}

const playHighLight = () => {
    if (hightlight.current) {
        hightlight.current.currentTime = 0;
        hightlight.current.volume = 0.1
        hightlight.current.play();
    }
}
const playWoodTap = () => {
    if (woodTap.current){
        woodTap.current.currentTime = 0;
        woodTap.current.volume = 0.1
        woodTap.current.play()
    }
}

const voiceRef = useRef(new Audio());



const steps = [{
        step: '1',
        text: "Players take turns making moves. On your turn, choose one pit from your own territory and pick up every seed from that pit.",
        voice: stepOneAudio

    },{
        step: '2',
        text: "Moving in a counter-clockwise direction, place one seed into each pit until you have distributed all the seeds in your hand.",
        voice: stepTwoAudio

    },{
        step: '3',
        text: "If your final seed lands in a pit that already contains other seeds, pick up all the seeds from that pit and continue sowing. This process may repeat several times during the same turn.",
        voice: stepThreeAudio

    },{
        step: '4',
        text: "If your final seed lands in an empty pit, your turn ends immediately and play passes to your opponent. If your opponent has no seeds remaining, you must make a move that gives them seeds so the game can continue.",
        voice: stepFourAudio

    } ]


//Navigation
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
    playWoodTap
    if (nextLesson){
        navigate('/owarelesson5')
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
    playWoodTap()
    if (previousLessonVariable){
        navigate('/owarelesson3')
    } else {
        previousStep()
    }
}


const getBoardState = () => {
    console.log('i have played')    
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


// Store seed

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
    { type: "fillBoard" },
    { type: "pause", duration: 0.5 },
    { 
        type: "pickUpSeeds", 
        pitIndex: 2 // Picks up 4 seeds from pit index 2 (Player 1 territory)
    },
    { type: "pause", duration: 1.5 }
];

const step2Sequence = [
    { type: "fillBoard" },
    { type: "pause", duration: 0.5 },
    { 
        type: "pickUpSeeds", 
        pitIndex: 2 // Picks up 4 seeds from pit 2
    },
    { type: "pause", duration: 0.4 },
    { 
        type: "sowSeedsCounterClockwise", 
        startPit: 2, 
        seedCount: 4 // Distributes seeds to pits 3, 4, 5, and 6
    },
    { type: "pause", duration: 1.5 }
];

const step3Sequence = [
    { type: "fillBoard" },
    { type: "pause", duration: 0.5 },
    
    // First pickup (4 seeds from Pit 2)
    { type: "pickUpSeeds", pitIndex: 2 },
    { type: "pause", duration: 0.3 },
    
    // First sow: places 1 seed into pits 3, 4, 5, and 6
    { type: "sowSeedsCounterClockwise", startPit: 2, seedCount: 4 },
    { type: "pause", duration: 0.3 },

    // Continuous sowing trigger: Highlight pit 6 (now has 5 seeds) and scoop them up
    { 
        type: "pickupAndContinue", 
        pitIndex: 6 
    },
    { type: "pause", duration: 0.3 },

    // Second sow: places 1 seed into pits 7, 8, 9, 10, and 11
    { type: "sowSeedsCounterClockwise", startPit: 6, seedCount: 5 },
    { type: "pause", duration: 1.5 }
];  

const step4Sequence = [
    // --- PART 1: Turn Ends on Empty Pit ---
    // Setup: Pit 0 has 2 seeds, Pit 2 is completely empty
    { 
        type: "setupBoardState", 
        boardState: [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
    },
    { type: "pause", duration: 0.5 },

    // Pick up 2 seeds from Pit 0
    { type: "pickUpSeeds", pitIndex: 0 },
    { type: "pause", duration: 0.3 },

    // Sow seeds into Pit 1 and Pit 2 (lands in empty Pit 2)
    { type: "sowSeedsCounterClockwise", startPit: 0, seedCount: 2 },
    { type: "pause", duration: 0.3 },

    // Flash red highlight on Pit 2 and shift turn to Player 2
    { type: "endTurnOnEmptyPit", landedPit: 2 },
    { type: "pause", duration: 2 },

    // --- PART 2: Mandatory Feeding Rule ---
    // Setup: Opponent side (6-11) is empty. Player 1 has 4 seeds in Pit 4.
    { 
        type: "setupBoardState", 
        boardState: [0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0] 
    },
    { type: "pause", duration: 0.5 },

    // Highlight opponent's empty side in red to show starvation
    { type: "highlightEmptyOpponent" },
    { type: "pause", duration: 0.5 },

    // Pick up 4 seeds from Pit 4
    { type: "pickUpSeeds", pitIndex: 4 },
    { type: "pause", duration: 0.3 },

    // Sow 4 seeds (lands in 5, 6, 7, 8 - feeding opponent pits 6, 7, 8)
    { type: "sowSeedsCounterClockwise", startPit: 4, seedCount: 4 },
    { type: "pause", duration: 0.3 },

    // Highlight fed pits in green to confirm valid move
    { type: "confirmFedOpponent" },
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
tl.call (playPlacePiece)
break;


case "pause":
tl.to({}, { duration: action.duration || 1 });
break;

case "pickUpSeeds":
const pitToPick = action.pitIndex;

// 1. Highlight the chosen pit visually
tl.call(() => {
const pitEl = pitRefs.current[pitToPick];
if (pitEl) {
gsap.to(pitEl, {
    boxShadow: "0 0 25px 8px rgba(255, 215, 0, 0.9)",
    duration: 0.3,
    yoyo: true,
    repeat: 1
});
}
});

tl.to({}, { duration: 0.4 });

// 2. Animate seeds lifting up and fading out
tl.call(() => {
const seeds = seedRefs.current[pitToPick] || [];

seeds.forEach((seed, i) => {
if (!seed) return;

gsap.to(seed, {
    y: -50,
    scale: 1.3,
    opacity: 0,
    duration: 0.35,
    delay: i * 0.05,
    ease: "power2.out"
});
});

if (woodTap.current) {
woodTap.current.currentTime = 0;
woodTap.current.play();
}
});

tl.to({}, { duration: 0.5 });

// 3. Update React state so the pit is officially empty (beadCount = 0)
tl.call(() => {
setBoard(prev => {
const next = [...prev];
next[pitToPick] = 0;
return next;
});
});

tl.to({}, { duration: 0.1 });
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

});

// Stagger time delay between dropping seeds into consecutive pits
tl.to({}, { duration: 0.35 });
}
tl.call(() => {
    if (woodTap.current){
        woodTap.current.currentTime = 0;
        woodTap.current.play()
    }
})

break;

case "setupBoardState":
tl.call(() => {
setBoard(action.boardState);
});
tl.to({}, { duration: 0.1 });
break;

case "endTurnOnEmptyPit":
const emptyPitIndex = action.landedPit;

// Red glow on the empty landing pit showing turn termination
tl.call(() => {
const pitEl = pitRefs.current[emptyPitIndex];
if (pitEl) {
gsap.to(pitEl, {
    boxShadow: "0 0 25px 8px rgba(239, 68, 68, 0.9)",
    duration: 0.4,
    repeat: 1,
    yoyo: true
});
}
});

tl.to({}, { duration: 0.8 });
tl.call(playHighLight)

// Flash opponent store to signal turn transition
tl.call(() => {
const store2Glow = storeGlowRefs.current[2];
if (store2Glow) {
gsap.to(store2Glow, {
    boxShadow: "0 0 20px 6px rgba(255, 215, 0, 0.8)",
    duration: 0.4,
    repeat: 1,
    yoyo: true
});
}
});
break;

case "highlightEmptyOpponent":
// Flash opponent's side (pits 6-11) in red to highlight starvation
tl.call(() => {
for (let i = 6; i <= 11; i++) {
const pitEl = pitRefs.current[i];
if (pitEl) {
    gsap.to(pitEl, {
        boxShadow: "0 0 18px 5px rgba(239, 68, 68, 0.8)",
        duration: 0.3,
        repeat: 1,
        yoyo: true
    });
}
}
});
tl.to({}, { duration: 0.6 });
tl.call(playHighLight)
break;

case "confirmFedOpponent":
// Flash fed opponent pits in green to confirm rule compliance
tl.call(() => {
for (let i = 6; i <= 11; i++) {
const pitEl = pitRefs.current[i];
if (pitEl) {
    gsap.to(pitEl, {
        boxShadow: "0 0 22px 6px rgba(34, 197, 94, 0.9)",
        duration: 0.4,
        repeat: 1,
        yoyo: true
    });
}
}
});
tl.to({}, { duration: 0.8 });  
tl.call(playHighLight)
break;


case "pickupAndContinue":
const targetPit = action.pitIndex;

// 1. Highlight the landing pit to draw attention to the multi-lap trigger
tl.call(() => {
const pitEl = pitRefs.current[targetPit];
if (pitEl) {
gsap.to(pitEl, {
    boxShadow: "0 0 25px 8px rgba(255, 215, 0, 1)",
    scale: 1.05,
    duration: 0.3,
    yoyo: true,
    repeat: 1
});
}
});

tl.to({}, { duration: 0.4 });

// 2. Lift up and animate all seeds out of the landing pit
tl.call(() => {
const seeds = seedRefs.current[targetPit] || [];

seeds.forEach((seed, i) => {
if (!seed) return;

gsap.to(seed, {
    y: -50,
    scale: 1.3,
    opacity: 0,
    duration: 0.3,
    delay: i * 0.04,
    ease: "power2.out"
});
});

tl.call(playPlacePiece)
});

tl.to({}, { duration: 0.4 });

// 3. Clear state for target pit so it becomes empty (beadCount = 0)
tl.call(() => {
setBoard(prev => {
const next = [...prev];
next[targetPit] = 0;
return next;
});
});

tl.to({}, { duration: 0.1 });
break;

t
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
                <p className='uppercase text-3xl font-bold font-fingerpaint'>Sowing Seeds</p>
            </div>

            <div className='flex items-center justify-between'>
                <p className=' text-midGold'>Lesson 4</p>
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


