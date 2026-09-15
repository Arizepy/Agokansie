import { useRef, useState, useContext } from 'react'
import { useLanguage } from '../context/languageContext'
import { AudioSettingsContext } from '../context/audioSettingsContext'
import { useSfxPlayer } from '../hooks/useVoicePlayer'
import bg from '../assets/background.png'
import {motion} from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageWrapper from './PageWrapper'
import woodTapSound from '../assets/sound/woodTap.mp3'
import { DivideSquare, X, Check } from 'lucide-react'


function WelcomeScreen({music}){
    const navigate = useNavigate()
    const [step, setStep] = useState('choosing')
    const {language, setLanguage} = useLanguage()
    const [languageSelector, setLanguageSelector] = useState(false)
    const { sfxVolume } = useContext(AudioSettingsContext)
    const playWoodTap = useSfxPlayer(woodTapSound, sfxVolume)


    const playSound = () => {
        playWoodTap()

    }
    
      const handleSelectLanguage = () => {
        setStep('choosing')
    }
  
    const handlePick = (lang) => {
        setLanguage(lang)
    }
    const navigateFxn = () => {
        navigate('/selectionScreen')
    }
    
    const handleClick = () => {
        music()
        navigateFxn()
        playSound()
    }   

    const handleLanguageSelection = () => { 
        setLanguageSelector(true)
    }
    
    const onClose = () =>{
        setLanguageSelector(false)
    }
    return(
        <PageWrapper>
            <div className='relative flex h-screen w-full items-center justify-center overflow-x-hidden'>
                <img 
                    src={bg}
                    alt='game background'
                    className='absolute w-full h-full object-cover'
                />

                <div className='relative flex flex-col justify-center items-center rounded-lg'>
                    <p className='capitalize font-elite text-gold font-bold text-7xl'>Discover Ghanaian<br/> game culture with  </p>
                    <p className='uppercase text-darkgold text-7xl font-bold font-kablammo'>Agokansiɛ</p >
                    <p className='text-xl mt-5 mb-10 text-orange-100 tracking-widest'>Learn. Play. Preserve</p>
                    <div className=' flex items-center justify-center'>
                        <button onClick={handleLanguageSelection} className='border-none p-3 w-60 text-xl text-d rounded-lg animate-bounce cursor-pointer bg-gradient-to-br from-[#A47551] to-[#6B4226] text-[#F7E7CE] uppercase font-bold hover:w-50 transition-smooth duration-300'>Play Now</button>
                    </div>
                </div>
       
       {
        languageSelector?
        <div className='fixed inset-0 bg-black/45 flex items-center justify-center z-50 px-4'>
            <div className='w-full max-w-md bg-[#7C5D42] rounded-2xl p-7 relative'>

                <button
                    onClick={onClose}
                    aria-label='Close'
                    className='absolute top-3.5 right-3.5 w-8 h-8 rounded-full border-[1.5px] border-gold text-gold flex items-center justify-center hover:bg-white/5 transition cursor-pointer'
                >
                    <X size={16} />
                </button>

                <div className='text-center pb-3.5 mb-7 border-b border-gold/35'>
                    <p className='font-kablamo text-3xl font-bold text-gold tracking-widest font-kablammo'>LANGUAGE</p>
                    <p className='text-xs font-medium text-darkgold tracking-[0.3em] mt-1'>SELECTOR</p>
                </div>

                <div className='min-h-[120px] flex flex-col items-center justify-center gap-5 py-2'>

                    {step === 'choosing' && (
                        <div className='flex gap-3'>
                            <button
                                onClick={() => handlePick('english')}
                                className={`px-6 py-3 rounded-full text-[15px] font-medium border-[1.5px] transition cursor-pointer ${
                                    language === 'english'
                                        ? 'bg-transparent border-darkgold/45 text-[#F5E6C8]'
                                        : 'bg-[#5B4430]  border-[#5B4430] text-[#F5E6C8]'
                                }`}
                            >
                                English
                            </button>
                            <button
                                onClick={() => handlePick('twi')}
                                className={`px-6 py-3 rounded-full text-[15px] font-medium border-[1.5px] transition cursor-pointer ${
                                    language === 'twi'
                                        ? 'bg-transparent border-darkgold/45 text-[#F5E6C8]'
                                        : 'bg-[#5B4430] border-[#5B4430]  text-[#F5E6C8]'
                                }`}
                            >
                                Twi
                            </button>
                        </div>
                    )}
                </div>

                {step === 'choosing' && (
                    <div className='flex justify-end pt-5 mt-2 border-t border-gold/35'>
                        <button
                            onClick={handleClick}
                            className='bg-[#5B4430] text-[#F5E6C8] px-7 py-3 rounded-full text-sm font-medium flex items-center gap-2 hover:opacity-90 transition cursor-pointer'
                        >
                            <Check size={16} /> Done
                        </button>
                    </div>
                )}
            </div>
        </div>
        : null
       }
            </div>  
        </PageWrapper>
    )
}

export default WelcomeScreen