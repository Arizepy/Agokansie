import { useContext, useState, useRef, useEffect, } from 'react'
import PageWrapper from '../../../WelcomeScreen/PageWrapper'
import bg from '../../../assets/background-collage.png'
import thinking_image  from '../../../assets/black_man_thinking.webp'
import { ArrowRight, ArrowLeft, CornerDownLeft, CornerDownRight, House} from 'lucide-react'
import { useNavigate } from "react-router-dom";
import { useLanguage } from '../../../context/languageContext'
import woodTapSound from '../../../assets/sound/woodTap.mp3'

//LessonSound
import rulesOne from '../../../assets/sound/dame/rulesOne.m4a'
import rulesTwo from '../../../assets/sound/dame/rulesTwo.m4a'
import rulesThree from '../../../assets/sound/dame/rulesThree.m4a'
import rulesFour from '../../../assets/sound/dame/rulesFour.m4a'
import engRulesOne from '../../../assets/sound/dame/DameLessonTwoStepOne.mp3'
import engRulesTwo from '../../../assets/sound/dame/DameLessonTwoStepTwo.mp3'
import engRulesThree from '../../../assets/sound/dame/DameLessonTwoStepThree.mp3'
import engRulesFour from '../../../assets/sound/dame/DameLessonTwoStepFour.mp3'

export default function DameLesson2(){
const {language} = useLanguage()
const woodTap = useRef(new Audio(woodTapSound))
const thinking = "..."
const voiceRef = useRef(new Audio());

const playWoodTap = () => { 
    if (woodTap.current) { 
        woodTap.current.currentTime = 0; 
        woodTap.current.volume = 0.1;
        woodTap.current.play()
    }
}

const steps = [{
        step: '1',
        text: "Handle every game piece with care when placing, moving, or capturing. Keeping the pieces properly positioned helps the robot accurately recognise the board state.",
        voice: language === 'english'? engRulesOne : rulesOne

    },{
        step: '2',
        text: "Never place your hands inside the robot's working area while it is moving a piece. Wait until the robot has completed its turn before interacting with the board.",
        voice: language === 'english' ? engRulesTwo : rulesTwo

    },{
        step: '3',
        text: "Remove captured pieces only after the robot has finished its capture sequence, unless instructed otherwise by the game interface. Place captured pieces neatly in the designated container.",
        voice: language === 'english' ? engRulesThree : rulesThree

    },{
        step: '4',
        text: "Play one move at a time and avoid touching other pieces during a turn. Allow the robot to complete every action before making your next move to ensure fair and accurate gameplay.",
        voice: language === 'english' ? engRulesFour : rulesFour

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

    const nextLessonNavigation = () => {
        playWoodTap()
        if (nextLesson){
            navigate('/damelesson3')
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
            navigate('/damelesson1')
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

    const createBoard = () => {
        const board = [];
    
        for (let row = 0; row < 8; row++) {
            const currentRow = [];
    
            for (let col = 0; col < 8; col++) {
                currentRow.push(0);
            }
    
            board.push(currentRow);
        }
    
        return board;
    };
    
    const [board, setBoard] = useState(createBoard);



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

         <div className="absolute inset-0 flex items-center justify-center mt-35 -z-1 scale-90">
                     <div className="grid grid-cols-8 border-4 border-gray-900 ">
                    {board.map((row, rowIndex) =>
                        row.map((square, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`${
                        (rowIndex + colIndex) % 2 === 0
                    ? "bg-gold"
                    : "bg-dark"
                    } h-16 w-16 border flex items-center justify-center`}
        >
            {square !== 0 && (
                <div
                    className={`size-9 rounded-full ${
                        square === 1
                            ? "bg-black"
                            : "bg-red-600"
                    }`}
                />
            )}
        </div>
    ))
)}
                </div>            
            </div>
        
        

        
    
    </div>
</PageWrapper>


)
}
