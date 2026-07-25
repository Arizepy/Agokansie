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
import { gsap } from 'gsap'

//Lesson sound 

import tipsOne from '../../../assets/sound/dame/tipsOne.m4a'
import tipsTwo from '../../../assets/sound/dame/tipsTwo.m4a'
import tipsThree from '../../../assets/sound/dame/tipsThreee.m4a'
import tipsFour from '../../../assets/sound/dame/tipsFOur.m4a'


export default  function DameLesson6(){

const woodTap = useRef(new Audio(woodTapSound))
const error = useRef(new  Audio(ErrorSound))
const hint = useRef (new Audio(showHint))
const victory = useRef(new Audio(Victory))
const voiceRef = useRef(new Audio());

const thinking = "..."

const playWoodTap = () => { 
    if (woodTap.current) { 
        woodTap.current.currentTime = 0; 
        woodTap.current.play();
    }
}

const playError = () => { 
    if (error.current) { 
        error.current.currentTime = 0; 
        error.current.play();
    }
}
const playHint = () => {
    if (hint.current) { 
        hint.current.currentTime =  0; 
        hint.current.play();
    }
}

const playVictory = ()  => {
    if (victory.current) { 
        victory.current.currentTime = 0; 
        victory.current.play()
    }
}

 const steps = [{
        step: '1',
        text: "Try to control the centre of the board. Centre positions provide more movement options and make it easier to launch attacks or defend your pieces.",
        voice: 'Foolish boy Siaw'

    },{
        step: '2',
        text: "Sometimes sacrificing a single piece can create an opportunity to capture several of your opponent's pieces. Use these tactical exchanges wisely. In this example, capturing is not compulsory.",
        voice: 'Foolish boy Siaw'

    },{
        step: '3',
        text: "Keep your back row protected whenever possible. It acts as your final line of defence and prevents your opponent from promoting their pieces too easily.",
        voice: 'Foolish boy Siaw'

    },{
        step: '4',
        text: "Always look several moves ahead. Planning your attacks while anticipating your opponent's responses is one of the best ways to become a stronger Dame player.",
        voice: 'Foolish boy Siaw'

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
        navigate('/damelesson7')
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
        navigate('/damelesson5')
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

const pieceRefs = useRef([])
const idx = (row, col) => row * 8 + col
const cellRefs = useRef([])

const step1sequence = [

   

    { type: "place", player: 2, row: 4, col: 0 }, // hugging the left edge

  
    {
        type: "showOptions",
        options: [
            { row: 3, col: 1 }
        ]
    },

    { type: "reset" },



    { type: "place", player: 2, row: 4, col: 4 }, // same row, pulled toward the centre


    {
        type: "showOptions",
        options: [
            { row: 3, col: 3 },
            { row: 3, col: 5 }
        ]
    },

];

const step2sequence = [

   
    { type: "place", player: 1, row: 3, col: 3 }, // B1
    { type: "place", player: 1, row: 3, col: 5 }, // B2

    { type: "place", player: 2, row: 6, col: 6 }, // U1 — will do the multi-capture
    { type: "place", player: 2, row: 5, col: 3 }, // S — about to be sacrificed

    { type: "showSacrifice", position: { row: 5, col: 3 } },

    { type: "move", player: 2, from: { row: 5, col: 3 }, to: { row: 4, col: 4 } },

    { type: "showCapture", capture: { row: 4, col: 4 }, landing: { row: 5, col: 5 } },

    { type: "capture", player: 1, from: { row: 3, col: 3 }, captured: { row: 4, col: 4 }, to: { row: 5, col: 5 } },

    { type: "showCapture", capture: { row: 5, col: 5 }, landing: { row: 4, col: 4 } },

    {
        type: "multiCapture",
        player: 2,
        from: { row: 6, col: 6 },
        jumps: [
            { captured: { row: 5, col: 5 }, to: { row: 4, col: 4 } },
            { captured: { row: 3, col: 5 }, to: { row: 2, col: 6 } }
        ]
    },

];

const step3sequence = [

 

    { type: "place", player: 1, row: 6, col: 0 }, // black, hugging the edge — only one forward option

  
    { type: "showOptions", options: [{ row: 7, col: 1 }] },

    { type: "move", player: 1, from: { row: 6, col: 0 }, to: { row: 7, col: 1 } },

    { type: "promote", row: 7, col: 1, player: 1 },

    { type: "reset" },


   

    { type: "place", player: 1, row: 6, col: 0 }, // same black piece, same starting square
    { type: "place", player: 2, row: 7, col: 1 }, // user keeps the back row occupied

    { type: "showOptions", options: [{ row: 7, col: 1 }] },

    {
        type: "invalidMove",
        player: 1,
        from: { row: 6, col: 0 },
        to: { row: 7, col: 1 },
        reason: "occupied"
    },

    { type: "showBlock", position: { row: 7, col: 1 } },

];

const step4sequence = [

    { type: "showPlan", position: { row: 0, col: 0 } },

    { type: "place", player: 2, row: 6, col: 6 }, // R2 — the piece this whole plan is for
    { type: "place", player: 1, row: 3, col: 3 }, // opponent piece, currently guarding R2's diagonal
    { type: "place", player: 2, row: 5, col: 1 }, // R1 — decoy, unrelated-looking position

    { type: "showSacrifice", position: { row: 5, col: 1 } },

    { type: "move", player: 2, from: { row: 5, col: 1 }, to: { row: 4, col: 2 } },

    { type: "showCapture", capture: { row: 4, col: 2 }, landing: { row: 5, col: 1 } },

    { type: "capture", player: 1, from: { row: 3, col: 3 }, captured: { row: 4, col: 2 }, to: { row: 5, col: 1 } },

   
    { type: "move", player: 2, from: { row: 6, col: 6 }, to: { row: 5, col: 5 } },
    { type: "move", player: 2, from: { row: 5, col: 5 }, to: { row: 4, col: 4 } },
    { type: "move", player: 2, from: { row: 4, col: 4 }, to: { row: 3, col: 3 } },
    { type: "move", player: 2, from: { row: 3, col: 3 }, to: { row: 2, col: 2 } },
    { type: "move", player: 2, from: { row: 2, col: 2 }, to: { row: 1, col: 1 } },
    { type: "move", player: 2, from: { row: 1, col: 1 }, to: { row: 0, col: 0 } },

    { type: "promote", row: 0, col: 0, player: 2 },

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

    tl.to({}, { duration: 0.8});

    tl.call(playHint)
    break;

case "promote":

tl.call(() => {
        const newBoard = boardState.map(row => [...row]);
        newBoard[action.row][action.col] = action.player === 1 ? 3 : 4; // black -> 3, red -> 4
        setBoard(newBoard);
    });


tl.to({}, {
    duration:0.5   // give React time
});


tl.call(() => {

    const piece =
    pieceRefs.current[idx(action.row, action.col)];


    if(!piece) return;


    gsap.timeline()
    .to(piece,{
        scale:1.4,
        duration:0.3,
        ease:"back.out(2)"
    })
    .to(piece,{
        boxShadow:"0 0 25px 8px rgba(255,215,0,0.9)",
        duration:0.5
    })
    .to(piece,{
        scale:1,
        duration:0.1
    });
});
tl.call (playVictory)

break;

case "showPlan":
    tl.call(() => {
        const cell = cellRefs.current[idx(action.position.row, action.position.col)];
        if (!cell) return;
        gsap.to(cell, {
            boxShadow: "inset 0 0 0 4px rgba(255,215,0,0.9)",
            duration: 0.4,
            yoyo: true,
            repeat: 4
        });
    });

    tl.to({}, { duration: 0.9 }); 
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

case "showCapture":
    tl.call(() => {
        const target = pieceRefs.current[idx(action.capture.row, action.capture.col)];
        if (target) {
            gsap.to(target, {
                boxShadow: "0 0 20px 6px rgba(255,40,40,0.9)", // red = "this is what's at risk"
                duration: 0.35,
                yoyo: true,
                repeat: 3
            });
        }

        const landing = cellRefs.current[idx(action.landing.row, action.landing.col)];
        if (landing) {
            gsap.to(landing, {
                boxShadow: "inset 0 0 0 4px rgba(56,189,248,0.9)", // blue = "this is where it'll land"
                duration: 0.35,
                yoyo: true,
                repeat: 3
            });
        }
    });

    tl.to({}, { duration: 0.1 });

    tl.call (playError)
    break;

case "capture":
   
    tl.call(() => {
        const captured = pieceRefs.current[idx(action.captured.row, action.captured.col)];
        if (captured) {
            gsap.to(captured, { scale: 0, opacity: 0, duration: 0.3, ease: "back.in(2)" });
        }
    });

    tl.to({}, { duration: 0.35 }); // let the fade finish before the board updates

    tl.call(() => {
        boardState[action.from.row][action.from.col] = 0;
        boardState[action.captured.row][action.captured.col] = 0; // captured piece removed
        boardState[action.to.row][action.to.col] = action.player;
        setBoard(boardState.map(row => [...row]));
    });

    tl.to({}, { duration: 0.05 }); // let React mount the king at the landing square

    tl.call(() => {
        const king = pieceRefs.current[idx(action.to.row, action.to.col)];
        if (!king) return;
        gsap.fromTo(king,
            { scale: 0.5, opacity: 0.3 },
            { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.7)" }
        );
        gsap.to(king, {
            boxShadow: "0 0 20px 6px rgba(255,215,0,0.9)", // gold flash — the flying capture landing
            duration: 0.4,
            yoyo: true,
            repeat: 1
        });
    });

    tl.to({}, { duration: 0.1 });

    tl.call(playError)
    break;

    case "showBlock":
    tl.call(() => {
        const target = pieceRefs.current[idx(action.position.row, action.position.col)];
        if (!target) return;
        gsap.to(target, {
            boxShadow: "0 0 20px 6px rgba(56,189,248,0.9)",
            duration: 0.3,
            yoyo: true,
            repeat: 3
        });
    });

    tl.to({}, { duration: 0.2 });
    tl.call(playHint)
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
    tl.to({}, { duration: 0.3 });

    tl.call(playHint)
    break;

case "multiCapture":
    tl.call(() => {
        boardState[action.from.row][action.from.col] = 0;
    });

    let current = { row: action.from.row, col: action.from.col }; // tracks the piece's live position through the chain

    action.jumps.forEach((jump, i) => {

        tl.call(() => {
            const captured = pieceRefs.current[idx(jump.captured.row, jump.captured.col)];
            if (captured) {
                gsap.to(captured, { scale: 0, opacity: 0, duration: 0.3, ease: "back.in(2)" });
            }
        });

        tl.to({}, { duration: 0.35 });

        tl.call(() => {
            boardState[current.row][current.col] = 0; // clear wherever it currently sits — this is the fix
            boardState[jump.captured.row][jump.captured.col] = 0;
            boardState[jump.to.row][jump.to.col] = action.player;
            setBoard(boardState.map(row => [...row]));
            current = { row: jump.to.row, col: jump.to.col }; // update for the next leg
        });

        tl.to({}, { duration: 0.05 });

        tl.call(() => {
            const piece = pieceRefs.current[idx(jump.to.row, jump.to.col)];
            if (!piece) return;
            gsap.fromTo(piece,
                { scale: 0.5, opacity: 0.3 },
                { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
            );
        });

        if (i < action.jumps.length - 1) {
            tl.to({}, { duration: 0.6 });
        }
    });

    tl.to({}, { duration: 0.1 });
    tl.call(playVictory)
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
            <p>{nextLesson ? 'Next Lesson' : 'Next'}</p>
            <CornerDownRight /> 
        </button>

        <button onClick={PreviousLessonNavigation} className='absolute bottom-5 left-5 border-none p-3 text-xl rounded-lg cursor-pointer bg-gradient-to-br from-[#A47551] to-[#6B4226] text-[#F7E7CE] uppercase font-bold hover:scale-95 transition-smooth duration-300 flex items-center justify-center gap-3'> 
            <CornerDownLeft /> 
            <p>{previousLessonVariable ? 'Previous Lesson' : 'Previous'}</p>
        </button>

    
       <div className='absolute left-1/2 -translate-x-1/2 border-2 border-t-0 border-midGold rounded-br-lg rounded-bl-lg px-6 py-2 text-center bg-dark/90 text-darkgold shadow-midGold shadow-sm '>

            <div>
                <p className='uppercase text-3xl font-bold font-fingerpaint'>Tips and strategy</p>
            </div>

            <div className='flex items-center justify-between'>
                <p className=' text-midGold'>Lesson 6</p>
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
