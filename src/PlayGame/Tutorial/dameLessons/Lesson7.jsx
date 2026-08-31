import { useContext, useState, useRef, useEffect, } from 'react'
import PageWrapper from '../../../WelcomeScreen/PageWrapper'
import bg from '../../../assets/background-collage.png'
import thinking_image  from '../../../assets/black_man_thinking.webp'
import { ArrowRight, ArrowLeft, CornerDownLeft, CornerDownRight, House} from 'lucide-react'
import { useNavigate } from "react-router-dom";
import woodTapSound from '../../../assets/sound/woodTap.mp3'
import ErrorSound from '../../../assets/sound/error.mp3'
import showHint from '../../../assets/sound/blocked.mp3'
import Victory from '../../../assets/sound/victory.mp3'
import { useLanguage } from '../../../context/languageContext'

import { gsap } from 'gsap'

//Lesson sound 
import endOne from '../../../assets/sound/dame/endOne.m4a'
import endTwo from '../../../assets/sound/dame/endTwo.m4a'   
import endThree from '../../../assets/sound/dame/endThree.m4a'
import endFour from '../../../assets/sound/dame/endFour.m4a'
import engEndOne from '../../../assets/sound/dame/DameLessonSevenStepOne.mp3'
import engEndTwo from '../../../assets/sound/dame/DameLessonSevenStepTwo.mp3'
import engEndThree from '../../../assets/sound/dame/DameLessonSevenStepThree.mp3'
import engEndFour from '../../../assets/sound/dame/DameLessonSevenStepFour.mp3'

export default  function DameLesson7(){

const woodTap = useRef(new Audio(woodTapSound))
const error = useRef(new  Audio(ErrorSound))
const hint = useRef (new Audio(showHint))
const {language} = useLanguage()
const victory = useRef(new Audio(Victory))
const voiceRef = useRef(new Audio());

                                                                                                                       
const playWoodTap = () => { 
    if (woodTap.current) { 
        woodTap.current.currentTime = 0; 
        woodTap.current.volume = 0.1
        woodTap.current.play();
    }
}

const playError = () => { 
    if (error.current) { 
        error.current.currentTime = 0; 
        error.current.volume = 0.1
        error.current.play();
    }
}
const playHint = () => {
    if (hint.current) { 
        hint.current.currentTime =  0; 
        hint.current.volume = 0.1
        hint.current.play();
    }
}

const playVictory = ()  => {
    if (victory.current) { 
        victory.current.currentTime = 0; 
        victory.current.volume = 0.1
        victory.current.play()
    }
}

const thinking = "..."
 const steps = [{
        step: '1',
        text: "The game ends when one player captures all of their opponent's pieces.",
        voice: language === 'english' ? engEndOne: endOne

    },{
        step: '2',
        text: "A player also wins if their opponent still has pieces remaining but none of them can make a legal move.",
        voice: language === 'english' ? engEndTwo : endTwo

    },{
        step: '3',
        text: "If neither player can make progress by capturing or blocking the other's remaining pieces, both players may agree to declare the game a draw.",
        voice: language === 'english' ? engEndThree : endThree
    },{
        step: '4',
        text: "After the game has ended, count the remaining pieces, congratulate the winner, and reset the board to prepare for another match.",
        voice: language === 'english' ? engEndThree : endThree

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
            navigate('/selectionScreen')
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
            navigate('/damelesson6')
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


//Animation
const pieceRefs = useRef([])
const idx = (row, col) => row * 8 + col
const cellRefs = useRef([])


const step1sequence = [

    { type: "place", player: 1, row: 3, col: 3 },
    { type: "place", player: 1, row: 5, col: 3 }, 

    { type: "place", player: 2, row: 2, col: 2 }, 

    {
        type: "multiCapture",
        player: 2,
        from: { row: 2, col: 2 },
        jumps: [
            { captured: { row: 3, col: 3 }, to: { row: 4, col: 4 } },
            { captured: { row: 5, col: 3 }, to: { row: 6, col: 2 } }
        ]
    },

    {
        type: "gameOver",
        remaining: [{ row: 6, col: 2 }]
    },

];

const step2sequence = [

    { type: "place", player: 1, row: 4, col: 0 }, 
    { type: "place", player: 2, row: 5, col: 1 }, 

    { type: "place", player: 1, row: 3, col: 7 },
    { type: "place", player: 2, row: 4, col: 6 },

    {
        type: "showTrapped",
        position: { row: 4, col: 0 },
        blockedBy: [{ row: 5, col: 1 }]
    },

    {
        type: "showTrapped",
        position: { row: 3, col: 7 },
        blockedBy: [{ row: 4, col: 6 }]
    },

    {
        type: "gameOver",
        remaining: [{ row: 5, col: 1 }, { row: 4, col: 6 }]
    },

];

const step3sequence = [

    { type: "place", player: 3, row: 2, col: 2 }, 
    { type: "place", player: 4, row: 5, col: 5 },

    
    { type: "move", player: 3, from: { row: 2, col: 2 }, to: { row: 3, col: 3 } },
    { type: "move", player: 4, from: { row: 5, col: 5 }, to: { row: 4, col: 4 } },
    { type: "move", player: 3, from: { row: 3, col: 3 }, to: { row: 2, col: 2 } },
    { type: "move", player: 4, from: { row: 4, col: 4 }, to: { row: 5, col: 5 } },

   
    {
        type: "declareDraw",
        positions: [{ row: 2, col: 2 }, { row: 5, col: 5 }]
    },

];

const stepSequences = {
    '1': step1sequence,
     '2': step2sequence,
      '3': step3sequence,
    '4': step3sequence
}

const runAction = (tl, action, boardState) => {

    switch (action.type) {

        case "place":
            tl.call(() => {
                boardState[action.row][action.col] = action.player;
                setBoard(boardState.map(row => [...row]));
            });

            tl.to({}, { duration: 0.05 });

            tl.call(() => {
                const target = pieceRefs.current[idx(action.row, action.col)];
                if (!target) return;
                gsap.fromTo(target,
                    { scale: 0, y: -30, opacity: 0 },
                    { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: "back.out(2)" }
                );
            });

            tl.call(playWoodTap)
            break;

        case "move":
            tl.call(() => {
                boardState[action.from.row][action.from.col] = 0;
                boardState[action.to.row][action.to.col] = action.player;
                setBoard(boardState.map(row => [...row]));
            });

            tl.to({}, { duration: 0.05 }); // let React mount the piece at its new cell

            tl.call(() => {
                // the old DOM node is gone — this is a fresh element at the
                // new cell, so it "lands" rather than slides across the board
                const target = pieceRefs.current[idx(action.to.row, action.to.col)];
                if (!target) return;
                gsap.fromTo(target,
                    { scale: 0.6, y: -14, opacity: 0.4 },
                    { scale: 1, y: 0, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
                );
            });
            tl.call(playWoodTap)
            break;

case "showOptions":
    tl.call(() => {
        (action.options || []).forEach(({ row, col }) => {
            const cell = cellRefs.current[idx(row, col)];
            if (!cell) return; // safety guard

            gsap.to(cell, {
                boxShadow: "inset 0 0 0 4px rgba(124,255,124,0.9)",
                duration: 0.3,
                yoyo: true,
                repeat: 3
            });
        });
    });

    tl.to({}, { duration: 0.1 });

    tl.call(playHint)
    break;

  

case "reset":
    tl.call(() => {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (boardState[r][c] === 0) continue;
                const target = pieceRefs.current[idx(r, c)];
                if (!target) continue;
                gsap.to(target, { scale: 0, opacity: 0, duration: 0.35, ease: "back.in(2)" });
            }
        }
    });

    tl.to({}, { duration: 0.9 });

    tl.call(() => {
        for (let r = 0; r < 8; r++) boardState[r].fill(0);
        setBoard(boardState.map(row => [...row]));
    });

    break;



case "gameOver":
    tl.call(() => {
        (action.remaining || []).forEach(pos => {
            const piece = pieceRefs.current[idx(pos.row, pos.col)];
            if (!piece) return;
            gsap.to(piece, {
                scale: 1.3,
                boxShadow: "0 0 25px 8px rgba(255,215,0,0.9)",
                duration: 0.5,
                yoyo: true,
                repeat: 5 // finite — same leak lesson as every other highlight in this file
            });
        });
    });

    tl.to({}, { duration: 3 }); // hold well past everything else — this is where the sequence should rest
    break;

case "showTrapped":
    tl.call(() => {
        const piece = pieceRefs.current[idx(action.position.row, action.position.col)];
        if (piece) {
            gsap.timeline()
                .to(piece, { scale: 1.1, duration: 0.15, yoyo: true, repeat: 3 })
                .to(piece, { scale: 1, duration: 0.15 });
        }

        (action.blockedBy || []).forEach(pos => {
            const blocker = pieceRefs.current[idx(pos.row, pos.col)];
            if (!blocker) return;
            gsap.to(blocker, {
                boxShadow: "0 0 15px 4px rgba(255,180,0,0.8)", // amber — same meaning as Oware's "boxed in" highlight
                duration: 0.3,
                yoyo: true,
                repeat: 3
            });
        });
    });

    tl.to({}, { duration: 0.1 });

    tl.call(playError)
    break;

case "declareDraw":
    tl.call(() => {
        (action.positions || []).forEach(pos => {
            const piece = pieceRefs.current[idx(pos.row, pos.col)];
            if (!piece) return;
            gsap.to(piece, {
                boxShadow: "0 0 20px 6px rgba(200,200,200,0.8)", // neutral gray — no winner
                duration: 0.5,
                yoyo: true,
                repeat: 4
            });
        });
    });

    tl.to({}, { duration: 0.1 });
    tl.call(playVictory)
    break;

case "showSacrifice":
    tl.call(() => {
        const target = pieceRefs.current[idx(action.position.row, action.position.col)];
        if (!target) return;
        gsap.to(target, {
            boxShadow: "0 0 20px 6px rgba(168,85,247,0.9)", // purple — distinct from danger/defended
            duration: 0.35,
            yoyo: true,
            repeat: 3
        });
    });
    tl.to({}, { duration: 0.1 });

    tl.call(playError)
    break;


}}



useEffect(() => {
    const currentSequence = stepSequences[steps[currentStep].step]
    if (!currentSequence) return;

    let boardState = createBoard();

    const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 2,
        onRepeat: () => {
    for (let r = 0; r < 8; r++) {
        boardState[r].fill(0); // clears the SAME array every closure is holding
    }
    setBoard(boardState.map(row => [...row]));
    resetOptions(); // clear any still-highlighted showOptions cells too
}
    });

    currentSequence.forEach(action => {
        runAction(tl, action, boardState);
        tl.to({}, { duration: 1 });
    });

    return () => {
        tl.kill();
        resetOptions()
        setBoard(createBoard());
    };

}, [currentStep]);

const resetOptions = () => {
    cellRefs.current.forEach(cell => {
        if (!cell) return;
        gsap.killTweensOf(cell);
        gsap.set(cell, { boxShadow: "none" });
    });
};

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
            <p>{nextLesson ? 'Complete Tutorial' : 'Next'}</p>
            <CornerDownRight /> 
        </button>

        <button onClick={PreviousLessonNavigation} className='absolute bottom-5 left-5 border-none p-3 text-xl rounded-lg cursor-pointer bg-gradient-to-br from-[#A47551] to-[#6B4226] text-[#F7E7CE] uppercase font-bold hover:scale-95 transition-smooth duration-300 flex items-center justify-center gap-3'> 
            <CornerDownLeft /> 
            <p>{previousLessonVariable ? 'Previous Lesson' : 'Previous'}</p>
        </button>

    
       <div className='absolute left-1/2 -translate-x-1/2 border-2 border-t-0 border-midGold rounded-br-lg rounded-bl-lg px-6 py-2 text-center bg-dark/90 text-darkgold shadow-midGold shadow-sm '>

            <div>
                <p className='uppercase text-3xl font-bold font-fingerpaint'>End of the game</p>
            </div>

            <div className='flex items-center justify-between'>
                <p className=' text-midGold'>Lesson 7</p>
                <p className='text-midGold'>{`Step ${steps[currentStep].step}`}</p>
            </div>
            
        </div>

         <div className="absolute inset-0 flex items-center justify-center mt-35 -z-1 scale-90">
                     <div className="grid grid-cols-8 border-4 border-gray-900 ">
                    {board.map((row, rowIndex) =>
                        row.map((square, colIndex) => (
                    <div
                        ref={(el) => (cellRefs.current[idx(rowIndex, colIndex)] = el)}
                        key={`${rowIndex}-${colIndex}`}
                        className={`${
                        (rowIndex + colIndex) % 2 === 0
                    ? "bg-gold"
                    : "bg-dark"
                    } h-16 w-16 border flex items-center justify-center`}
        >
            {square !== 0 && (
    <div
        ref={(el) => (pieceRefs.current[idx(rowIndex, colIndex)] = el)}
        className={`size-9 rounded-full ${
            square === 1 ? "bg-black" :
            square === 2 ? "bg-red-600" :
            square === 3 ? "bg-black border-4 border-yellow-400" : // black king
            "bg-red-600 border-4 border-yellow-400"                 // red king (4)
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

