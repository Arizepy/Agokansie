import { useContext, useState, useRef, useEffect, } from 'react'
import gsap from 'gsap'
import PageWrapper from '../../../../WelcomeScreen/PageWrapper'
import bg from '../../../../assets/background-collage.png'
import thinking_image  from '../../../../assets/black_man_thinking.webp'
import { ArrowRight, ArrowLeft, CornerDownLeft, CornerDownRight, House} from 'lucide-react'
import { useNavigate } from "react-router-dom";
import woodTapSound from '../../../../assets/sound/woodTap.mp3'
import victorySound from '../../../../assets/sound/victory.mp3'
import errorSound from '../../../../assets/sound/error.mp3'
import placePiece from '../../../../assets/sound/piecePlacement.mp3'


//Lesson sound 
import introOne from '../../../../assets/sound/oware/introOne.m4a'
import introTwo from '../../../../assets/sound/oware/introTwo.m4a'
import introThree from '../../../../assets/sound/oware/introThree.m4a'


export default function OwareLesson1(){

const woodTap = useRef(new Audio(woodTapSound))
const pieceSound = useRef(new Audio(placePiece))
const voiceRef = useRef(new Audio());



const steps = [{
        step: '1',
        text: "Welcome! I'm Agokansie, your Oware companion. Whether this is your very first game or you're looking to sharpen your skills, I'll guide you every step of the way. By the end of this tutorial, you'll understand the rules, know how to capture seeds, and be ready to play your first complete game. Let's begin!",
        voice: introOne

    },{
        step: '2',
        text: "Oware is one of the oldest and most popular traditional African board games. It belongs to the Mancala family of games and has been played for centuries across West Africa. Although the rules are simple, mastering Oware requires planning, strategy, and careful thinking.",
        voice: introTwo

    },{
        step: '3',
        text: "The objective is simple: collect more seeds than your opponent. There are forty-eight seeds in total, so collecting twenty-five guarantees victory. If each player collects twenty-four seeds, the game ends in a draw.",
        voice: introThree

    } ]

    const playWoodTap = () => {
    if (woodTap.current){
        woodTap.current.currentTime = 0;
        woodTap.current.volume = 0.1
        woodTap.current.play()
    }
}



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
}, [currentStep])

const nextLessonNavigation = () => {
    playWoodTap()
    if (nextLesson){
        navigate('/owarelesson2')
    } 
    else{
        nextStep()
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



//Board state
const getBoardState = () => {
    console.log('i have played')    
}


const PIT_COUNT = 12
const STARTING_SEEDS = 4

const createEmptyBoard = () => Array(PIT_COUNT).fill(0)

const [board, setBoard] = useState(createEmptyBoard)
const seedRefs = useRef({}) // seedRefs.current[pitIndex] = array of seed DOM nodes

const registerSeedRef = (pitIndex, seedIndex, el) => {
    if (!seedRefs.current[pitIndex]) seedRefs.current[pitIndex] = []
    seedRefs.current[pitIndex][seedIndex] = el
}

const Pit = ({ pitIndex, beadCount }) => {
        return(
            <>
                 <div className="w-27 h-27 rounded-full bg-[#5c3317] shadow-inner flex flex-wrap items-center justify-center gap-1 p-4">
                    <div className='grid grid-cols gap-1 justify-items-center items-center'></div>                        
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


//Store state
const [store1, setStore1] = useState(0) // user's captured seeds
const [store2, setStore2] = useState(0) // opponent's captured seeds

const storeSeedRefs = useRef({ 1: [], 2: [] })
const storeGlowRefs = useRef({ 1: null, 2: null })

const registerStoreSeedRef = (player, index, el) => {
    if (!storeSeedRefs.current[player]) storeSeedRefs.current[player] = []
    storeSeedRefs.current[player][index] = el
}

 
//Animation
const fillBoard = (tl) => {
for (let pit = 0; pit < PIT_COUNT; pit++) {
    tl.call(() => {
        setBoard(prev => {
            const next = [...prev]
            next[pit] = STARTING_SEEDS
            return next
        });
    });

    tl.to({}, { duration: 0.05 }); // let React mount this pit's seed nodes

    tl.call(() => {
        const seeds = seedRefs.current[pit] || [];
        seeds.forEach((seed, i) => {
            if (!seed) return;
            gsap.fromTo(seed,
                { scale: 0, y: -20, opacity: 0 },
                { scale: 1, y: 0, opacity: 1, duration: 0.7, delay: i * 0.05, ease: "back.out(2)" }
            );
        });

        pieceSound.current.currentTime = 0;
        pieceSound.current.volume = 0.01
        pieceSound.current.play();
        
    });

    tl.to({}, { duration: 0.15 }); // brief beat before the next pit starts filling
}
};

const showObjective = (tl) => {
const p1Target = 25; // guarantees victory
const p2Target = 19; // illustrative — clearly short of both 25 and the 24-24 draw line

const maxTicks = Math.max(p1Target, p2Target);

for (let i = 0; i < maxTicks; i++) {

    if (i < p1Target) {
        tl.call(() => setStore1(prev => prev + 1));
        tl.to({}, { duration: 0.04 });
        tl.call(() => {
            const seed = storeSeedRefs.current[1]?.[i];
            if (!seed) return;
            gsap.fromTo(seed,
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.2, ease: "back.out(2)" }
            );
        });
    }

    if (i < p2Target) {
        tl.call(() => setStore2(prev => prev + 1));
        tl.to({}, { duration: 0.04 });
        tl.call(() => {
            const seed = storeSeedRefs.current[2]?.[i];
            if (!seed) return;
            gsap.fromTo(seed,
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.2, ease: "back.out(2)" }
            );
        });
    }

    tl.to({}, { duration: 0.05 }); // both counters tick up together, in view
}

tl.call(() => {
    const store = storeGlowRefs.current[1];
    if (!store) return;
    gsap.to(store, {
        boxShadow: "0 0 25px 8px rgba(255,215,0,0.9)",
        duration: 0.6,
        yoyo: true,
        repeat: -1 // deliberately infinite — this should read as "settled," not a passing flash
    });
});

tl.to({}, { duration: 3 });
};

useEffect(() => {
if (steps[currentStep].step !== '3') {
    setBoard(createEmptyBoard());
    setStore1(0);
    setStore2(0);
    return;
}

const tl = gsap.timeline();
fillBoard(tl);
showObjective(tl);

return () => {
    tl.kill();

    // kill the infinite store glow explicitly — tl.kill() alone won't
    // reach it, since repeat:-1 tweens spun up inside tl.call() run
    // independently of the parent timeline
    [1, 2].forEach(player => {
        const store = storeGlowRefs.current[player];
        if (!store) return;
        gsap.killTweensOf(store);
        gsap.set(store, { boxShadow: "none" });
    });

    setBoard(createEmptyBoard());
    setStore1(0);
    setStore2(0);
};
}, [currentStep]);


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

        <button onClick={previousStep} className='absolute bottom-5 left-5 border-none p-3 w-40 text-xl rounded-lg cursor-pointer bg-gradient-to-br from-[#A47551] to-[#6B4226] text-[#F7E7CE] uppercase font-bold hover:scale-95 transition-smooth duration-300 flex items-center justify-center gap-3'> 
            <CornerDownLeft /> 
            <p>Previous</p>
        </button>

    
        <div className='absolute left-1/2 -translate-x-1/2 border-2 border-t-0 border-midGold rounded-br-lg rounded-bl-lg px-6 py-2 text-center bg-dark/90 text-darkgold shadow-midgold shadow-sm'>

            <div>
                <p className='uppercase text-3xl font-bold font-fingerpaint'>Introdution to oware</p>
            </div>

            <div className='flex items-center justify-between'>
                <p className=' text-midGold'>Lesson 1</p>
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
