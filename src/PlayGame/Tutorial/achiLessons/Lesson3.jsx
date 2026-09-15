import { useContext, useState, useRef, useEffect, } from 'react'
import { useLanguage } from '../../../context/languageContext'
import PageWrapper from '../../../WelcomeScreen/PageWrapper'
import bg from '../../../assets/background-collage.png'
import {gsap} from 'gsap' 
import thinking_image  from '../../../assets/black_man_thinking.webp'
import SoundSettingsWidget from '../../TutorialSettingsScreen'
import { ArrowRight, ArrowLeft, CornerDownLeft, CornerDownRight, House} from 'lucide-react'
import { useNavigate } from "react-router-dom";
import woodTapSound from '../../../assets/sound/woodTap.mp3'
import victorySound from '../../../assets/sound/victory.mp3'

//Lesson sound 
import droppingOne from '../../../assets/sound/achi/droppingOne.m4a'
import droppingTwo from '../../../assets/sound/achi/droppingTwo.m4a'
import droppingThree from '../../../assets/sound/achi/droppingThree.m4a'
import droppingFour from '../../../assets/sound/achi/droppingFour.m4a'
import engDroppingOne from '../../../assets/sound/achi/AchiLessonThreeStepOne.mp3'
import engDroppingTwo from '../../../assets/sound/achi/AchiLessonThreeStepTwo.mp3'
import engDroppingThree from '../../../assets/sound/achi/AchiLessonThreeStepThree.mp3'
import engDroppingFour from '../../../assets/sound/achi/AchiLessonThreeStepFour.mp3'



function AchiLesson3(){

//Contents
const {language} = useLanguage()
const woodTap = useRef(new Audio(woodTapSound))
const victory = useRef(new Audio(victorySound))
const voiceRef = useRef(new Audio());

const thinking = "..."

const playWoodTap = () => { 
    if (woodTap.current) { 
        woodTap.current.currentTime = 0; 
        woodTap.current.volume = 0.1;
        woodTap.current.play()
    }
}

const steps = [{
        step: '1',
        text: "At the beginning of the game, players take turns placing one of their pieces onto any empty point on the board.",
        voice: language === 'english' ? engDroppingOne : droppingOne

    },{
        step: '2',
        text: "Continue taking turns until all three pieces belonging to each player have been placed on the board.",
        voice: language === 'english' ? engDroppingTwo : droppingTwo

    },{
        step: '3',
        text: "If a player forms a straight line while placing their final piece, they immediately win the game without entering the movement phase.",
        voice: language === 'english' ? engDroppingThree : droppingThree

    },{
        step: '4',
        text: "If neither player creates a straight line after all six pieces have been placed, the game continues with players moving their pieces around the board.",
        voice: language === 'english' ? engDroppingFour : droppingFour

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

const nextLessonNavigation = () => {
    playWoodTap()
    if (nextLesson){
        navigate('/achilesson4')
    } else {
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
            navigate('/achilesson2')
    } else {
        previousStep()
    }
}


useEffect(() => {
    LessonState()
    PreviousLesson()
    resetWin()
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


//Board state

const getBoardState = () => {
    console.log('i have played')    
}


const getLineStyle = (start, end) => {
const x1 = parseFloat(POSITIONS[start].left);
const y1 = parseFloat(POSITIONS[start].top);

const x2 = parseFloat(POSITIONS[end].left);
const y2 = parseFloat(POSITIONS[end].top);

const length = Math.sqrt(
    Math.pow(x2 - x1, 2) +
    Math.pow(y2 - y1, 2)
);

const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

return {
    width: `${length}%`,
    left: `${x1}%`,
    top: `${y1}%`,
    transform: `rotate(${angle}deg)`,
    transformOrigin: "0 50%",
};
};

const POSITIONS = [
{ top: "0%", left: "0%" },      // 0
{ top: "0%", left: "50%" },     // 1
{ top: "0%", left: "100%" },    // 2

{ top: "50%", left: "0%" },     // 3
{ top: "50%", left: "50%" },    // 4
{ top: "50%", left: "100%" },   // 5

{ top: "100%", left: "0%" },    // 6
{ top: "100%", left: "50%" },   // 7
{ top: "100%", left: "100%" },  // 8
];

const LINES = [
[0,1],[1,2],
[3,4],[4,5],
[6,7],[7,8],

[0,3],[0,6],
[1,4],[4,7],
[2,5],[5,8],

[0,4],[4,8],
[2,4],[4,6],

];
const createBoard = () => Array(9).fill(0)
const [board, setBoard] = useState(createBoard)


//Animation

const nodeRefs = useRef([])
const animateWin = useRef([])
const pieceRefs = useRef([])


useEffect (()=> {
    for (let i = 0; i< 9; i++){
        resetNode(i)
    }
    if(steps[currentStep].step === '1'){ 
    for (let i = 0; i < 9; i++ ){
        animateNode(i)} 
    }

}, [currentStep])


    const animateNode = (index) => { 
    gsap.killTweensOf(nodeRefs.current[index]);
    gsap.to(nodeRefs.current[index], { 
        boxShadow: 
        `0 0 15px #fb6900,
        0 0 18px #fb6900,
        0 0 19px #fb6900,
        0 0 21px #734b00,
        0 0 30px #734b00
        
        `, 
        yoyo: true,
        repeat: -1,
        duration: 0.9,
 
        ease: 'power1.inOut'
    })
    woodTap.current.currentTime = 0;
    woodTap.current.play();
   }

   const resetNode = (index) => {
    gsap.killTweensOf(nodeRefs.current[index]);

    gsap.set(nodeRefs.current[index], {
        scale: 1, 
        boxShadow:'none', 
        backgroundColor: ""
    })
   }





const step4sequence = [

    {
        type: "place",
        player: 1,
        position: 0
    },

    {
        type: "place",
        player: 2,
        position: 4
    },

    {
        type: "place",
        player: 1,
        position: 2
    },

    {
        type: "place",
        player: 2,
        position: 6
    },

    {
        type: "place",
        player: 1,
        position: 8
    },

    {
        type: "place",
        player: 2,
        position: 1
    },


    // ==================
    // MOVEMENT PHASE
    // ==================

    {
        type:"move",
        player:2,
        from:4,
        to:5
    },


    {
        type:"move",
        player:1,
        from:8,
        to:7
    },


    {
        type:"move",
        player:1,
        from:7,
        to:4
    },


];

const step2sequence = [{
        type: "place",
        player: 1,
        position: 0
    },

    {
        type: "place",
        player: 2,
        position: 4
    },

    {
        type: "place",
        player: 1,
        position: 2
    },

    {
        type: "place",
        player: 2,
        position: 6
    },

    {
        type: "place",
        player: 1,
        position: 8
    },

    {
        type: "place",
        player: 2,
        position: 1
    },]

const step3sequence = [{
        type: "place",
        player: 1,
        position: 0
    },

    {
        type: "place",
        player: 2,
        position: 4
    },

    {
        type: "place",
        player: 1,
        position: 2
    },

    {
        type: "place",
        player: 2,
        position: 6
    },

    {
        type: "place",
        player: 1,
        position: 1
    },

    // win

    {
        type: "win",
        lines: [0, 1] // top horizontal, diagonal, etc.
    }
]


// engine
const runAction = (tl, action, boardState)=>{

switch(action.type){

case "place":
    tl.call(() => {
        boardState[action.position] = action.player;
        setBoard([...boardState]);
    });
    tl.call (()=> {
        if (woodTap.current){ 
            woodTap.current.currentTime = 0; 
            woodTap.current.play();
        }   
    })

    tl.to({}, { duration: 0.05 }); // give React a tick to render the new node

    tl.call(() => {
        const target = pieceRefs.current[action.position];
        if (!target) return; // safety guard
        gsap.fromTo(target,
            { scale:0, y:-40, opacity:0 },
            { scale:1, y:0, opacity:1, duration:0.4, ease:"back.out(2)" }
        );
    });
    break;

                                                                                    



case "move":

    tl.call(()=>{


        boardState[action.from]=0;

        boardState[action.to]=
        action.player;


        setBoard([...boardState]);


    });



break;

case "win":

    tl.call(() => {
        winAnimation(action.lines);
    });
    tl.to({}, { duration: 0.3 });
    
    tl.call(() => {
        if(victory.current){
            victory.current.currentTime = 0; 
            victory.current.play()
        }
    })
    

}


};


const winAnimation=(lines)=>{


lines.forEach(index=>{


gsap.to(
animateWin.current[index],

{

backgroundColor:"#7CFF7C",

boxShadow:
`
0 0 20px #00FF66,
0 0 40px #00FF66
`,

repeat:-1,

yoyo:true,

duration:0.5

}

);


});


};


const stepSequences = {
    '2': step2sequence,
    '3': step3sequence,
    '4': step4sequence  
}

useEffect(()=>{
const currentSequence = stepSequences[steps[currentStep].step]

if (!currentSequence) return;

    let boardState=createBoard();

        const tl = gsap.timeline({

        repeat:-1,

        repeatDelay:2,


        onRepeat:()=>{

        const fresh = createBoard();
        boardState.splice(0, boardState.length, ...fresh); // mutate in place
        setBoard([...boardState]);
         resetWin();


        }

        });


        currentSequence.forEach(action=>{


        runAction(
            tl,
            action,
            boardState
        );


        tl.to({},{
        duration:1
        });


        });


        return ()=>{

        tl.kill();

        setBoard(createBoard());

        };


},[currentStep]);

const resetWin = () => {

    animateWin.current.forEach(line => {

        if (!line) return;

        gsap.killTweensOf(line);

        gsap.set(line, {
            backgroundColor: "",
            boxShadow: "none",
            opacity: 1,
            scaleX: 1
        });

    });

};


return(
<PageWrapper>
    <div className='absolute inset-0 bg-linear-to-r from-[#d4a017]/80 via-[#8b5a2b]/70 to-[#3b1f0f]/80 -z-1 min-h-screen flex flex-col items-center justify-center'>
        <img src={bg} alt="background image" className="absolute object-cover w-full h-full -z-1 opacity-[0.3]"/>   
    </div> 

    <div className='flex flex-col h-screen w-full'>

    <div className="absolute top-0 right-0 flex items-center gap-4 z-50 bg-dark/50 p-3 rounded-bl-lg">
        <SoundSettingsWidget/>
        <ArrowLeft className=' left-3 size-8 cursor-pointer text-midGold' onClick={goBack} />
        <ArrowRight className=' size-8 text-gold-300 cursor-pointer text-midGold' onClick={goForward} />
        <House className=' size-7 text-gold-300 cursor-pointer text-midGold' onClick={() => {navigate('/selectionScreen')}}/>
        <Settings size={22} className='size-7 text-gold-300 cursor-pointer text-midGold' onClick={() => {setIsOpen(!isOpen)}}/>

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

        <button onClick={PreviousLessonNavigation} className='absolute bottom-5 left-5 border-none p-3 text-xl rounded-lg cursor-pointer bg-gradient-to-br from-[#A47551] to-[#6B4226] text-[#F7E7CE] uppercase font-bold hover:scale-95 transition-smooth duration-300 flex items-center justify-center gap-3'> 
            <CornerDownLeft /> 
            <p>{previousLessonVariable ? 'Previous Lesson' : 'Previous'}</p>
        </button>

    
       <div className='absolute left-1/2 -translate-x-1/2 border-2 border-t-0 border-midGold rounded-br-lg rounded-bl-lg px-6 py-2 text-center bg-dark/90 text-darkgold shadow-midGold shadow-sm '>

            <div>
                <p className='uppercase text-3xl font-bold font-fingerpaint'>Dropping Pieces</p>
            </div>

            <div className='flex items-center justify-between'>
                <p className=' text-midGold'>Lesson 3</p>
                <p className='text-midGold'>{`Step ${steps[currentStep].step}`}</p>
            </div>
            
        </div>

          <div className='absolute inset-0 flex items-center justify-center mt-35 -z-1 scale-80'>
            <div className='border-3 p-18 rounded-lg border-dark bg-dark/70'>

            <div className="relative w-[450px] h-[450px] bg-radial from-gold via-wood1 to-dark ">

                {/* Lines */}
                {LINES.map(([start, end], index) => (
                    <div
                        key={index}
                        ref={(el) => (animateWin.current[index] = el)}
                        className="absolute h-1 bg-darkgold"
                        style={getLineStyle(start, end)}
                    />
                ))}

                {/* Nodes */}
                {POSITIONS.map((position, index) => (
                    <div
                        key={index}
                        ref = {(el) => (nodeRefs.current[index] = el)}
                        className="absolute size-6 z-10 rounded-full bg-darkgold -translate-x-1/2 -translate-y-1/2"
                        style={position}
                    />
                ))}

                {/* Pieces */}
                {board.map((square, index) =>
                    square !== 0 && (
                        <div
                            key={index}
                            ref = {(el) => (pieceRefs.current[index] = el)}
                            className={`piece-${index} absolute z-20 size-14 rounded-full border-2 border-gold
                                -translate-x-1/2 -translate-y-1/2
                                ${
                                    square === 1
                                        ? "bg-black"
                                        : "bg-darkgold"
                                }`}
                            style={POSITIONS[index]}
                        />
                    )
                )}
             </div>

        </div>
</div>
    {isOpen&&(
            <SoundSettingsWidget isOpen={isOpen} setIsOpen={setIsOpen}/>
        )}  
    </div>
</PageWrapper>


)
}

export default AchiLesson3