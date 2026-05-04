const canvas = document.getElementById("canvas");
const picker = document.getElementById("colorPicker");

const brushBtn = document.getElementById("brushBtn");
const eraserBtn = document.getElementById("eraserBtn");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");

let drawing = false;
let currentColor = picker.value;
let eraseMode = false;

// create 32x32 grid
for(let i=0;i<1024;i++){
    let pixel = document.createElement("div");
    pixel.classList.add("pixel");
    canvas.appendChild(pixel);
}

// update color
picker.addEventListener("input",()=>{
    currentColor = picker.value;
    eraseMode = false;
});

// brush
brushBtn.addEventListener("click",()=>{
    eraseMode = false;
});

// eraser
eraserBtn.addEventListener("click",()=>{
    eraseMode = true;
});

// draw
function paint(pixel){
    pixel.style.background =
        eraseMode ? "white" : currentColor;
}

canvas.addEventListener("mousedown",()=>{
    drawing = true;
});

document.addEventListener("mouseup",()=>{
    drawing = false;
});

canvas.addEventListener("mouseover",(e)=>{
    if(drawing && e.target.classList.contains("pixel")){
        paint(e.target);
    }
});

canvas.addEventListener("click",(e)=>{
    if(e.target.classList.contains("pixel")){
        paint(e.target);
    }
});

// mobile touch
canvas.addEventListener("touchmove",(e)=>{
    const touch = document.elementFromPoint(
        e.touches[0].clientX,
        e.touches[0].clientY
    );

    if(touch && touch.classList.contains("pixel")){
        paint(touch);
    }
});

// clear
clearBtn.addEventListener("click",()=>{
    document.querySelectorAll(".pixel").forEach(pixel=>{
        pixel.style.background = "white";
    });
});

// save
saveBtn.addEventListener("click",()=>{
    alert("Screenshot it to save on mobile.\nDesktop: use snipping tool.");
});
