import { useContext, useState, useRef, useEffect, } from 'react'
import PageWrapper from '../WelcomeScreen/PageWrapper'
import { GameContext } from '../context/GameContext'
import thinking_image  from '../assets/black_man_thinking.webp'
import { useLanguage } from '../context/languageContext'
import bg from '../assets/background-collage.png'
import woodTapSound from '../assets/sound/woodTap.mp3'
import { useNavigate } from "react-router-dom"; 
import { Settings,Volume2, Gamepad2, Monitor, RotateCcw, Check, Music, AudioLines, CornerDownLeft, CircleX, ArrowRight, ArrowLeft, House, ChartNoAxesCombined, Trophy } from 'lucide-react'

import player from '../assets/player.jpg'
import robot from '../assets/robot.jpg'

{/**Bad move */}
import bestOption from '../assets/sound/bad_move/bestOption.m4a'
import costYou from '../assets/sound/bad_move/costYou.m4a'
import leaveOpening from '../assets/sound/bad_move/leaveOpening.m4a'
import myFavor from '../assets/sound/bad_move/myFavor.m4a'
import whereItLeads from '../assets/sound/bad_move/whereItLeads.m4a'
import engBestOption from '../assets/sound/bad_move/bestOption.mp3'
import engCostYou from '../assets/sound/bad_move/costYou.mp3'
import engLeaveOpening from '../assets/sound/bad_move/leavesOpening.mp3'
import engMyFavour from '../assets/sound/bad_move/myFavour.mp3'
import engWhereItLeads from '../assets/sound/bad_move/whereItLeads.mp3'

{/**EndGame */}
import finalStage from '../assets/sound/endGame/finalStage.m4a'
import engFinalStage from '../assets/sound/endGame/enteringFinalStage.mp3'


{/**Great move */}
import cleverMove from '../assets/sound/great_move/cleverMove.m4a'
import excellentChoice from '../assets/sound/great_move/excellentChoice.m4a'
import nicelyPlayed from '../assets/sound/great_move/nicelyPlayed.m4a'
import severalMoves from '../assets/sound/great_move/severalMoves.m4a'
import underPressure from '../assets/sound/great_move/underPressure.m4a'
import engCleverMove from '../assets/sound/great_move/cleverMove.mp3'
import engExcellentChoice from '../assets/sound/great_move/excellentChoice.mp3'
import engNicelyPlayed from '../assets/sound/great_move/nicelyPlayed.mp3'
import engSeveralMoves from '../assets/sound/great_move/severalMoves.mp3'
import engUnderPressure from '../assets/sound/great_move/underPressure.mp3'


{/**Invalid move */}
import anotherMove from '../assets/sound/invalid_move/anotherMove.m4a'
import breaksRules from '../assets/sound/invalid_move/breaksRules.m4a'
import engAnotherMove from '../assets/sound/invalid_move/anotherMove.mp3'
import engBreaksRules from '../assets/sound/invalid_move/breaksRules.mp3'

{/**Player captures seeds */}
import didNotExpect from '../assets/sound/player_captures_seeds/didNotExpect.m4a'
import foundOpening from '../assets/sound/player_captures_seeds/foundOpening.m4a'
import goodCapture from '../assets/sound/player_captures_seeds/goodCapture.m4a'
import nicelyExecuted from '../assets/sound/player_captures_seeds/nicelyExecuted.m4a'
import engFoundOpening from '../assets/sound/player_captures_seeds/foundAnOpening.mp3'
import engGoodCapture from '../assets/sound/player_captures_seeds/goodCapture.mp3'
import engNicelyExecuted from '../assets/sound/player_captures_seeds/nicelyExecuted.mp3'
import engWellDone from '../assets/sound/player_captures_seeds/wellDone.mp3'


{/**Player wins */}
import excellentGame from '../assets/sound/player_wins/excellentGame.m4a'
import tillNextgame from '../assets/sound/player_wins/tillNextGame.m4a'
import wellDeserved from '../assets/sound/player_wins/wellDeserved.m4a'
import wellDone from '../assets/sound/player_wins/wellDone.m4a'
import engExcellentGame from '../assets/sound/player_wins/excellentGame.mp3'
import engPlayAgain from '../assets/sound/player_wins/playAgain.mp3'
import engTillNextTime from '../assets/sound/player_wins/tillNextGame.mp3'
import engWellDeserved from '../assets/sound/player_wins/wellDeserved.mp3'


{/**robot_captured_seed */}
import opportunity from '../assets/sound/robot_captures_seeds/opportunity.m4a'
import seedCounts from '../assets/sound/robot_captures_seeds/seedCounts.m4a'
import takingSeeds from '../assets/sound/robot_captures_seeds/takingSeeds.m4a'
import usefulHarvest from '../assets/sound/robot_captures_seeds/usefulHarvest.m4a'
import workedWell from '../assets/sound/robot_captures_seeds/workedWell.m4a'
import engEverySeedCounts from '../assets/sound/robot_captures_seeds/everySeedCounts.mp3'
import engTakingSeeds from '../assets/sound/robot_captures_seeds/takeThoseSeeds.mp3'
import engUsefulHarvest from '../assets/sound/robot_captures_seeds/usefulHarvest.mp3'
import engOpportunity from '../assets/sound/robot_captures_seeds/thanksForOpportunity.mp3'
import engWorkedWell from '../assets/sound/robot_captures_seeds/workedWell.mp3'
import engDidNotExpect from '../assets/sound/player_captures_seeds/didNotExpect.mp3'


{/**Robot wins */}
import enjoyable from '../assets/sound/robot_wins/enjoyable.m4a'
import playedWell from '../assets/sound/robot_wins/playedWell.m4a'
import victoryMine from '../assets/sound/robot_wins/victoryMine.m4a'
import engEnjoyable from '../assets/sound/robot_wins/wasEnjoyable.mp3'
import engPlayedWell from '../assets/sound/robot_wins/playedWell.mp3'
import engVictoryMine from '../assets/sound/robot_wins/victoryMine.mp3'


{/**Welcome */}
import boardReady from '../assets/sound/welcome/boardReady.m4a'
import enjoyableGame from '../assets/sound/welcome/enjoyGame.m4a'
import goodLuck from '../assets/sound/welcome/goodLuck.m4a'
import shallWeBegin from '../assets/sound/achi/introOne.m4a'
import strategistWin from '../assets/sound/welcome/strategistWin.m4a'
import engBoardReady from '../assets/sound/welcome/boardReady.mp3'
import engEnjoyableGame from '../assets/sound/welcome/engAchiEnjoyableGame.mp3'
import engGoodLuck from '../assets/sound/welcome/goodLuck.mp3'
import engShallWeBegin from '../assets/sound/welcome/shallWeBegin.mp3'
import engStrategistWins from '../assets/sound/welcome/strategistWin.mp3'


import { API } from './API'
import { AudioSettingsContext } from '../context/audioSettingsContext'
import { useVoicePlayer, useSfxPlayer } from '../hooks/useVoicePlayer'


function AchiGame(){
    const [gameDifficulty, setGameDifficulty] = useState(0)
    const {language} = useLanguage()
    const { musicVolume, setMusicVolume, sfxVolume, setSfxVolume } = useContext(AudioSettingsContext)
    const playVoice = useVoicePlayer(musicVolume)
    const useRobotCaputureSeedResponses = () => {
        const RobotCaptureSeedResponses = [
            {
                text: "I'll take those seeds",
                voice: language === 'english' ? engTakingSeeds : takingSeeds
            },
            {
                text: "A useful harvest",
                voice: language === 'english' ? engUsefulHarvest : usefulHarvest
            },
            {
                text: "That worked out well for me",
                voice: language === 'english' ? engWorkedWell : workedWell
            },
            {
                text: "Every seed counts",
                voice: language === 'english' ? engEverySeedCounts : seedCounts
            },
            {
                text: "Thank you for the opportunity",
                voice: language === 'english' ? engOpportunity : opportunity
            },
        ]

        const responseIndex = Math.floor(Math.random() * RobotCaptureSeedResponses.length)
            const selectedResponse = RobotCaptureSeedResponses[responseIndex]
            setResponse(selectedResponse.text)

            playVoice(selectedResponse.voice)
    }

    const usePlayerCaputureSeedResponses = () => {
        const RobotCaptureSeedResponses = [
            {
                text: "Well done",
                voice: language === 'english' ? engWellDone : wellDone
            },
            {
                text: "You found the opening",
                voice: language === 'english' ? engFoundOpening: foundOpening
            },
            {
                text: "That was a good capture",
                voice: language==='english' ? engGoodCapture : goodCapture
            },
            {
                text: "I didn't expect that",
                voice: language === 'english' ? engDidNotExpect : didNotExpect
            },
            {
                text: "Nicely executed",
                voice: language === 'english' ? engNicelyExecuted : nicelyExecuted
            },
        ]

        const responseIndex = Math.floor(Math.random() * RobotCaptureSeedResponses.length)
            const selectedResponse = RobotCaptureSeedResponses[responseIndex]
            setResponse(selectedResponse.text)

            playVoice(selectedResponse.voice)
    }

    const useRobotWinsResponses = () => {
        const RobotWinsResponses = [
            {
                text: "Good game. That was enjoyable",
                voice: language === 'english'? engEnjoyable :enjoyableGame
            },
            {
                text: "Victory is mine this time",
                voice: language === 'english' ? engVictoryMine: victoryMine
            },
        
        ]

        const responseIndex = Math.floor(Math.random() * RobotWinsResponses.length)
            const selectedResponse = RobotWinsResponses[responseIndex]
            setResponse(selectedResponse.text)

            playVoice(selectedResponse.voice)
    }

    const usePlayerWinsResponses = () => {
        const playerWinsResponses = [
            {
                text: "Well deserved. You win",
                voice: language === 'english' ? engWellDeserved: wellDeserved
            },
            {
                text: "Excellent game. I enjoyed that",
                voice: language === 'english' ? engExcellentGame: excellentGame
            },
            {
                text: "Until our next game",
                voice: language=== 'english' ? engTillNextTime: tillNextgame
            },
            {
                text: "Congratulations. You played very well",
                voice: language === 'english' ? engPlayedWell : playedWell
            },
            
        ]

        const responseIndex = Math.floor(Math.random() * playerWinsResponses.length)
            const selectedResponse = playerWinsResponses[responseIndex]
            setResponse(selectedResponse.text)

            playVoice(selectedResponse.voice)
    }


    const useEndGameResponses = () => {
        const useEndGameResponses = [
           {
            text:"We're entering the final stage",
            voice: language === 'english' ?engFinalStage:finalStage
           }
        ]
            setResponse(useEndGameResponses[0].text)
            playVoice(useEndGameResponses[0].voice)
    }



    const {games, currentGame} = useContext(GameContext)


    const navigate = useNavigate()

    const thinking = "..."

    const [beadCount, setBeadCount] = useState(4)

    const [leftOverBeads, setLeftOverBeads] = useState(0)

    const [status, setStatus] = useState('')

    const [response, setResponse] = useState('')

    const [getReward, setGetReward] = useState(true)


   const playWoodTap = useSfxPlayer(woodTapSound, sfxVolume)

    const postRequest = async () => {
            try {
                const response = await fetch(`${API}/api/game/scan` ,
                    {
                        method: 'POST',
                        headers: {
                        'Content-Type': "application/json",
                    },
                    body: JSON.stringify(
                            { game: games[currentGame].name}
                        )
                    }
                )
                      
                const BoardData = await response.json()

                setBoardState(BoardData)
                setBoard(BoardData.state.board)
                console.log(BoardData)

            }

            catch (error) {
                console.log(error.message)
            }

               
        }

        const [boardState, setBoardState] = useState()

         const playRequest = async () => {
            

            try {
                const response = await fetch(`${API}/api/game/play`,
                    {
                        method: 'POST',
                        headers: {
                        'Content-Type': "application/json",
                    },
                    body: JSON.stringify(
                            { game: games[currentGame].name}
                        )
                    }
                )
                
                const BoardData = await response.json()
                setBoardState(BoardData)
                setBoard(BoardData.state.board)
                console.log(BoardData)
                

            }

            catch (error) { 
                console.log(error.message)
            }
     
        }

        const getStatus = async () => {
            try {
                const response = await fetch(`${API}/api/game/state`)
                const data = await response.json()
                setStatus(data.status)

                console.log(data.status)
            } catch (error) {
                console.log(error)
            }

        }

        const claimReward = async () => {
            if (victor !== 'robot' ) return
            
            try {
                const response = await fetch(`${API}/api/game/dispense`,
                    {
                        method: 'POST',
                        headers: {
                        'Content-Type': "application/json",
                    },
                    }
                )
                
            }

            catch (error) { 
                console.log(error.message)
            }
        

        }


        useEffect(() => {
            getStatus()

            const interval = setInterval(getStatus, 3000)

            return () => clearInterval(interval)
        },[])

    useEffect(() => {
        // getRequest()
        postRequest()
        
    }, []) 

    const getBoardState = () => {
        playRequest()
        getStatus()
        

        playWoodTap()
    }  
    
    const goBack = () => {
            navigate(-1)
            playWoodTap()
        }

        const goForward = () => {
            navigate(1)
            playWoodTap()
        }

        const [pit, setPit] = useState('')

        // const postPitNumber = async () => {
        //     try {
        //         const response = await fetch(`${API}/api/game/oware-play-human-move`, 
        //             {
        //                 method: 'POST',
        //                 headers: {
        //                 'Content-Type': "application/json",
        //             },
        //             body: JSON.stringify(
        //                     { pit: Number(pit)}
        //                 )
        //             }
        //         )

        //     }

        //     catch (error) {
        //         console.log(error.message)
        //     }
        //     console.log(pit)

        // }

        
    const resetFxn = () => { 
        setMusicVolume(0.7)
        setSfxVolume(0.5)
        setGameDifficulty(2)

    }

        const [displayScreen, setDisplayScreen] = useState(false)
        const toggleSettingScreen = () => {
            setDisplayScreen(!displayScreen)
        }

        const returnScreen = () => {
            setDisplayScreen(false)
        }

        const useWelcomeResponses = () => {
        const welcomeResponses = [
            {
                text: "Welcome, Let's enjoy a game of Achi",
                voice: language === 'english' ?engEnjoyableGame :enjoyableGame
            },
            {
                text: "The Board is ready. Your move",
                voice: language === 'english'? engBoardReady : boardReady
            },
            {
                text: "Good luck. Let's see what you've got",
                voice: language === 'english' ? engGoodLuck : goodLuck
            },
            {
                text: "Everything is set. Shall we begin?",
                voice: language === 'english' ? engShallWeBegin : shallWeBegin
            },
            {
                text: "May the best strategist win",
                voice: language === 'english' ? engStrategistWins : strategistWin
            },
        ]

         const responseIndex = Math.floor(Math.random() * welcomeResponses.length)
            const selectedResponse = welcomeResponses[responseIndex]
            setResponse(selectedResponse.text)

            playVoice(selectedResponse.voice)
    }

    useEffect(() => {
        useWelcomeResponses()
    },[])


    const useGreatMoveResponses = () => {
        const greatMoveResponses = [
            {
                text: "That was a clever move",
                voice: language === 'english' ? engCleverMove : cleverMove
            },
            {
                text: "Nicely played",
                voice: language === 'english' ? engNicelyPlayed : nicelyPlayed
            },
            {
                text: "You've put me under pressure",
                voice: language === 'english' ? engUnderPressure : underPressure
            },
            {
                text: "Excellent choice",
                voice: language === 'english' ? engExcellentChoice : excellentChoice
            },
            {
                text: "You're thinking several moves ahead",
                voice: language === 'english' ? engSeveralMoves : severalMoves
            },
        ]

        const responseIndex = Math.floor(Math.random() * greatMoveResponses.length)
            const selectedResponse = greatMoveResponses[responseIndex]
            setResponse(selectedResponse.text)

            playVoice(selectedResponse.voice)
    }

    const useBadMoveResponses = () => {
        const badMoveResponses = [
            {
                text: "That may cost you later",
                voice: language === 'english' ? engCostYou : costYou
            },
            {
                text: "Be careful.That leaves an opening",
                voice: language === 'english' ? engLeaveOpening : leaveOpening
            },
            {
                text: "I'm not sure that was you best option",
                voice: language === 'english' ? engBestOption : bestOption
            },
            {
                text: "Interesting... let's see where that leads",
                voice: language === 'english' ? engWhereItLeads : whereItLeads
            },
            {
                text: "That changes the game in my favor",
                voice: language === 'english' ? engMyFavour : myFavor
            },
        ]

        const responseIndex = Math.floor(Math.random() * badMoveResponses.length)
            const selectedResponse = badMoveResponses[responseIndex]
            setResponse(selectedResponse.text)

            playVoice(selectedResponse.voice)

    }

    const [robotStatus, setRobotStatus] = useState('')
    const [gameOver, setGameOver] = useState(false)
    const [playerWins, setPlayerWins] = useState(false)
    const [agokansieWins, setAgokansieWins] = useState(false)
    const [winner, setWinner] = useState('')
    const [victor, setVictor] = useState('')

    const lastHandledStatus = useRef(null)
    const lastHandledVictor = useRef(null)

    useEffect(() => {

        // if (boardState?.state?.ratings === 0) {
        //     useBadMoveResponses();
        // } else if (boardState?.state?.ratings === 1) {
        //     useGreatMoveResponses();
        // }

        setRobotStatus(boardState?.state?.status)

        setGameOver(boardState?.state?.game_over)

        const isInvalid = status === 'error' || status === 'invalid_move'

        if (isInvalid && lastHandledStatus.current !== status) {
            useInvalidMoveResponses()
        }

        if (!isInvalid) {
            lastHandledStatus.current = null
        } else {
            lastHandledStatus.current = status
        }

        setVictor(boardState?.state?.winner)

    },[boardState, status])


    {/**Game difficulty post request */}

// useEffect(() =>{
//    const  handleDifficulty = async () => {
//     const response = await fetch(`${API}/someThing`, {
//         method : 'POST',
//         headers : {
//             'Content-Type' : 'application/json'
//         },
//         body : JSON.stringify({gameDifficulty})
//     })
//    }
//     },[gameDifficulty]) 


    useEffect (()=>{
        if (!gameOver) {
            lastHandledVictor.current = null
            return
        }

        if (lastHandledVictor.current === victor) return

        if (victor === 'player' ){
            setWinner('You win!');
            setPlayerWins(true)
            usePlayerWinsResponses();
            lastHandledVictor.current = victor
        }
        else if (victor === 'robot') {
            setWinner('Agokansie wins!');
            setAgokansieWins(true)
            useRobotWinsResponses();
            lastHandledVictor.current = victor
        }
    }, [gameOver, victor])

    const useInvalidMoveResponses = () => {
        const invalidMovesResponses = [
            {
                text: "That move breaks the rules",
                voice: language === 'english' ? engBreaksRules : breaksRules
            },
            {
                text: "Please choose another move",
                voice: language === 'english' ? engAnotherMove : anotherMove
            }
        ]

        const responseIndex = Math.floor(Math.random() * invalidMovesResponses.length)
            const selectedResponse = invalidMovesResponses[responseIndex]
            setResponse(selectedResponse.text)

            playVoice(selectedResponse.voice)
    }


    const BackToHome = () => {
        navigate('/')
        playWoodTap()
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
    { top: "100%", left: "100%" },      // 0
    { top: "100%", left: "50%" },     // 1
    { top: "100%", left: "0%" },    // 2

    { top: "50%", left: "100%" },     // 3
    { top: "50%", left: "50%" },    // 4
    { top: "50%", left: "0%" },   // 5

    { top: "0%", left: "100%" },    // 6
    { top: "0%", left: "50%" },   // 7
    { top: "0%", left: "0%" },  // 8
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

    const [proverb, setProverb] = useState()

    const proverbData = ['One finger cannot pick up a stone', 'Rain does not fall on one roof alone', 'A child who asks questions never loses the way', "A crab doesn't give birth to a bird"]
    
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * proverbData.length)
        setProverb(proverbData[randomIndex])
        console.log(proverb)
    }, [])
    
    const handleReward = () => {
        claimReward()
        setGetReward(false)
    }
    
    return(
        <PageWrapper >
            <div className={`absolute inset-0 bg-gradient-to-r from-[#3b1f0f]/80 via-[#8b5a2b]/70 to-[#d4a017]/80 -z-1 min-h-screen flex flex-col items-center justify-center ${status === 'error' ? 'border-4 border-red-500' : ''} ${gameOver ? 'bg-black': ''}`}>
                <img src={bg} alt="background image" className={`absolute object-cover w-full h-full -z-1 opacity-[0.5]  `}/>   
        </div>

        <div className='flex flex-col h-screen w-full'>

            <div className="absolute top-1 right-1 flex items-center gap-5 z-50 backdrop-blur p-3 rounded-lg">
                <div className='flex items-center justify-center'>
                    <ArrowLeft className=' left-3 size-7 cursor-pointer' onClick={goBack} />
                    <ArrowRight className=' size-7 text-gold-300 cursor-pointer' onClick={goForward} />
                </div>
                <div className='flex'>
                    <Settings className='cursor-pointer' onClick={toggleSettingScreen} />
                </div>
            </div>

 {/* game over screen */}

            { gameOver ?
                
                
                <div className='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-220 h-150 z-100'>
                    <div className='flex flex-col justify-center items-center rounded-3xl border-4 border-[#b98b56] bg-[#efe0c2] shadow-2xl overflow-hidden bg-dark p-5 gap-10'>

                        <p className='font-elite text-6xl font-bold text-darkgold'>GAME OVER</p>

                        <div className='rounded-lg border-1 w-3/4 h-90 shadow-darkgold shadow-sm flex flex-col'>

                            
                            <div className='flex items-center justify-center '>
                                <p className='border-1 border-t-0 text-[16px] font-bold p-2 rounded-bl rounded-br text-midGold text-2xl '>{winner}</p>
                            </div>
                            
                            <div className='flex w-full size-65'>
                                
                                <div className='w-3/7 flex flex-col items-center justify-center gap-3'>
                                     <img src={player} className={`border-1 size-35 rounded-[50%] ${playerWins ? ' border-2 border-darkgold shadow-darkgold': ''}  shadow-sm `}/>
                                    <p className={`font-elite text-xl font-bold ${playerWins ? 'text-darkgold' : 'text-midGold'} `}>You</p>
                                    <p className={`text-6xl font-bold ${playerWins  ? 'text-darkgold' : 'text-midGold'}`}></p>
                                </div>

                                <div className='w-1/7 flex items-center justify-center'>
                                    <p className='font-fingerpaint text-5xl font-bold text-midGold'>VS</p>
                                </div>

                                <div className='w-3/7 flex flex-col items-center justify-center gap-3'>
                                     <img src={robot} className={`border-1 size-35 rounded-[50%] ${agokansieWins ? ' border-2 border-darkgold shadow-darkgold': ''}  shadow-sm `}/>
                                    <p className={`font-elite text-xl font-bold ${agokansieWins ? 'text-darkgold' : 'text-midGold'} `}>Agokansie</p>
                                    <p className={`text-6xl font-bold ${agokansieWins ? 'text-darkgold' : 'text-midGold'}`}></p>
                                </div>
                            </div>

                            <div className='flex items-center justify-center '>
                                <p className='border-1 text-[16px] font-bold p-2 rounded-lg text-midGold'>{proverb}</p>
                            </div>

                        </div>

                        <div className='flex items-center justify-center gap-10 w-9/10'>
                            <button className='flex items-center justify-center p-3 gap-2 border-1 rounded-lg cursor-pointer font-bold text-xl text-midGold hover:scale-95 duration-300' onClick={() => navigate('/selectionScreen')}>
                                <RotateCcw/>
                                <p>PLAY AGAIN </p>  
                            </button>

                            { agokansieWins && getReward ?  <button className='flex items-center justify-center p-3 gap-2 border-1 rounded-lg cursor-pointer font-bold text-xl animate-float text-midGold hover:scale-95 duration-300' onClick={handleReward} >
                                <Trophy />
                                <p>CLAIM YOUR REWARD</p>
                            </button>  : null
                            }
                            
                             <button className='flex items-center justify-center p-3 gap-2 border-1 rounded-lg cursor-pointer font-bold text-xl text-midGold hover:scale-95 duration-300' onClick={BackToHome}>
                                <House />
                                <p>BACK TO HOME</p>
                            </button>
                        </div>
                    </div>

                </div> 
                
                
                
            : null
            }  

            {displayScreen ?
                <div className='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-220 h-150 z-100 '>
                        

      {/* Card */}
      <div className="rounded-3xl border-4 border-[#b98b56] bg-[#efe0c2] shadow-2xl overflow-hidden bg-wood1">

        {/* Header */}
        <div className="relative py-2 text-center border-b border-[#c8aa73] ">

          <button className="absolute right-3 top-3 cursor-pointer hover:scale-110 transition" onClick={returnScreen}>
            <CircleX className='size-9 text-gold'/>
          </button>

          <h1
            className="text-6xl tracking-widest text-darkgold font-kablammo "
          >
            {games[currentGame].name}
          </h1>

          <p className="text-gold uppercase tracking-[4px] mt-1">
            SETTINGS
          </p>
        </div>

        {/* Body */}
        <div className="p-8 space-y-10">

          {/* ---------------- SOUND ---------------- */}

          <section>

            <div className="flex items-center gap-3 mb-5">

              <div className="w-14 h-14 rounded-full bg-[#5f4326] text-white flex items-center justify-center">
                <Volume2 size={28} />
              </div>

              <h2 className="text-2xl font-bold">
                SOUND
              </h2>

            </div>

            <div className="space-y-5 ml-20">

              <div className="flex items-center gap-4">

                <Music />

                <label className="w-24">
                  Music
                </label>

                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(musicVolume * 100)}
                  onChange={(e) => setMusicVolume(Number(e.target.value) / 100)}
                  className="flex-1 accent-sky-500"
                />

                <span>{Math.round(musicVolume * 100)}%</span>

              </div>

              <div className="flex items-center gap-4">

                <AudioLines />

                <label className="w-24">
                  SFX
                </label>

                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(sfxVolume * 100)}
                  onChange={(e) => setSfxVolume(Number(e.target.value) / 100)}
                  className="flex-1 accent-sky-500"
                />

                <span>{Math.round(sfxVolume * 100)}%</span>

              </div>

            </div>

          </section>

          {/* ---------------- GAMEPLAY ---------------- */}

           <section>

            <div className="flex items-center gap-3 mb-5">

              <div className="w-14 h-14 rounded-full bg-[#5f4326] text-white flex items-center justify-center">
                <Gamepad2 size={28} />
              </div>

              <h2 className="text-2xl font-bold">
                GAMEPLAY
              </h2>

            </div>

            <div className="ml-20 space-y-6">

              {/* Difficulty */}

              <div className="flex items-center">

                <label className="w-36" >
                  Difficulty
                </label>

                <div className="flex gap-3">

                  <button className={`px-6 py-2 rounded-xl border ${gameDifficulty === 1 ? 'bg-[#5B4430]  border-darkgold text-[#F5E6C8]' : 'bg-transparent border-[#5B4430] text-[#F5E6C8] '}`} onClick={() => {setGameDifficulty(1)}}>
                    Easy
                  </button>

                  <button className={`px-6 py-2 rounded-xl bg-[#4a3220] border ${gameDifficulty === 2 ? 'bg-[#5B4430] border-darkgold text-[#F5E6C8]' : 'bg-transparent border-[#5B4430]  text-[#F5E6C8] '}`} onClick={() => {setGameDifficulty(2)}}>
                    Normal
                  </button>

                   <button className={`px-6 py-2 rounded-xl bg-[#4a3220] border ${gameDifficulty === 3 ? 'bg-[#5B4430] border-darkgold text-[#F5E6C8]' : 'bg-transparent border-[#5B4430]  text-[#F5E6C8] '}`} onClick={() => {setGameDifficulty(3)}}>
                    Hard
                  </button>

                </div>

              </div>
              
            </div>

          </section>


        </div>

        {/* Footer */}

        <div className="flex justify-between p-8 border-t border-[#c8aa73]">
        
        <button className="flex items-center gap-2 border px-6 py-3 rounded-xl hover:bg-[#e8d6b4] transition" onClick={resetFxn}>

        <RotateCcw size={18} />

        Reset

        </button>

        <button className="flex items-center gap-2 bg-[#5A3A22] text-white px-8 py-3 rounded-xl hover:bg-[#382416] transition" onClick={returnScreen}>

        <Check size={18} />

        Save & Close

        </button>

    </div>

      </div>

    </div>
  
                : null
        
            }

            <div className='absolute top-15 right-1 flex flex-col gap-4'>
                {/* <div>
                    <input type='number' placeholder='Enter pit number' value={pit} onChange={(e) => setPit(e.target.value)} className='p-3 border-1 rounded-lg'/>
                    <button className='text-xl p-3 cursor-pointer border-1 rounded-lg' onClick={postPitNumber} >Enter</button>
                </div> */}
                
                <div className= {`border-none p-2 text-xl rounded-[2px] text-center bg-gold text-black ${status === 'error' ? 'bg-red-500':''}`}>
                    <p>{`Status: ${status}`}</p>
                </div>
            </div>

       
            <div className='flex flex-row items-start gap-4 p-6 shrink-0' >
                
                <img src={thinking_image} className='h-40'/>

                <div>
                    <div>
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
                    </div>
                            
                    <div className='relative shadow-lg rounded-lg p-3 text-[17px] backdrop-blur-md text-white'>
                        <p>{response}</p>
                    </div>
                    
                </div>
                
            </div>

        <div className='absolute inset-0 flex items-center justify-center mt-35 -z-1 scale-90'>
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
                        className="absolute size-6 z-10 rounded-full bg-darkgold -translate-x-1/2 -translate-y-1/2"
                        style={position}
                    />
                ))}

                {/* Pieces */}
                {board.map((square, index) =>
                    square !== 0 && (
                        <div
                            key={index}
                            className={`absolute z-20 size-16 rounded-full border-2 border-gold
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

             <button onClick={getBoardState} className={`absolute bottom-5 right-5 border-none p-3 w-40 text-xl rounded-lg cursor-pointer bg-gradient-to-br from-[#A47551] to-[#6B4226] text-[#F7E7CE] uppercase font-bold hover:scale-95 transition-all duration-300
                     ${status === 'robot_playing' || status === 'robot_thinking' ? 'hidden' : ''}`}
                    disabled={
                        status === 'robot_playing'? true : false
                    }>I've played</button>
            
        </PageWrapper>
        
    )   
}

export default AchiGame