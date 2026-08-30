import PageWrapper from "./PageWrapper";
import GameScreen from "../PlayGame/startGame";


import { useState, useRef, useContext} from 'react'
import { ChevronRight, ChevronLeft, ArrowLeft, ArrowRight } from 'lucide-react'
import { GameContext } from "../context/GameContext";
import { AudioSettingsContext } from "../context/audioSettingsContext";
import { useSfxPlayer } from "../hooks/useVoicePlayer";

import swipeSound from '../assets/sound/uiSwipeSound.mp3'
import woodTapSound from '../assets/sound/woodTap.mp3'
import { useNavigate } from "react-router-dom";

import { motion } from 'framer-motion'

import { API } from "../PlayGame/API";


    function SelectionScreen() {

        const APIKEY = `${API}/api/game/select`
       
        const {games, currentGame, setCurrentGame} = useContext(GameContext)
        const { sfxVolume } = useContext(AudioSettingsContext)
        const [isLoading, setIsLoading] = useState(false)
        const playSwipe = useSfxPlayer(swipeSound, sfxVolume)
        const navigate = useNavigate()
    
        const nextGame = () => {
            setCurrentGame((previous) => (previous + 1) % games.length)
            playSwipe()   
    
        }

        const previousGame = () => {
            setCurrentGame( (previous) => 
                previous === 0 ? games.length - 1 : previous - 1)
                playSwipe()
        }               

        const SWIPE_THRESHOLD = 75
        const handleSwipe = (event, info) => {
            if (info.offset.x < -SWIPE_THRESHOLD){
                nextGame()
            }

            if (info.offset.x > SWIPE_THRESHOLD){
                previousGame()
            }
        }

        const playWoodTap = useSfxPlayer(woodTapSound, sfxVolume)

        
        async function sendPostRequest(){
            try {
                const response = await fetch(APIKEY, {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(
                        { game: games[currentGame].name}
                    )

            })

            if (!response.ok){
                throw new Error('Failed to select game')
            }

            return true

            } 
            
            catch (error) {
                console.log(error)
                return false
            }
        }

        const startGame = async () => {

                if(isLoading) return    
                setIsLoading(true)

                try {
                    const success = await sendPostRequest()

                    if(!success) {
                        setIsLoading(false)
                        return
                    }

                    
                if (games[currentGame].key == 0){
                    navigate('/owareScreen')

                } else if (games[currentGame].key == 1){
                    navigate('/dameScreen')
                    
                } else {
                    navigate('/achiScreen')
                }

                playWoodTap()

                setIsLoading(false)
                console.log('button clicked')

                } catch (error){
                    console.log(error)
                    setIsLoading(false)
                }   
        }

        const goBack = () => {
            navigate(-1)
            playWoodTap()
        }

        const goForward = () => {
            navigate(1)
            playWoodTap()
        }

        const startTutorial = () => {
            if (games[currentGame].key == 0){
                    navigate('/owareLessonScreen')

                } else if (games[currentGame].key == 1){
                    navigate('/dameLessonScreen')
                    
                } else {
                    navigate('/achiLessonScreen')
                }
        }



        return (
            <PageWrapper>
                <motion.div className="relative flex h-screen w-full items-center justify-center overflow-x-hidden"
                            onPanEnd={handleSwipe}
                >

                    {/* background image */}
                         <img src={games[currentGame].backgroundImage} alt="background image" className="absolute object-cover w-full h-full"/>   
                         
                            {/* back buttons */}
                    <div className="absolute top-0 left-0 flex items-center gap-4 z-50 backdrop-blur p-3 rounded-lg">
                         <ArrowLeft className=' left-3 size-8 cursor-pointer text-gold ' onClick={() => {navigate('/')}} />
                        <ArrowRight className=' size-8 text-gold-300 cursor-pointer text-gold ' onClick={goForward} />
                    </div>
                       

                    <div className="flex flex-col gap-15 justify-center items-center z-10 h-screen">

                        <div className="w-screen flex justify-between items-center z-10 ">
                                
                            {/* previous toggle */}
                            <ChevronLeft className='size-30 text-gold cursor-pointer ml-3 animate-previous' onClick={previousGame} strokeWidth={1}/>


                            {/* Game text*/}

                                <p className="uppercase font-kablammo font-bold text-darkgold text-9xl select-none">
                                {
                                    games[currentGame].name.split("").map((letter, index) => (
                                        <span
                                            key={index}
                                            className={`${isLoading? 'animate-spin inline-block': 'animate-float inline-block'}`}
                                            style={{animationDelay: `${index * 0.1}s`}}
                                        >
                                            {letter}
                                        </span>
                                    ))
                                
                                }</p>

                            {/* next toggle */}
                            <ChevronRight className="size-30 text-gold cursor-pointer mr-3 animate-next" onClick={nextGame} strokeWidth={1}/>    

                        </div>

                        {/* selection buttons */}
                        <div className="flex items-center justify-center gap-8 select-none">
                            <button className="border-none p-3 w-40 text-xl text-d rounded-lg cursor-pointer bg-gradient-to-br from-[#A47551] to-[#6B4226] text-[#F7E7CE] uppercase font-bold hover:scale-105 transition-smooth duration-300" 
                            onClick={startGame}
                            disabled={isLoading}
                            >{isLoading ? (<div className="text-2xl animate-pulse   ">...</div>) : 'Play'}</button>

                            <button className="border-none p-3 w-40 text-xl text-d rounded-lg cursor-pointer bg-gradient-to-br from-[#A47551] to-[#6B4226] text-[#F7E7CE] uppercase font-bold hover:scale-105 transition-smooth duration-300" onClick={startTutorial}>Tutorial</button>
                        </div>
                        
                    </div>   
                </motion.div>

            </PageWrapper>
        
        )       
    }

    export default SelectionScreen