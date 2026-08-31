import { useContext, useState, useRef, useEffect, } from 'react'
import PageWrapper from '../../../WelcomeScreen/PageWrapper'
import bg from '../../../assets/background-collage.png'
import thinking_image  from '../../../assets/black_man_thinking.webp'
import { ArrowRight, ArrowLeft, CornerDownLeft, CornerDownRight, House} from 'lucide-react'
import { useNavigate } from "react-router-dom";
import woodTapSound from '../../../assets/sound/woodTap.mp3'
import ErrorSound from '../../../assets/sound/error.mp3'
import showHint from '../../../assets/sound/blocked.mp3'
import { useLanguage } from '../../../context/languageContext'
import { gsap } from 'gsap'

//Lesson sound 
import moveOne from '../../../assets/sound/dame/moveOne.m4a'
import moveTwo from '../../../assets/sound/dame/moveTwo.m4a'
import moveThree from '../../../assets/sound/dame/moveThree.m4a'
import moveFour from '../../../assets/sound/dame/moveFour.m4a'
import engMoveOne from '../../../assets/sound/dame/DameLessonThreeStepOne.mp3'
import engMoveTwo from '../../../assets/sound/dame/DameLessonThreeStepTwo.mp3'
import engMoveThree from '../../../assets/sound/dame/DameLessonFourStepThree.mp3'
import engMoveFour from '../../../assets/sound/dame/DameLessonFourStepFour.mp3'



function DameLesson3(){
const {language} = useLanguage()
const woodTap = useRef(new Audio(woodTapSound))
const error = useRef(new  Audio(ErrorSound))
const hint = useRef (new Audio(showHint))

const thinking = "..."

const voiceRef = useRef(new Audio());


const playWoodTap = () => { 
    if (woodTap.current) { 
        woodTap.current.currentTime = 0; 
        woodTap.current.volume = 0.1;
        woodTap.current.play();
    }
}

const playError = () => { 
    if (error.current) { 
        error.current.currentTime = 0; 
        error.current.volume = 0.1;
        error.current.play();
    }
}
const playHint = () => {
    if (hint.current) { 
        hint.current.currentTime =  0; 
        hint.current.volume = 0.1;
        hint.current.play();
    }
}
  const steps = [{
        step: '1',
        text: "During a normal turn, a piece may move one square diagonally forward into an empty space. Regular pieces cannot move backwards unless making a capture.",
        voice: language === 'english' ? engMoveOne : moveOne

    },{
        step: '2',
        text: "A piece may move diagonally either to the left or to the right, provided the destination square is empty.",
        voice: language === 'english' ? engMoveTwo : moveTwo

    },{
        step: '3',
        text: "When a piece reaches the edge of the board, its movement becomes limited because it can only move toward available spaces inside the board.",
        voice: language === 'english' ? engMoveThree : moveThree

    },{
        step: '4',
        text: "If all possible diagonal spaces are occupied by other pieces, whether they belong to you or your opponent, that piece becomes blocked and cannot move.",
        voice: language === 'english' ? engMoveFour : moveFour

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
        navigate('/damelesson4')
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
        navigate('/damelesson2')
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


// Board State 
const getBoardState = () => {
    console.log('i have played')    
}

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
    // Initial piece placements
    { type: "place", player: 2, row: 5, col: 5 },
    { type: "place", player: 1, row: 2, col: 2 },
    
    {
        type: "invalidBackMove",
        player: 2,
        from: { row: 5, col: 5 },
        to: { row: 6, col: 6 },
        reason: "backward"
    },

    {
        type: "showOptions",
        options: [
            { row: 4, col: 6 },
            { row: 4, col: 4 }
        ]
    },

    {
        type: "move",
        player: 2,
        from: { row: 5, col: 5 },
        to: { row: 4, col: 4 }
    },

    { type: "reset" },
];

const step2sequence = [

    { type: "place", player: 2, row: 5, col: 5 },

    {
        type: "showOptions",
        options: [
            { row: 4, col: 6 }, // forward-left
            { row: 4, col: 4 }  // forward-right
        ]
    },

    {
        type: "move",
        player: 2,
        from: { row: 5, col: 5 },
        to: { row: 4, col: 6 }
    },

    { type: "reset" },

    { type: "place", player: 2, row: 5, col: 5 },

    {
        type: "showOptions",
        options: [
            { row: 4, col: 6 },
            { row: 4, col: 4 }
        ]
    },

    {
        type: "move",
        player: 2,
        from: { row: 5, col: 5 },
        to: { row: 4, col: 4 }
    },

];

const step3sequence = [

   

    { type: "place", player: 2, row: 4, col: 0 },

    {
        type: "showOptions",
        options: [
            { row: 3, col: 1 }
        ]
    },

    {
        type: "move",
        player: 2,
        from: { row: 4, col: 0 },
        to: { row: 3, col: 1 }
    },

    { type: "reset" },

   

    { type: "place", player: 2, row: 5, col: 7 },

    {
        type: "showOptions",
        options: [
            { row: 4, col: 6 }
        ]
    },

    {
        type: "move",
        player: 2,
        from: { row: 5, col: 7 },
        to: { row: 4, col: 6 }
    }

];

const step4sequence = [

    { type: "place", player: 2, row: 5, col: 3 },

    // Both forward diagonals occupied
    { type: "place", player: 2, row: 4, col: 2 }, // own piece
    { type: "place", player: 1, row: 4, col: 4 }, // opponent piece

    {
        type: "blocked",
        piece: { row: 5, col: 3 },
        blockers: [
            { row: 4, col: 2 },
            { row: 4, col: 4 }
        ]
    },

    {type: 'reset'},



];

const stepSequences = {
    '1': step1sequence,
    '2': step2sequence,
    '3': step3sequence,
    '4': step4sequence
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

            tl.call (playWoodTap)
            break;

        case "move":
            tl.call(() => {
                boardState[action.from.row][action.from.col] = 0;
                boardState[action.to.row][action.to.col] = action.player;
                setBoard(boardState.map(row => [...row]));
            });

            tl.to({}, { duration: 0.05 }); // let React mount the piece at its new cell

            tl.call(() => {
                
                const target = pieceRefs.current[idx(action.to.row, action.to.col)];
                if (!target) return;
                gsap.fromTo(target,
                    { scale: 0.6, y: -14, opacity: 0.4 },
                    { scale: 1, y: 0, opacity: 1, duration: 0.1, ease: "back.out(1.7)" }
                );
            });

            tl.call(playWoodTap)
            break;

        case "invalidMove":
            tl.call(() => {
                const target = pieceRefs.current[idx(action.from.row, action.from.col)];
                if (!target) return;

                const nudgeY = action.to.row < action.from.row ? -8 : 8; // reach toward the attempted direction

                gsap.timeline()
                    .to(target, { y: nudgeY, duration: 0.1 })
                    .to(target, { y: 0, duration: 0.1 })
                    .to(target, {
                        boxShadow: "0 0 15px 4px rgba(255,40,40,0.85)",
                        duration: 0.15
                    }, 0)
                    .to(target, { boxShadow: "none", duration: 0.1 });
            });

            tl.to({}, { duration: 0.1 });
            tl.call(playError)
            break;


            case "invalidBackMove": {
    tl.call(() => {
        const targetPiece = pieceRefs.current[idx(action.from.row, action.from.col)];
        const targetCell = cellRefs.current[idx(action.to.row, action.to.col)];

        // Nudge piece backward
        if (targetPiece) {
            const nudgeY = action.to.row < action.from.row ? -8 : 8;
            gsap.timeline()
                .to(targetPiece, { y: nudgeY, duration: 0.3 })
                .to(targetPiece, { y: 0, duration: 0.3});
        }

        if (targetCell) {
            gsap.fromTo(
                targetCell,
                { boxShadow: "inset 0 0 0 4px rgba(255, 40, 40, 0.9)" },
                {
                    boxShadow: "inset 0 0 0 0px rgba(255, 40, 40, 0)",
                    duration: 0.5,
                    repeat: 2,
                    yoyo: true
                }
            );
        }
    });

    tl.to({}, { duration: 0.1 });
    tl.call (playError)
    break;
}

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

    tl.to({}, { duration: 0.1});
    tl.call (playHint)
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

case "showEdgeRestriction":
    tl.call(() => {
        // Show valid move(s)
        action.valid.forEach(({ row, col }) => {
            const cell = cellRefs.current[idx(row, col)];
            if (!cell) return;

            gsap.to(cell, {
                boxShadow: "inset 0 0 0 4px rgba(124,255,124,0.9)",
                duration: 0.3,
                repeat: 3,
                yoyo: true
            });
        });

        // Flash the current edge piece red to indicate
        // movement is restricted by the board boundary.
        const piece = pieceRefs.current[idx(action.edge.row, action.edge.col)];
        if (piece) {
            gsap.fromTo(
                piece,
                { boxShadow: "0 0 0 rgba(255,0,0,0)" },
                {
                    boxShadow: "0 0 16px rgba(255,60,60,0.9)",
                    duration: 0.3,
                    repeat: 3,
                    yoyo: true
                }
            );
        }
    });

    tl.to({}, { duration:0.1 });
    tl.call(playError)
    break;

case "blocked":
    tl.call(() => {

        const piece = pieceRefs.current[idx(action.piece.row, action.piece.col)];

        // Shake the blocked piece
        if (piece) {
            gsap.timeline()
                .to(piece, { x: -8, duration: 0.08 })
                .to(piece, { x: 8, duration: 0.08 })
                .to(piece, { x: -5, duration: 0.08 })
                .to(piece, { x: 5, duration: 0.08 })
                .to(piece, { x: 0, duration: 0.08 });
        }

        // Highlight both blocking pieces
        action.blockers.forEach(({ row, col }) => {
            const blocker = pieceRefs.current[idx(row, col)];
            if (!blocker) return;

            gsap.fromTo(
                blocker,
                {
                    boxShadow: "0 0 0 rgba(255,120,0,0)"
                },
                {
                    boxShadow: "0 0 18px rgba(255,120,0,0.9)",
                    duration: 0.3,
                    repeat: 3,
                    yoyo: true
                }
            );
        });

    });

    tl.to({}, { duration: 0.8 });
    tl.call(playError);
    break;

}

};

useEffect(() => {
    const currentSequence = stepSequences[steps[currentStep].step]
    if (!currentSequence) return;

    let boardState = createBoard();

    const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 2,
        onRepeat: () => {
            boardState = createBoard();
            setBoard(createBoard());
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
            <p>{nextLesson ? 'Next Lesson' : 'Next'}</p>
            <CornerDownRight /> 
        </button>

        <button onClick={PreviousLessonNavigation} className='absolute bottom-5 left-5 border-none p-3 text-xl rounded-lg cursor-pointer bg-gradient-to-br from-[#A47551] to-[#6B4226] text-[#F7E7CE] uppercase font-bold hover:scale-95 transition-smooth duration-300 flex items-center justify-center gap-3'> 
            <CornerDownLeft /> 
            <p>{previousLessonVariable ? 'Previous Lesson' : 'Previous'}</p>
        </button>

    
       <div className='absolute left-1/2 -translate-x-1/2 border-2 border-t-0 border-midGold rounded-br-lg rounded-bl-lg px-6 py-2 text-center bg-dark/90 text-darkgold shadow-midGold shadow-sm '>

            <div>
                <p className='uppercase text-3xl font-bold font-fingerpaint'>Making moves</p>
            </div>

            <div className='flex items-center justify-between'>
                <p className=' text-midGold'>Lesson 3</p>
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

export default DameLesson3