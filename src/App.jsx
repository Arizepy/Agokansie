import {useContext, useEffect, useRef,useState} from 'react'
import { LanguageProvider } from './context/languageContext.jsx'
import { AudioSettingsProvider } from './context/audioSettingsContext.jsx'
import { AudioSettingsContext } from './context/audioSettingsContext.jsx'
import { useVoicePlayer, useSfxPlayer } from './hooks/useVoicePlayer.jsx'
import WelcomeScreen from './WelcomeScreen/Welcome.jsx'
import SelectionScreen from './WelcomeScreen/SelectionScreen.jsx'
import OwareGame from './PlayGame/startGame.jsx'
import DameGame from './PlayGame/DameScreen.jsx'
import AchiGame from './PlayGame/AchiGameScreen.jsx'
import BackgroundMusic from './assets/sound/bg.m4a'
import BackgroundMusicTwo from './assets/sound/bg2.mp3'
import BackgroundMusicThree from './assets/sound/bg3.mp3'
import BackgroundMusicFour from './assets/sound/bg4.mp3'
import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import OwareLesson from './PlayGame/Tutorial/OwareLessonScreen.jsx'
import DameLessonScreen from './PlayGame/Tutorial/DameLessonScreen.jsx'
import AchiLessonScreen from './PlayGame/Tutorial/AchiLessonScreen.jsx'


import OwareLesson1 from './PlayGame/Tutorial/Lessons/owareLessons/Lesson1.jsx'
import OwareLesson2 from './PlayGame/Tutorial/Lessons/owareLessons/Lesson2.jsx'
import OwareLesson3 from './PlayGame/Tutorial/Lessons/owareLessons/Lesson3.jsx'
import OwareLesson4 from './PlayGame/Tutorial/Lessons/owareLessons/Lesson4.jsx'
import OwareLesson5 from './PlayGame/Tutorial/Lessons/owareLessons/Lesson5.jsx'
import OwareLesson6 from './PlayGame/Tutorial/Lessons/owareLessons/Lesson6.jsx'
import OwareLesson7 from './PlayGame/Tutorial/Lessons/owareLessons/Lesson7.jsx'


import DameLesson1 from './PlayGame/Tutorial/dameLessons/Lesson1.jsx'
import DameLesson2 from './PlayGame/Tutorial/dameLessons/Lesson2.jsx'
import DameLesson3 from './PlayGame/Tutorial/dameLessons/Lesson3.jsx'
import DameLesson4 from './PlayGame/Tutorial/dameLessons/Lesson4.jsx'
import DameLesson5 from './PlayGame/Tutorial/dameLessons/Lesson5.jsx'
import DameLesson6 from './PlayGame/Tutorial/dameLessons/Lesson6.jsx'
import DameLesson7 from './PlayGame/Tutorial/dameLessons/Lesson7.jsx'

import AchiLesson1 from './PlayGame/Tutorial/achiLessons/Lesson1.jsx'
import AchiLesson2 from './PlayGame/Tutorial/achiLessons/Lesson2.jsx'
import AchiLesson3 from './PlayGame/Tutorial/achiLessons/Lesson3.jsx'
import AchiLesson4 from './PlayGame/Tutorial/achiLessons/Lesson4.jsx'
import AchiLesson5 from './PlayGame/Tutorial/achiLessons/Lesson5.jsx'
import AchiLesson6 from './PlayGame/Tutorial/achiLessons/Lesson6.jsx'


const backgroundSongs =[BackgroundMusic, BackgroundMusicTwo, BackgroundMusicThree,BackgroundMusicFour]
function getRandomSong(excludeSong){
    if (backgroundSongs.length === 1) return backgroundSongs[0]
    let next = backgroundSongs[Math.floor(Math.random() * backgroundSongs.length)]

    while (next === excludeSong){
        next = backgroundSongs[Math.floor(Math.random() * backgroundSongs.length)]
    }
    return next
}

function AnimatedRoutes(){
    const {musicVolume, setMusicVolume} = useContext(AudioSettingsContext)
    const playMusic = useVoicePlayer(musicVolume)
    const location = useLocation()
    const audioRef = useRef(null)
    const [currentSong, setCurrentSong] = useState(() => getRandomSong(null))
    const [musicStarted, setMusicStarted] = useState(false)



    const startMusic = () => {
      setMusicStarted(true)
    } 

   useEffect(() => {
    if (!musicStarted) return
    audioRef.current.play().catch(err => console.error('Audio play failed:', err))
}, [musicStarted, currentSong])

useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = musicVolume
        console.log(musicVolume)
    }
}, [musicVolume, currentSong])

    const handleSongEnd = () =>{
        setCurrentSong(prev => getRandomSong(prev))
    }

    return(
        <>
        <audio ref={audioRef} src={currentSong} onEnded={handleSongEnd}/>  
        <AnimatePresence mode='wait'>
            <Routes location={location} key={location.pathname}>
                <Route path='/' element={<WelcomeScreen music={startMusic}/>}/>
                <Route path='/selectionScreen' element={<SelectionScreen/>}/>

                <Route path='/owareScreen' element={<OwareGame/>}/>
                <Route path='/dameScreen' element={<DameGame/>}/>
                <Route path='/achiScreen' element={<AchiGame/>}/>

                <Route path='/owareLessonScreen' element={<OwareLesson/>}/>
                <Route path='/dameLessonScreen' element={<DameLessonScreen/>}/>
                <Route path='/achiLessonScreen' element={<AchiLessonScreen/>}/>

                <Route path='/owarelesson1' element={<OwareLesson1/>}/>
                <Route path='/owarelesson2' element={<OwareLesson2/>}/>
                <Route path='/owarelesson3' element={<OwareLesson3/>}/>
                <Route path='/owarelesson4' element={<OwareLesson4/>}/>
                <Route path='/owarelesson5' element={<OwareLesson5/>}/>
                <Route path='/owarelesson6' element={<OwareLesson6/>}/>
                <Route path='/owarelesson7' element={<OwareLesson7/>}/>

                <Route path='/damelesson1' element={<DameLesson1/>}/>
                <Route path='/damelesson2' element={<DameLesson2/>}/>
                <Route path='/damelesson3' element={<DameLesson3/>}/>
                <Route path='/damelesson4' element={<DameLesson4/>}/>
                <Route path='/damelesson5' element={<DameLesson5/>}/>
                <Route path='/damelesson6' element={<DameLesson6/>}/>
                <Route path='/damelesson7' element={<DameLesson7/>}/>

                <Route path='/achilesson1' element={<AchiLesson1/>}/>
                <Route path='/achilesson2' element={<AchiLesson2/>}/>
                <Route path='/achilesson3' element={<AchiLesson3/>}/>
                <Route path='/achilesson4' element={<AchiLesson4/>}/>
                <Route path='/achilesson5' element={<AchiLesson5/>}/>
                <Route path='/achilesson6' element={<AchiLesson6/>}/>

                                
            </Routes>
        </AnimatePresence>
        </>
        

    )
    
}

function App(){
   
    return (
        <AudioSettingsProvider>
            <LanguageProvider>
                <BrowserRouter>
                <AnimatedRoutes/>
                </BrowserRouter>    
            </LanguageProvider>
        </AudioSettingsProvider>
    )
}

export default App