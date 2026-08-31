import { useContext, useState, useRef, useEffect, } from 'react'
import { useLanguage } from '../../../context/languageContext'
import PageWrapper from '../../../WelcomeScreen/PageWrapper'
import bg from '../../../assets/background-collage.png'
import thinking_image  from '../../../assets/black_man_thinking.webp'
import { ArrowRight, ArrowLeft, CornerDownLeft, CornerDownRight, House} from 'lucide-react'
import { useNavigate } from "react-router-dom";
import woodTapSound from '../../../assets/sound/woodTap.mp3'
import ErrorSound from '../../../assets/sound/error.mp3'
import blockedAudio from '../../../assets/sound/blocked.mp3'
import VictorySound from '../../../assets/sound/victory.mp3'
import { gsap } from 'gsap'

//Lesson sound
import moveOne from '../../../assets/sound/achi/movesOne.m4a'
import moveTwo from '../../../assets/sound/achi/movesTwo.m4a'
import moveThree from '../../../assets/sound/achi/movesThree.m4a'
import moveFour from '../../../assets/sound/achi/movesFour.m4a'
import engMoveOne from '../../../assets/sound/achi/AchiLessonFourStepOne.mp3'
import engMoveTwo from '../../../assets/sound/achi/AchiLessonFourStepTwo.mp3'
import engMoveThree from '../../../assets/sound/achi/AchiLessonFourStepThree.mp3'
import engMoveFour from '../../../assets/sound/achi/AchiLessonFourStepFour.mp3'



function AchiLesson4(){

const woodTap = useRef(new Audio(woodTapSound))
const error = useRef(new Audio(ErrorSound))
const blocked = useRef(new Audio(blockedAudio))
const victory = useRef(new Audio(VictorySound))
const voiceRef = useRef(new Audio());
const {language} = useLanguage()

const thinking = "..."

const playWoodTap = () => { 
    if (woodTap.current) { 
        woodTap.current.currentTime = 0; 
        woodTap.current.play()
    }
}


const steps = [{
    step: '1',
    text: "Once all pieces have been placed, players continue taking turns moving one piece at a time.",
    voice: language === 'english' ? engMoveOne : moveOone

},{
    step: '2',
    text: "A piece may only move along the connecting lines to an adjacent empty point. Pieces cannot jump over other pieces or move into occupied spaces.",
    voice: language === 'english' ? engMoveTwo :moveTwo

},{
    step: '3',
    text: "A piece that is completely surrounded by other pieces and has no adjacent empty spaces is blocked and cannot be moved until a space becomes available.",
    voice: language === 'english' ? engMoveThree : moveThree

},{
    step: '4',
    text: "Players continue moving their pieces until one player successfully forms a straight line of three pieces.",
    voice: language === 'english' ? engMoveFour : moveFour

} ]


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
    playWoodTap()
    if (nextLesson){
        navigate('/achilesson5')
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
        navigate('/achilesson3')
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
    { top: "0%", left: "0%" },      // 0
    { top: "0%", left: "50%" },     // 1
    { top: "0%", left: "100%" },    // 2

    { top: "50%", left: "0%" },     // 3
    { top: "50%", left: "50%" },    // 4
    { top: "50%", left: "100%" },   // 5

    { top: "100%", left: "0%" },    // 6
    { top: "100%", left: "50%" },   // 7
    { top: "100%", left: "100%" },  // 8
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

    const animateWin = useRef([])
    const pieceRefs = useRef([])

const step1sequence = [

{
    type: "place",
    player: 1,
    position: 0
},

{
    type: "place",
    player: 2,
    position: 4
},

{
    type: "place",
    player: 1,
    position: 2
},

{
    type: "place",
    player: 2,
    position: 6
},

{
    type: "place",
    player: 1,
    position: 8
},

{
    type: "place",
    player: 2,
    position: 1
},


{
    type:"move",
    player:2,
    from:4,
    to:5
},


{
    type:"move",
    player:1,
    from:8,
    to:7
},


{
    type:"move",
    player:2,
    from:6,
    to:3
},


];

const step2sequence = [



{ type: "place", player: 1, position: 0 },
{ type: "place", player: 2, position: 1 },
{ type: "place", player: 1, position: 3 },
{ type: "place", player: 2, position: 4 },
{ type: "place", player: 1, position: 8 },
{ type: "place", player: 2, position: 7 },


{
    type: "invalidMove",
    player: 1,
    from: 0,
    to: 2,
    reason: "notAdjacent"
},


{
    type: "invalidMove",
    player: 1,
    from: 3,
    to: 4,
    reason: "occupied"
},

{
    type: "move",
    player: 1,
    from: 3,
    to: 6
},

{
    type: "invalidMove",
    player: 2,
    from: 7,
    to: 6,
    reason: "occupied"
},

{
    type: "move",
    player: 2,
    from: 1,
    to: 2
},

];

const step3sequence = [


{ type: "place", player: 1, position: 0 }, // this piece will end up trapped
{ type: "place", player: 2, position: 1 },
{ type: "place", player: 1, position: 5 },
{ type: "place", player: 2, position: 3 },
{ type: "place", player: 1, position: 8 },
{ type: "place", player: 2, position: 4 },


{
    type: "blocked",
    player: 1,
    position: 0,
    blockedBy: [1, 3, 4]
},


{
    type: "move",
    player: 2,
    from: 4,
    to: 7
},

{
    type: "move",
    player: 1,
    from: 0,
    to: 4
},

];

const step4sequence = [

{ type: "place", player: 1, position: 0 },
{ type: "place", player: 2, position: 1 },
{ type: "place", player: 1, position: 2 },
{ type: "place", player: 2, position: 3 },
{ type: "place", player: 1, position: 5 },
{ type: "place", player: 2, position: 8 },


{ type: "move", player: 2, from: 8, to: 7 },

{ type: "move", player: 1, from: 0, to: 4 },

{ type: "move", player: 2, from: 3, to: 6 },

{ type: "move", player: 1, from: 4, to: 8 },

{
    type: "win",
    player: 1,
    lines: [10, 11]
},

];

const runAction = (tl, action, boardState)=>{


switch(action.type){



case "place":
    tl.call(() => {
        boardState[action.position] = action.player;
        setBoard([...boardState]);
    });

    tl.to({}, { duration: 0.05 }); // give React a tick to render the new node

    tl.call(() => {
        const target = pieceRefs.current[action.position];
        if (!target) return; // safety guard
        gsap.fromTo(target,
            { scale:0, y:-40, opacity:0 },
            { scale:1, y:0, opacity:1, duration:0.4, ease:"back.out(2)" }
        );
    });
    tl.call (() => { 
        if (woodTap.current){ 
            woodTap.current.currentTime = 0; 
            woodTap.current.play()
        }
    })


    break;



case "move":

    tl.call(()=>{
        boardState[action.from]=0;

        boardState[action.to] =
        action.player;
        setBoard([...boardState]);

    });
    tl.call (() => { 
        if (woodTap.current){ 
            woodTap.current.currentTime = 0; 
            woodTap.current.play()
        }
    })

    tl.to ({}, {duration: 0.2})



break;

case "invalidMove":

    tl.call(() => {
        const target = pieceRefs.current[action.from];
        if (!target) return; // safety guard

        gsap.timeline()
            .to(target, {
                boxShadow: "0 0 20px 6px rgba(255,40,40,0.85)",
                borderColor: "#FF4040",
                duration: 0.15
            })
            .to(target, {
                scale: 1.15,
                duration: 0.12,
                yoyo: true,
                repeat: 1
            }, 0)
            .to(target, {
                boxShadow: "none",
                borderColor: "",
                scale: 1,
                duration: 0.3
            });
    });

    tl.to({}, { duration: 0.7 }); // hold so the rejection registers

    tl.call (() =>{ 
        if (error.current) { 
            error.current.currentTime = 0; 
            error.current.play();
        }
    })
    tl.to ({}, {duration: 0.1})

    break;

    case "blocked":

        tl.call(() => {
            const target = pieceRefs.current[action.position];
            if (!target) return; // safety guard

            // the trapped piece pulses in place — it's straining, going nowhere
            gsap.timeline()
                .to(target, { scale: 1.1, duration: 0.15, yoyo: true, repeat: 3 })
                .to(target, { scale: 1, duration: 0.15 });

            // call out each occupied neighbor that's boxing it in
            (action.blockedBy || []).forEach(pos => {
                const neighbor = pieceRefs.current[pos];
                if (!neighbor) return;

                gsap.to(neighbor, {
                    boxShadow: "0 0 15px 4px rgba(255,180,0,0.8)",
                    duration: 0.3,
                    yoyo: true,
                    repeat: 3
                });
            });
        });

        tl.to({}, { duration: 0.8 }); // let it sit so "trapped" actually reads

        tl.call (() => {
            if (blocked .current) { 
                blocked.current.currentTime = 0 ;
                blocked.current.play();
            }
        })
    break;  

    case "win":

        tl.call(() => {
            winAnimation(action.lines);
        });

        tl.to({}, { duration: 0.8});

        tl.call(() => {
        if(victory.current){
            victory.current.currentTime = 0; 
            victory.current.play()
        }})

        tl.to({}, {duration: 0.2});

        break;

    

}




};


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


const stepSequences = {
    
    '1': step1sequence,
    '2': step2sequence,
    '3': step3sequence,
    '4': step4sequence
}

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
                <p className=' text-midGold'>Lesson 4</p>
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

export default AchiLesson4