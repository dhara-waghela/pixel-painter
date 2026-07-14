const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");
const picker = document.getElementById("colorPicker");

const brushBtn = document.getElementById("brushBtn");
const eraserBtn = document.getElementById("eraserBtn");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");

const GRID_SIZE = 32;
const CANVAS_RESOLUTION = 1024;
const CELL_SIZE = CANVAS_RESOLUTION / GRID_SIZE; // 32 units per cell

let drawing = false;
let currentColor = picker.value;
let eraseMode = false;

// Track cell colors dynamically in an array matrix
let gridData = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill("white"));

function drawCanvas() {
    ctx.clearRect(0, 0, CANVAS_RESOLUTION, CANVAS_RESOLUTION);

    // 1. Render cells
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            ctx.fillStyle = gridData[r][c];
            ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }

    // 2. Draw ultra-light inner grid borders
    ctx.strokeStyle = "rgba(0, 0, 0, 0.05)"; 
    ctx.lineWidth = 1;
    
    for (let i = 1; i < GRID_SIZE; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, CANVAS_RESOLUTION);
        ctx.stroke();

        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(CANVAS_RESOLUTION, i * CELL_SIZE);
        ctx.stroke();
    }
}

// Draw the blank canvas at runtime
drawCanvas();

picker.addEventListener("input", () => {
    currentColor = picker.value;
    eraseMode = false;
});

brushBtn.addEventListener("click", () => { eraseMode = false; });
eraserBtn.addEventListener("click", () => { eraseMode = true; });

// Main painter engine
function paintAtPoint(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    
    // Scale coordinate differences between matching system view rules
    const x = ((clientX - rect.left) / rect.width) * CANVAS_RESOLUTION;
    const y = ((clientY - rect.top) / rect.height) * CANVAS_RESOLUTION;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    if (col >= 0 && col < GRID_SIZE && row >= 0 && row < GRID_SIZE) {
        gridData[row][col] = eraseMode ? "white" : currentColor;
        drawCanvas();
    }
}

// Desktop Mouse Logic
canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    paintAtPoint(e.clientX, e.clientY);
});

canvas.addEventListener("mousemove", (e) => {
    if (drawing) paintAtPoint(e.clientX, e.clientY);
});

window.addEventListener("mouseup", () => {
    drawing = false;
});

// Mobile Touch Logic (Prevents page scrolling while painting)
canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    drawing = true;
    if (e.touches.length > 0) {
        paintAtPoint(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: false });

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (drawing && e.touches.length > 0) {
        paintAtPoint(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: false });

window.addEventListener("touchend", () => {
    drawing = false;
});

// Clear tool logic
clearBtn.addEventListener("click", () => {
    gridData = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill("white"));
    drawCanvas();
});

// Image Save logic (Clean 1024x1024 export without grid lines)
saveBtn.addEventListener("click", () => {
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = CANVAS_RESOLUTION;
    exportCanvas.height = CANVAS_RESOLUTION;
    const exportCtx = exportCanvas.getContext("2d");

    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            exportCtx.fillStyle = gridData[r][c];
            exportCtx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }

    const dataUrl = exportCanvas.toDataURL("image/jpg");
    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);

    if (isMobile) {
        // Safe cross-origin tab opening workaround for iOS Safari/Android Chrome
        const newWindow = window.open();
        if (newWindow) {
            newWindow.document.write(`
                <body style="margin:0; background:#0f172a; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; color:white; font-family:sans-serif;">
                    <p style="margin-bottom:15px; font-size:18px;">Hold down the image to save to your photos</p>
                    <img src="${dataUrl}" style="width:90vw; max-width:500px; border:4px solid white; box-shadow:0 10px 25px rgba(0,0,0,0.5);" alt="Pixel Art"/>
                </body>
            `);
            newWindow.document.title = "Save your Art!";
        } else {
            alert("Pop-up blocked! Please allow popups to save art on mobile.");
        }
    } else {
        const downloadLink = document.createElement("a");
        downloadLink.href = dataUrl;
        downloadLink.download = "pixel-art.jpg";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
});
