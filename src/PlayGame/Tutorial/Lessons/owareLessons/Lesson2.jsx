import { useContext, useState, useRef, useEffect, } from 'react'
import PageWrapper from '../../../../WelcomeScreen/PageWrapper'
import bg from '../../../../assets/background-collage.png'
import { useLanguage } from '../../../../context/languageContext'
import thinking_image  from '../../../../assets/black_man_thinking.webp'
import { ArrowRight, ArrowLeft, CornerDownLeft, CornerDownRight, House} from 'lucide-react'
import { useNavigate } from "react-router-dom";
import woodTapSound from '../../../../assets/sound/woodTap.mp3'

//Lesson sounds 
import soundOne from '../../../../assets/sound/oware/rulesOne.m4a'
import soundTwo from '../../../../assets/sound/oware/rulesTwo.m4a'
import soundThree from '../../../../assets/sound/oware/rulesThree.m4a'
import soundFour from '../../../../assets/sound/oware/rulesFour.m4a'
import engSoundOne from '../../../../assets/sound/oware/OwareLessonTwoStepOne.mp3'
import engSoundTwo from '../../../../assets/sound/oware/OwareLessonTwoStepTwo.mp3'
import engSoundThree from '../../../../assets/sound/oware/OwareLessonTwoStepThree.mp3'
import engSoundFour from '../../../../assets/sound/oware/OwareLessonTwoStepFour.mp3'


export default function OwareLesson2(){
const woodTap = useRef(new Audio(woodTapSound))
const voiceRef = useRef(new Audio());
const {language} = useLanguage()
const thinking = "..."

const steps = [{
        step: '1',
        text: "Handle all the beads with care throughout the game. Rough handling may cause the pieces to scatter or become misplaced, making it difficult for the game to continue smoothly.",
        voice: language === 'english' ? engSoundOne: soundOne

    },{
        step: '2',
        text: "For your safety, never place your hand or any object in the robot's path while it is moving across the board. Wait until the robot has completely finished its move before interacting with the game.",
        voice: language === 'english' ? engSoundTwo : soundTwo

    },{
        step: '3',
        text: "Whenever you capture beads, place them neatly into your designated container pod. Keeping captured beads separate makes it easier to determine the winner at the end of the game.",
        voice: language === 'english' ? engSoundThree :soundThree

    },{
        step: '4',
        text: "Always wait for the robot or your opponent to complete their turn before touching the board. Never move pieces early or interfere with another player's turn, as this would be cheating and could affect the outcome of the game.",
        voice: language === 'english' ? engSoundFour : soundFour

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
        playWoodTap
        if (nextLesson){
            navigate('/owarelesson3')
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
            navigate('/owarelesson1')
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

 const Pit = ({beadCount}) => {
        return(
            <>
                 <div className="w-27 h-27 rounded-full bg-[#5c3317] shadow-inner flex flex-wrap items-center justify-center gap-1 p-4">
                    <div className='grid grid-cols gap-1 justify-items-center items-center'></div>                        
                    {Array.from( {length: beadCount }).map((_, index) =>(
                        <div key={index}
                        className='rounded-full bg-gradient-to-br from-grey-600 to-green-300 size-4'></div>

                    ))}
                </div>
            </>

        )
    }

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

        <div className="flex-1 flex items-center justify-center">

                <div className="flex flex-col items-center">

                    <div className="w-67 h-22 bg-[#6b3f1d] border-4 border-b-0 border-[#4a2a12] rounded-t-[3rem] shadow-2xl flex items-center justify-center gap-3 p-4">
                        <div className="w-65 h-17 bg-[#5c3317] rounded-t-[3rem] shadow-2xl flex items-center justify-center gap-3 p-4">
                        </div>
                    </div>

                    <div className="bg-[#8b5a2b] p-6 border-x-4 border-[#5a3418] shadow-2xl rounded-4xl">

                    <div className="flex gap-4 mb-5">

                        <Pit/>
                        <Pit/>
                        <Pit/>
                        <Pit/>
                        <Pit/>
                        <Pit/> 

                    </div>

                    <div className="flex gap-4">
                        <Pit/>
                        <Pit />
                        <Pit/>
                        <Pit />
                        <Pit />
                        <Pit/>

                    </div>

                    </div>

                    <div className="w-67 h-22 bg-[#6b3f1d] border-4 border-t-0 border-[#4a2a12] rounded-b-[3rem] shadow-2xl flex items-center justify-center gap-3 p-4">
                        <div className="w-65 h-17 bg-[#5c3317] rounded-b-[3rem] flex items-center justify-center gap-3 p-4">
                    </div>
                    </div>

            </div>

            </div>
        
        

        
    
    </div>
</PageWrapper>


)
}

