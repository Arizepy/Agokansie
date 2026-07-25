import { useContext, useState, useRef, useEffect, } from 'react'
import PageWrapper from '../WelcomeScreen/PageWrapper'
import { GameContext } from '../context/GameContext'
import thinking_image  from '../assets/black_man_thinking.webp'
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

{/**EndGame */}
import finalStage from '../assets/sound/endGame/finalStage.m4a'

{/**Great move */}
import cleverMove from '../assets/sound/great_move/cleverMove.m4a'
import excellentChoice from '../assets/sound/great_move/excellentChoice.m4a'
import nicelyPlayed from '../assets/sound/great_move/nicelyPlayed.m4a'
import severalMoves from '../assets/sound/great_move/severalMoves.m4a'
import underPressure from '../assets/sound/great_move/underPressure.m4a'

{/**Invalid move */}
import anotherMove from '../assets/sound/invalid_move/anotherMove.m4a'
import breaksRules from '../assets/sound/invalid_move/breaksRules.m4a'

{/**Player captures seeds */}
import didNotExpect from '../assets/sound/player_captures_seeds/didNotExpect.m4a'
import foundOpening from '../assets/sound/player_captures_seeds/foundOpening.m4a'
import goodCapture from '../assets/sound/player_captures_seeds/goodCapture.m4a'
import nicelyExecuted from '../assets/sound/player_captures_seeds/nicelyExecuted.m4a'


{/**Player wins */}
import excellentGame from '../assets/sound/player_wins/excellentGame.m4a'
import tillNextgame from '../assets/sound/player_wins/tillNextGame.m4a'
import wellDeserved from '../assets/sound/player_wins/wellDeserved.m4a'
import wellDone from '../assets/sound/player_wins/wellDone.m4a'

{/**robot_captured_seed */}
import opportunity from '../assets/sound/robot_captures_seeds/opportunity.m4a'
import seedCounts from '../assets/sound/robot_captures_seeds/seedCounts.m4a'
import takingSeeds from '../assets/sound/robot_captures_seeds/takingSeeds.m4a'
import usefulHarvest from '../assets/sound/robot_captures_seeds/usefulHarvest.m4a'
import workedWell from '../assets/sound/robot_captures_seeds/workedWell.m4a'

{/**Robot wins */}
import enjoyable from '../assets/sound/robot_wins/enjoyable.m4a'
import playedWell from '../assets/sound/robot_wins/playedWell.m4a'
import victoryMine from '../assets/sound/robot_wins/victoryMine.m4a'

{/**Welcome */}
import boardReady from '../assets/sound/welcome/boardReady.m4a'
import enjoyableGame from '../assets/sound/welcome/enjoyGame.m4a'
import goodLuck from '../assets/sound/welcome/goodLuck.m4a'
import shallWeBegin from '../assets/sound/welcome/shallWeBegin.m4a'
import strategistWin from '../assets/sound/welcome/strategistWin.m4a'

import { API } from './API'




function OwareGame(){
    

    const useRobotCaputureSeedResponses = () => {
        const RobotCaptureSeedResponses = [
            {
                text: "I'll take those seeds",
                voice: takingSeeds
            },
            {
                text: "A useful harvest",
                voice: usefulHarvest
            },
            {
                text: "That worked out well for me",
                voice: workedWell
            },
            {
                text: "Every seed counts",
                voice: seedCounts
            },
            {
                text: "Thank you for the opportunity",
                voice: opportunity
            },
        ]

        const responseIndex = Math.floor(Math.random() * RobotCaptureSeedResponses.length)
            const selectedResponse = RobotCaptureSeedResponses[responseIndex]
            setResponse(selectedResponse.text)

            const voiceover = new Audio(selectedResponse.voice)
            voiceover.play()
    }

    const usePlayerCaputureSeedResponses = () => {
        const RobotCaptureSeedResponses = [
            {
                text: "Well done",
                voice: wellDone
            },
            {
                text: "You found the opening",
                voice: foundOpening
            },
            {
                text: "That was a good capture",
                voice: goodCapture
            },
            {
                text: "I didn't expect that",
                voice: didNotExpect
            },
            {
                text: "Nicely executed",
                voice: nicelyExecuted
            },
        ]

        const responseIndex = Math.floor(Math.random() * RobotCaptureSeedResponses.length)
            const selectedResponse = RobotCaptureSeedResponses[responseIndex]
            setResponse(selectedResponse.text)

            const voiceover = new Audio(selectedResponse.voice)
            voiceover.play()
    }

    const useRobotWinsResponses = () => {
        const RobotWinsResponses = [
            {
                text: "Well played. Let's play again",
                voice: playedWell
            },
            {
                text: "Good game. That was enjoyable",
                voice: enjoyableGame
            },
            {
                text: "Victory is mine this time",
                voice: victoryMine
            },
        
        ]

        const responseIndex = Math.floor(Math.random() * RobotWinsResponses.length)
            const selectedResponse = RobotWinsResponses[responseIndex]
            setResponse(selectedResponse.text)

            const voiceover = new Audio(selectedResponse.voice)
            voiceover.play()
    }

    const usePlayerWinsResponses = () => {
        const playerWinsResponses = [
            {
                text: "Well deserved. You win",
                voice: wellDeserved
            },
            {
                text: "Excellent game. I enjoyed that",
                voice: excellentGame
            },
            {
                text: "Until our next game",
                voice: tillNextgame
            },
            {
                text: "Congratulations. You played very well",
                voice: wellDone
            },
            
        ]

        const responseIndex = Math.floor(Math.random() * playerWinsResponses.length)
            const selectedResponse = playerWinsResponses[responseIndex]
            setResponse(selectedResponse.text)

            const voiceover = new Audio(selectedResponse.voice)
            voiceover.play()
    }


    const useEndGameResponses = () => {
        const useEndGameResponses = [
           {
            text:"We're entering the final stage",
            voice: finalStage
           }
        ]
            setResponse(useEndGameResponses[0].text)
            const voiceover = new Audio(useEndGameResponses[0].voice)
            voiceover.play()
    }


    const {games, currentGame} = useContext(GameContext)

    const navigate = useNavigate()

    const thinking = "..."

    const [beadCount, setBeadCount] = useState(4)

    const [leftOverBeads, setLeftOverBeads] = useState(0)

    const [boardValueList, setBoardValueList] = useState([])

    const [status, setStatus] = useState('')

    const [response, setResponse] = useState('')

    const [getReward, setGetReward] = useState(true)


    const woodTap = useRef(new Audio(woodTapSound))

    const OutOfPlay = ({leftOverBeads}) => {
        return(
            <>

                <div className='flex flex-wrap items-center justify-center gap-1 p-4'>
                    {Array.from({length: leftOverBeads}).map((_, index) => (
                                        <div key={index}
                                            className='rounded-full bg-gradient-to-br from-grey-500 to-green-200 size-4'></div>
                                    ))}
                </div>
               
            </>
    
        )
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

    // const getRequest = async () => {
    //         try {
    //             const response = await fetch('http://192.168.88.40:5000/api/game/play')

    //             if(!response.ok){
    //                 throw new Error('Request failed')
    //             }

    //             const BoardData = await response.json()
    //             setBoardValueList(BoardData.board)
    //             console.log(BoardData.board)
    //         }

    //         catch (error) {
    //             console.log(error.message)
    //         }

               
    //     }

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
                setBoardValueList(BoardData.state.board)

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

                setBoardValueList(BoardData.state.board)
                setBoardState(BoardData)
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

        useEffect(() => {
            getStatus()

            const interval = setInterval(getStatus, 5000)

            return () => clearInterval(interval)
        },[])

    useEffect(() => {
        // getRequest()
        postRequest()
        
    }, []) 

    const getBoardState = () => {
        playRequest()
        getStatus()
        

        woodTap.current.currentTime = 0
        woodTap.current.play()
    }  
    
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

        const [pit, setPit] = useState('')

        const postPitNumber = async () => {
            try {
                const response = await fetch(`${API}/api/game/oware-play-human-move`, 
                    {
                        method: 'POST',
                        headers: {
                        'Content-Type': "application/json",
                    },
                    body: JSON.stringify(
                            { pit: Number(pit)}
                        )
                    }
                )

            }

            catch (error) {
                console.log(error.message)
            }
            console.log(pit)

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
                text: "Welcome, Let's enjoy a game of Oware",
                voice: enjoyableGame
            },
            {
                text: "The Board is ready. Your move",
                voice: boardReady
            },
            {
                text: "Good luck. Let's see what you've got",
                voice: goodLuck
            },
            {
                text: "Everything is set. Shall we begin?",
                voice: shallWeBegin
            },
            {
                text: "May the best strategist win",
                voice: strategistWin
            },
        ]

         const responseIndex = Math.floor(Math.random() * welcomeResponses.length)
            const selectedResponse = welcomeResponses[responseIndex]
            setResponse(selectedResponse.text)

            const voiceover = new Audio(selectedResponse.voice)
            voiceover.play()
    }

    useEffect(() => {
        useWelcomeResponses()
    },[])


    const useGreatMoveResponses = () => {
        const greatMoveResponses = [
            {
                text: "That was a clever move",
                voice: cleverMove
            },
            {
                text: "Nicely played",
                voice: nicelyPlayed
            },
            {
                text: "You've put me under pressure",
                voice: underPressure
            },
            {
                text: "Excellent choice",
                voice: excellentChoice
            },
            {
                text: "You're thinking several moves ahead",
                voice: severalMoves
            },
        ]

        const responseIndex = Math.floor(Math.random() * greatMoveResponses.length)
            const selectedResponse = greatMoveResponses[responseIndex]
            setResponse(selectedResponse.text)

            const voiceover = new Audio(selectedResponse.voice)
            voiceover.play()
    }

    const useBadMoveResponses = () => {
        const badMoveResponses = [
            {
                text: "That may cost you later",
                voice: costYou
            },
            {
                text: "Be careful.That leaves an opening",
                voice: leaveOpening
            },
            {
                text: "I'm not sure that was you best option",
                voice: bestOption
            },
            {
                text: "Interesting... let's see where that leads",
                voice: whereItLeads
            },
            {
                text: "That changes the game in my favor",
                voice: myFavor
            },
        ]

        const responseIndex = Math.floor(Math.random() * badMoveResponses.length)
            const selectedResponse = badMoveResponses[responseIndex]
            setResponse(selectedResponse.text)

            const voiceover = new Audio(selectedResponse.voice)
            voiceover.play()

    }

    const [robotStatus, setRobotStatus] = useState('')
    const [gameOver, setGameOver] = useState(true)
    const [playerScore, setPlayerScore] = useState()
    const [robotScore, setRobotScore] = useState()
    const [playerWins, setPlayerWins] = useState(true)
    const [agokansieWins, setAgokansieWins] = useState(false)
    const [winner, setWinner] = useState('')

     
    useEffect(() => {
        // if (boardState?.state?.ratings === 0) {
        //     useBadMoveResponses();
        // } else if (boardState?.state?.ratings === 1) {
        //     useGreatMoveResponses();
        // }


        setRobotStatus(boardState?.state?.status)
        console.log(robotStatus)

        setGameOver(boardState?.state?.game_over)
        console.log(gameOver)   

        setRobotScore(boardState?.state?.scores?.robot)
        console.log(robotScore)

        setPlayerScore(boardState?.state?.scores?.player)
        console.log(playerScore)

        if(status === 'error' || status === 'invalid_move'){
            useInvalidMoveResponses()
        }
   

    },[boardState, status])

    useEffect (()=>{
        if (gameOver && playerScore > robotScore){ 
            setWinner('You win!'); 
            setPlayerWins(true)
            usePlayerWinsResponses();
        }

        else if (gameOver && playerScore === robotScore){
            setWinner("It's a draw")
        }

        else if (gameOver && robotScore > playerScore ) {
            setWinner('Agokansie wins!'); 
            setAgokansieWins(true)
            useRobotWinsResponses();
        }
    }, [playerScore, robotScore])

    const useInvalidMoveResponses = () => {
        const invalidMovesResponses = [
            {
                text: "That move breaks the rules",
                voice: breaksRules
            },
            {
                text: "Please choose another move",
                voice: anotherMove
            }
        ]

        const responseIndex = Math.floor(Math.random() * invalidMovesResponses.length)
            const selectedResponse = invalidMovesResponses[responseIndex]
            setResponse(selectedResponse.text)

            const voiceover = new Audio(selectedResponse.voice)
            voiceover.play()
    }



    const BackToHome = () => {
        navigate('/selectionScreen')
        woodTap.current.currentTime = 0
        woodTap.current.play()
    }

    const restartGame = () => {
        window.location.reload()
        woodTap.current.currentTime = 0
        woodTap.current.play()
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
     
    const handleReward = () => {
        claimReward()
        setGetReward(false)
    }
    
    
    return(
        <PageWrapper >
            <div className={`absolute inset-0 bg-gradient-to-r from-[#3b1f0f]/80 via-[#8b5a2b]/70 to-[#d4a017]/80 -z-1 min-h-screen flex flex-col items-center justify-center ${status === 'error' ? 'border-4 border-red-500' : ''} ${gameOver ? 'bg-black': ''}`}>
                <img src={bg} alt="background image" className={`absolute object-cover w-full h-full -z-1 opacity-[0.5]`}/>   
        </div>

        <div className='flex flex-col h-screen w-full'>

            <div className="absolute top-0 right-0 flex items-center gap-5 z-50 bg-dark/80 p-3 rounded-bl-lg">
                <div className='flex items-center justify-center'>
                    <ArrowLeft className=' left-3 size-7 cursor-pointer text-gold' onClick={goBack} />
                    <ArrowRight className=' size-7 text-gold-300 cursor-pointer text-gold' onClick={goForward} />
                </div>
                <div className='flex'>
                    <Settings className='cursor-pointer text-gold' onClick={toggleSettingScreen} />
                </div>
            </div>

 {/* game over screen */}

            {
            gameOver ?
                
                <div className='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-220 h-150 z-100'>
                    <div className='flex flex-col justify-center items-center rounded-3xl border-4 border-[#b98b56] bg-[#efe0c2] shadow-2xl overflow-hidden bg-dark/98 p-5 gap-10'>

                        <p className='font-elite text-6xl font-bold text-darkgold'>GAME OVER</p>

                        <div className='rounded-lg border-1 w-3/4 h-90 shadow-darkgold shadow-lg flex flex-col'>

                            
                            <div className='flex items-center justify-center '>
                                <p className='border-1 border-t-0 text-[16px] font-bold p-2 rounded-bl rounded-br text-midGold'>{winner}</p>
                            </div>
                            
                            <div className='flex w-full size-65'>
                                
                                <div className='w-3/7 flex flex-col items-center justify-center gap-3'>
                                     <img src={player} className={`border-1 size-35 rounded-[50%] ${playerWins ? ' border-2 border-darkgold shadow-darkgold': ''}  shadow-sm `}/>
                                    <p className={`font-elite text-xl font-bold ${playerWins ? 'text-darkgold' : 'text-midGold'} `}>You</p>
                                    <p className={`text-6xl font-bold ${playerWins ? 'text-darkgold' : 'text-midGold'}`}>{playerScore}</p>
                                </div>

                                <div className='w-1/7 flex items-center justify-center'>
                                    <p className='font-fingerpaint text-5xl font-bold text-midGold'>VS</p>
                                </div>

                                <div className='w-3/7 flex flex-col items-center justify-center gap-3'>
                                     <img src={robot} className={`border-1 size-35 rounded-[50%] ${agokansieWins ? ' border-2 border-darkgold shadow-darkgold': ''}  shadow-sm `}/>
                                    <p className={`font-elite text-xl font-bold ${agokansieWins ? 'text-darkgold' : 'text-midGold'} `}>Agokansie</p>
                                    <p className={`text-6xl font-bold ${agokansieWins ? 'text-darkgold' : 'text-midGold'}`}>{robotScore}</p>
                                </div>
                            </div>  

                            <div className='flex items-center justify-center '>
                                <p className='border-1 text-[16px] font-bold p-2 rounded-lg text-midGold'>A crab cannot give birth to a bird</p>
                            </div>

                        </div>

                        <div className='flex items-center justify-between w-9/10'>
                            <button className='flex items-center justify-center p-3 gap-2 border-1 rounded-lg cursor-pointer font-bold text-xl text-midGold hover:scale-95 duration-300' onClick={restartGame}>
                                <RotateCcw/>
                                <p>PLAY AGAIN </p>  
                            </button>
                         { playerWins && getReward ?  <button className='flex items-center justify-center p-3 gap-2 border-1 rounded-lg cursor-pointer font-bold text-xl animate-float text-midGold hover:scale-95 duration-300' onClick={handleReward} >
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
                <div className='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-220 h-150 '>
                        

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
                  defaultValue={70}
                  className="flex-1 accent-sky-500"
                />

                <span>70%</span>

              </div>

              <div className="flex items-center gap-4">

                <AudioLines />

                <label className="w-24">
                  SFX
                </label>

                <input
                  type="range"
                  defaultValue={60}
                  className="flex-1 accent-sky-500"
                />

                <span>60%</span>

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

                <label className="w-36">
                  Difficulty
                </label>

                <div className="flex gap-3">

                  <button className="px-6 py-2 rounded-xl border">
                    Easy
                  </button>

                  <button className="px-6 py-2 rounded-xl bg-[#4a3220] text-white">
                    Normal
                  </button>

                  <button className="px-6 py-2 rounded-xl border">
                    Hard
                  </button>

                </div>

              </div>

              {/* Player */}

              <div className="flex items-center">

                <label className="w-36">
                  Play As
                </label>

                <div className="flex gap-3">

                  <button className="px-6 py-2 rounded-xl bg-[#4a3220] text-white">
                    Player 1
                  </button>

                  <button className="px-6 py-2 rounded-xl border">
                    Player 2
                  </button>

                </div>

              </div>

            </div>

          </section>


        </div>

        {/* Footer */}

        <div className="flex justify-between p-8 border-t border-[#c8aa73]">

          <button className="flex items-center gap-2 border px-6 py-3 rounded-xl hover:bg-[#e8d6b4] transition">

            <RotateCcw size={18} />

            Reset

          </button>

          <button className="flex items-center gap-2 bg-[#5A3A22] text-white px-8 py-3 rounded-xl hover:bg-[#382416] transition">

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

            <div className="flex-1 flex items-center justify-center">

                <div className="flex flex-col items-center">

                    <div className="w-75 h-27 bg-[#6b3f1d] border-4 border-b-0 border-[#4a2a12] rounded-t-[3rem] shadow-2xl flex items-center justify-center gap-3 p-4">
                        <div className="w-65 h-22 bg-[#5c3317] rounded-t-[3rem] shadow-2xl flex items-center justify-center gap-3 p-4">
                            <OutOfPlay leftOverBeads={robotScore}/>
                        </div>
                    </div>

                    <div className="bg-[#8b5a2b] p-6 border-x-4 border-[#5a3418] shadow-2xl rounded-4xl">

                    <div className="flex gap-4 mb-5">

                       <Pit beadCount={boardValueList[11]}/>
                        <Pit beadCount={boardValueList[10]}/>
                        <Pit beadCount={boardValueList[9]}/>
                        <Pit beadCount={boardValueList[8]}/>
                        <Pit beadCount={boardValueList[7]}/>
                        <Pit beadCount={boardValueList[6]}/> 

                    </div>

                    <div className="flex gap-4">
                        <Pit beadCount={boardValueList[0]}/>
                        <Pit beadCount={boardValueList[1]}/>
                        <Pit beadCount={boardValueList[2]}/>
                        <Pit beadCount={boardValueList[3]}/>
                        <Pit beadCount={boardValueList[4]}/>
                        <Pit beadCount={boardValueList[5]}/>
                        
                    </div>

                    </div>

                    <div className="w-75 h-27 bg-[#6b3f1d] border-4 border-t-0 border-[#4a2a12] rounded-b-[3rem] shadow-2xl flex items-center justify-center gap-3 p-4">
                        <div className="w-65 h-22 bg-[#5c3317] rounded-b-[3rem] flex items-center justify-center gap-3 p-4">
                            <OutOfPlay leftOverBeads={playerScore}/>

                    </div>
                    </div>

                    <button onClick={getBoardState} className={`absolute bottom-5 right-5 border-none p-3 w-40 text-xl rounded-lg cursor-pointer bg-gradient-to-br from-[#A47551] to-[#6B4226] text-[#F7E7CE] uppercase font-bold hover:scale-95 transition-all duration-300
                     ${status === 'robot_playing' ? 'hidden' : ''}`}
                    disabled={
                        status === 'robot_playing'? true : false
                    }>I've played</button>

            </div>

            </div>
            </div>
            
        </PageWrapper>
        
    )   
}

export default OwareGame