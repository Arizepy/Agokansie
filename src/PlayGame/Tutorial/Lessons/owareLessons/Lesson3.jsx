import { useContext, useState, useRef, useEffect, } from 'react'
import PageWrapper from '../../../../WelcomeScreen/PageWrapper'
import bg from '../../../../assets/background-collage.png'
import thinking_image  from '../../../../assets/black_man_thinking.webp'
import { ArrowRight, ArrowLeft, CornerDownLeft, CornerDownRight, House} from 'lucide-react'
import { useNavigate } from "react-router-dom";
import woodTapSound from '../../../../assets/sound/woodTap.mp3'
import { gsap } from 'gsap'
import placePiece from '../../../../assets/sound/piecePlacement.mp3'
import Hightlight from '../../../../assets/sound/blocked.mp3'


//Tutorial voice
import lessonOne from '../../../../assets/sound/oware/boardLessonOne.m4a'
import lessonTwo from '../../../../assets/sound/oware/boardLessonTwo.m4a'
import lessonThree from '../../../../assets/sound/oware/boardLessonThree.m4a'
import lessonFour from '../../../../assets/sound/oware/boardLessonFour.m4a'



function OwareLesson3(){
    

const woodTap = useRef(new Audio(woodTapSound))
const pieceSound = useRef(new Audio(placePiece))
const hightlight  = useRef(new Audio(Hightlight))

const playPlacePiece = () => {
    if (pieceSound.current){
        pieceSound.current.currentTime = 0; 
        pieceSound.current.volume = 0.01;
        pieceSound.current.play()
        
    }
}
const playWoodTap = () => {
    if (woodTap.current){
        woodTap.current.currentTime = 0;
        woodTap.current.volume = 0.1
        woodTap.current.play()
    }
}

const playHighLight = () => {
    if (hightlight.current) {
        hightlight.current.currentTime = 0;
         hightlight.current.volume = 0.01;
        hightlight.current.play();
       
    }
}

const thinking = "..."

const voiceRef = useRef(new Audio());

    const steps = [{
        step: '1',
        text: "The Oware board consists of twelve pits arranged in two rows of six. Each row belongs to one player and represents that player's territory.",
        voice: lessonOne

    },{
        step: '2',
        text: "The game begins with a total of forty-eight seeds distributed evenly across the board. Every pit starts with exactly four seeds, ensuring both players begin with an equal advantage.",
        voice: lessonTwo

    },{
        step: '3',
        text: "Before the game starts, take a moment to confirm that every pit contains four seeds and that the board is correctly arranged.",
        voice: lessonThree

    },{
        step: '4',
        text: "Decide who will play first before the game begins, as players will alternate turns until the game ends.  ",
        voice: lessonFour

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
    playWoodTap
    if (nextLesson){
        navigate('/owarelesson4')
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
        navigate('/owarelesson2')
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


//Store state
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
    {type: "fillBoard"},
    {type: "highlightTerritories"}

];
const step2Sequence = [

    {type: "fillBoard"},
    { type: "pause",
        duration: 1 }

];

const step3Sequence = [

    { type: "fillBoard"},
    {type: "verifyPits" }
];

const step4Sequence = [
    { type:"fillBoard" },
    { type:"highlightTerritory", player:1 },
    { type:"highlightTerritory", player:2 }

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
        tl.call(playPlacePiece)

    }

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
    tl.call(playHighLight)
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
        tl.call(playHighLight)


    }
        


    break;

    }

}

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
                <p className='uppercase text-3xl font-bold font-fingerpaint'>Understanding the board</p>
            </div>

            <div className='flex items-center justify-between'>
                <p className=' text-midGold'>Lesson 3</p>
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

export default OwareLesson3

