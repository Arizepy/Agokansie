import { useContext, useState, useRef, useEffect, } from 'react'
import PageWrapper from '../../../WelcomeScreen/PageWrapper'
import bg from '../../../assets/background-collage.png'
import thinking_image  from '../../../assets/black_man_thinking.webp'
import { ArrowRight, ArrowLeft, CornerDownLeft, CornerDownRight, House} from 'lucide-react'
import { useNavigate } from "react-router-dom";
import woodTapSound from '../../../assets/sound/woodTap.mp3'
import victorySound from '../../../assets/sound/victory.mp3'
import HightLight from '../../../assets/sound/blocked.mp3'
import { gsap } from 'gsap'

//Lesson sound 
import tipsOne from '../../../assets/sound/achi/tipsOne.m4a'
import tipsTwo from '../../../assets/sound/achi/tipsTwo.m4a'
import tipsThree from '../../../assets/sound/achi/tipsThree.m4a'
import tipsFour from '../../../assets/sound/achi/tipsFour.m4a'



function AchiLesson6(){

const woodTap = useRef(new Audio(woodTapSound))
const victory = useRef(new Audio(victorySound))
const highlight = useRef( new Audio (HightLight))
const voiceRef = useRef(new Audio());

const thinking = "..."

const PlayWoodTap = () => { 
    if (woodTap.current) { 
        woodTap.current.currentTime = 0; 
        woodTap.current.volume = 0.1;
        woodTap.current.play()
    }
}

const playHighlight = () => { 
    if (highlight.current) {
        highlight.current.currentTime = 0; 
        highlight.current.volume = 0.1;
        highlight.current.play()
    }
}

const playVictory = () => {
    if(victory.current) { 
        victory.current.currentTime = 0; 
        victory.current.volume = 0.1;
        victory.current.play()
    }
 }

const steps = [{
    step: '1',
    text: "Try to control the centre position whenever possible. A piece placed in the centre has the greatest number of movement options and offers more flexibility.",
    voice: tipsOne

},{
    step: '2',
    text: "Look for opportunities to create multiple winning threats at the same time. This forces your opponent to defend against more than one possible line.",
    voice: tipsTwo

},{
    step: '3',
    text: "Building a V-shaped formation with an empty centre can often create an unavoidable winning opportunity if your opponent is not careful.",
    voice: tipsThree

},{
    step: '4',
    text: "Always pay attention to your opponent's next move. Blocking a potential winning line is often just as important as creating one of your own.",
    voice: tipsFour

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
        PlayWoodTap
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
        PlayWoodTap()
        if (previousLessonVariable){
            navigate('/achilesson5')
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


//Board setup
const getBoardState = () => {
    console.log('i have played')    
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
    { top: "0%", left: "0%" },     
    { top: "0%", left: "50%" },     
    { top: "0%", left: "100%" },  

    { top: "50%", left: "0%" },     
    { top: "50%", left: "50%" },  
    { top: "50%", left: "100%" },   

    { top: "100%", left: "0%" },   
    { top: "100%", left: "50%" },  
    { top: "100%", left: "100%" }, 
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



const nodeRefs = useRef([])
const animateWin = useRef([])
const pieceRefs = useRef([])

const step1sequence = [

  

    { type: "place", player: 1, position: 0 },

    {
        type: "showOptions",
        position: 0,
        options: [1, 3, 4]
    },

    { type: "reset" },


    { type: "place", player: 1, position: 4 },

  
    {
        type: "showOptions",
        position: 4,
        options: [0, 1, 2, 3, 5, 6, 7, 8]
    },

    { type: "reset" },

];

const step2sequence = [

   

    { type: "place", player: 1, position: 0 },
    { type: "place", player: 2, position: 2 },
    { type: "place", player: 1, position: 4 },
    { type: "place", player: 2, position: 3 },
    { type: "place", player: 1, position: 6 },
    { type: "place", player: 2, position: 5 },


 

  
    {
        type: "move",
        player: 1,
        from: 6,
        to: 7
    },

    {
        type: "showThreats",
        lines: [12, 13, 8, 9] // 0-4-8 and 1-4-7
    },

    {
        type: "move",
        player: 2,
        from: 5,
        to: 8
    },

    
    {
        type: "move",
        player: 1,
        from: 0,
        to: 1
    },

    {
        type: "win",
        player: 1,
        lines: [8, 9]
    },

];

const step3sequence = [

   
    { type: "place", player: 1, position: 1 },
    { type: "place", player: 2, position: 0 },
    { type: "place", player: 1, position: 5 },
    { type: "place", player: 2, position: 2 },
    { type: "place", player: 1, position: 6 }, // spare — not part of the V yet
    { type: "place", player: 2, position: 8 },


   
    {
        type: "move",
        player: 1,
        from: 6,
        to: 3
    },

    {
        type: "showThreats",
        lines: [2, 3] // 3-4 and 4-5
    },

    {
        type: "move",
        player: 2,
        from: 8,
        to: 7
    },

   
    {
        type: "move",
        player: 1,
        from: 1,
        to: 4
    },

   
    {
        type: "win",
        player: 1,
        lines: [2, 3]
    },

];

const step4sequence = [


    { type: "place", player: 1, position: 3 },
    { type: "place", player: 2, position: 0 },
    { type: "place", player: 1, position: 4 },
    { type: "place", player: 2, position: 1 },
    { type: "place", player: 1, position: 8 },
    { type: "place", player: 2, position: 5 },


   
    {
        type: "showThreats",
        lines: [0, 1] // 0-1 and 1-2
    },

    
    {
        type: "move",
        player: 1,
        from: 4,
        to: 2
    },

    
    {
        type: "showBlock",
        position: 2
    },

];

const stepSequences = {
    '1': step1sequence,
    '2': step2sequence,
    '3': step3sequence,
    '4': step4sequence
}


const runAction = (tl, action, boardState)=>{

switch(action.type){

case "place":
    tl.call(() => {
        boardState[action.position] = action.player;
        setBoard([...boardState]);
    });

    tl.to({}, { duration: 0.05 }); 

    tl.call(() => {
        const target = pieceRefs.current[action.position];
        if (!target) return; // safety guard
        gsap.fromTo(target,
            { scale:0, y:-40, opacity:0 },
            { scale:1, y:0, opacity:1, duration:0.4, ease:"back.out(2)" }
        );
    });

    tl.call(PlayWoodTap)
    break;                                                                      

case "move":

    tl.call(()=>{


        boardState[action.from]=0;

        boardState[action.to]
        =
        action.player;


        setBoard([...boardState]);


    });

    tl.call(PlayWoodTap)

break; 

case "showOptions":

    tl.call(() => {
        (action.options || []).forEach(pos => {
            const node = nodeRefs.current[pos];
            if (!node) return; 
            gsap.to(node, {
                scale: 1.8,
                backgroundColor: "#7CFF7C",
                boxShadow: "0 0 15px 4px rgba(124,255,124,0.9)",
                duration: 0.3,
                delay: pos * 0.03,
                yoyo: true,
                repeat: 3
            });
        });
    });

    tl.to({}, { duration: 0.4 }); 
    tl.call(playHighlight)

    break;

case "showThreats":

    tl.call(() => {
        (action.lines || []).forEach(index => {
            const line = animateWin.current[index];
            if (!line) return;

            gsap.to(line, {
                backgroundColor: "#FFB020",
                boxShadow: "0 0 15px 4px rgba(255,176,32,0.8)",
                duration: 0.4,
                yoyo: true,
                repeat: 3
            });
        });
    });

    tl.to({}, { duration: 0.8 }); 

    tl.call( playHighlight)

    break;

case "win":

    tl.call(() => {
        winAnimation(action.lines);
    });

    tl.to({}, { duration: 0.3 });

    tl.call(playVictory)

    break;

case "showBlock":

    tl.call(() => {
        const target = pieceRefs.current[action.position];
        if (!target) return; // safety guard

        gsap.to(target, {
            boxShadow: "0 0 20px 6px rgba(56,189,248,0.9)",
            duration: 0.3,
            yoyo: true,
            repeat: 3
        });
    });

    tl.to({}, { duration: 0.4 });
    tl.call(playHighlight)

    break;
}}

const winAnimation=(lines)=>{


lines.forEach(index=>{


gsap.to(
animateWin.current[index],

{

backgroundColor:"#7CFF7C",

boxShadow:
`
0 0 20px #00FF66,
0 0 40px #00FF66
`,

repeat:-1,

yoyo:true,

duration:0.5

}

);


});


};

useEffect(()=>{
const currentSequence = stepSequences[steps[currentStep].step]

if (!currentSequence) return;

    let boardState=createBoard();

        const tl = gsap.timeline({

        repeat:-1,

        repeatDelay:2,


        onRepeat:()=>{

        const fresh = createBoard();
        boardState.splice(0, boardState.length, ...fresh); // mutate in place
        setBoard([...boardState]);
         resetWin();


        }

        });


        currentSequence.forEach(action=>{


        runAction(
            tl,
            action,
            boardState
        );


        tl.to({},{
        duration:1
        });


        });


        return ()=>{

        tl.kill();
        resetWin()
        setBoard(createBoard());

        };


},[currentStep]);

const resetWin = () => {

    animateWin.current.forEach(line => {

        if (!line) return;

        gsap.killTweensOf(line);

        gsap.set(line, {
            backgroundColor: "",
            boxShadow: "none",
            opacity: 1,
            scaleX: 1
        });

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
                <p className='uppercase text-3xl font-bold font-fingerpaint'>Tips and strategies</p>
            </div>

            <div className='flex items-center justify-between'>
                <p className=' text-midGold'>Lesson 6</p>
                <p className='text-midGold'>{`Step ${steps[currentStep].step}`}</p>
            </div>
            
        </div>

          <div className='absolute inset-0 flex items-center justify-center mt-35 -z-1 scale-80'>
            <div className='border-3 p-18 rounded-lg border-dark bg-dark/70'>

            <div className="relative w-[450px] h-[450px] bg-radial from-gold via-wood1 to-dark ">

                {/* Lines */}
                {LINES.map(([start, end], index) => (
                    <div
                        key={index}
                        ref={(el) => (animateWin.current[index] = el)}
                        className="absolute h-1 bg-darkgold"
                        style={getLineStyle(start, end)}
                    />
                ))}

                {/* Nodes */}
                {POSITIONS.map((position, index) => (
                    <div
                        key={index}
                        ref = {(el) => (nodeRefs.current[index] = el)}
                        className="absolute size-4 z-10 rounded-full bg-darkgold -translate-x-1/2 -translate-y-1/2"
                        style={position}
                    />
                ))}

                {/* Pieces */}
                {board.map((square, index) =>
                    square !== 0 && (
                        <div
                            key={index}
                            ref = {(el) => (pieceRefs.current[index] = el)}
                            className={`absolute z-20 size-14 rounded-full border-2 border-gold
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
</PageWrapper>


)
}

export default AchiLesson6