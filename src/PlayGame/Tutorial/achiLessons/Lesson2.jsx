import { useContext, useState, useRef, useEffect, } from 'react'
import { useLanguage } from '../../../context/languageContext'
import PageWrapper from '../../../WelcomeScreen/PageWrapper'
import bg from '../../../assets/background-collage.png'
import thinking_image  from '../../../assets/black_man_thinking.webp'
import { ArrowRight, ArrowLeft, CornerDownLeft, CornerDownRight, House} from 'lucide-react'
import { useNavigate } from "react-router-dom";
import woodTapSound from '../../../assets/sound/woodTap.mp3'

//Lesson sound 
import rulesOne from '../../../assets/sound/achi/rulesOne.m4a'
import rulesTwo from '../../../assets/sound/achi/rulesTwo.m4a'
import rulesThree from '../../../assets/sound/achi/rulesThree.m4a'
import rulesFour from '../../../assets/sound/achi/rulesFour.m4a'

import engRulesOne from '../../../assets/sound/achi/AchiLessonTwoStepOne.mp3'
import engRulesTwo from '../../../assets/sound/achi/AchiLessonTwoStepTwo.mp3'
import engRulesThree from '../../../assets/sound/achi/AchiLessonTwoStepThree.mp3'
import engRulesFour from '../../../assets/sound/achi/AchiLessonTwoStepFour.mp3'




function AchiLesson2(){
const {language} = useLanguage()
const woodTap = useRef(new Audio(woodTapSound))
const voiceRef = useRef(new Audio());

const thinking = "..."

const steps = [{
        step: '1',
        text: "Handle all playing pieces carefully when placing or moving them. Damaged or misplaced pieces may affect the robot's ability to detect and play the game correctly.",
        voice: language === 'english' ? engRulesOne : rulesOne

    },{
        step: '2',
        text: "Keep your hands away from the board whenever the robot is making its move. Wait until the robot has completely stopped before touching any piece on the board.",
        voice: language === 'english' ? engRulesTwo : rulesTwo

    },{
        step: '3',
        text: "Move only the piece selected for your turn. Do not adjust, rotate, or reposition any other pieces unless instructed by the game.",
        voice: language === 'english' ? engRulesThree : rulesThree

    },{
        step: '4',
        text: "Respect the robot's turn and your opponent's turn at all times. Do not interrupt gameplay or interfere with the robot's movements, as doing so may affect the game's accuracy.",
        voice: language === 'english' ? engRulesFour : rulesFour

    } ]
const playWoodTap = () => { 
    if (woodTap.current) { 
        woodTap.current.currentTime = 0; 
        woodTap.current.volume = 0.1;
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
        navigate('/achilesson3')
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
        navigate('/achilesson1')
    } else {
        previousStep()
    }
}


useEffect(() => {
    LessonState()
    PreviousLesson()
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

        <button onClick={PreviousLessonNavigation} className='absolute bottom-5 left-5 border-none p-3 text-xl rounded-lg cursor-pointer bg-gradient-to-br from-[#A47551] to-[#6B4226] text-[#F7E7CE] uppercase font-bold hover:scale-95 transition-smooth duration-300 flex items-center justify-center gap-3'> 
            <CornerDownLeft /> 
            <p>{previousLessonVariable ? 'Previous Lesson' : 'Previous'}</p>
        </button>

    
       <div className='absolute left-1/2 -translate-x-1/2 border-2 border-t-0 border-midGold rounded-br-lg rounded-bl-lg px-6 py-2 text-center bg-dark/90 text-darkgold shadow-midGold shadow-sm '>

            <div>
                <p className='uppercase text-3xl font-bold font-fingerpaint'>General Rules</p>
            </div>

            <div className='flex items-center justify-between'>
                <p className=' text-midGold'>Lesson 2</p>
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
                        className="absolute h-1 bg-darkgold"
                        style={getLineStyle(start, end)}
                    />
                ))}

                {/* Nodes */}
                {POSITIONS.map((position, index) => (
                    <div
                        key={index}
                        className="absolute size-4 z-10 rounded-full bg-darkgold -translate-x-1/2 -translate-y-1/2"
                        style={position}
                    />
                ))}

                {/* Pieces */}
                {board.map((square, index) =>
                    square !== 0 && (
                        <div
                            key={index}
                            className={`absolute z-20 size-14 rounded-full border-2 border-gold
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
        
        

        
    
    </div>
</PageWrapper>


)
}

export default AchiLesson2 