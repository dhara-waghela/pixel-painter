const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");
const picker = document.getElementById("colorPicker");

const brushBtn = document.getElementById("brushBtn");
const eraserBtn = document.getElementById("eraserBtn");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");

const GRID_SIZE = 32;
const CANVAS_RESOLUTION = 1024;
const CELL_SIZE = CANVAS_RESOLUTION / GRID_SIZE; // Each pixel cell is 32x32 canvas units

let drawing = false;
let currentColor = picker.value;
let eraseMode = false;

// Initialize grid data structures tracking colors
let gridData = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill("white"));

function drawCanvas() {
    ctx.clearRect(0, 0, CANVAS_RESOLUTION, CANVAS_RESOLUTION);

    // 1. Draw painted pixel cells
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            ctx.fillStyle = gridData[r][c];
            ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }

    // 2. Draw ultra-light inner grid borders
    ctx.strokeStyle = "rgba(0, 0, 0, 0.05)"; // Super faint border line
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

// Initial draw sequence
drawCanvas();

// Sync chosen drawing colors
picker.addEventListener("input", () => {
    currentColor = picker.value;
    eraseMode = false;
});

brushBtn.addEventListener("click", () => { eraseMode = false; });
eraserBtn.addEventListener("click", () => { eraseMode = true; });

// Translate screen coordinates to 32x32 grid indexes
function handleDrawEvent(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_RESOLUTION / rect.width;
    const scaleY = CANVAS_RESOLUTION / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    if (col >= 0 && col < GRID_SIZE && row >= 0 && row < GRID_SIZE) {
        gridData[row][col] = eraseMode ? "white" : currentColor;
        drawCanvas();
    }
}

// Desktop Mouse Events
canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    handleDrawEvent(e.clientX, e.clientY);
});

document.addEventListener("mouseup", () => { drawing = false; });

canvas.addEventListener("mousemove", (e) => {
    if (drawing) handleDrawEvent(e.clientX, e.clientY);
});

// Mobile Touch Events
canvas.addEventListener("touchstart", (e) => {
    drawing = true;
    handleDrawEvent(e.touches[0].clientX, e.touches[0].clientY);
});

document.addEventListener("touchend", () => { drawing = false; });

canvas.addEventListener("touchmove", (e) => {
    if (drawing) handleDrawEvent(e.touches[0].clientX, e.touches[0].clientY);
});

// Reset Grid Canvas
clearBtn.addEventListener("click", () => {
    gridData = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill("white"));
    drawCanvas();
});

// Save Function (Desktop File Download / Mobile Image Stream View)
saveBtn.addEventListener("click", () => {
    // Generate an image URL explicitly removing the grid overlay lines from the export
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

    const dataUrl = exportCanvas.toDataURL("image/png");

    // Detect general handheld mobile devices
    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);

    if (isMobile) {
        // Mobile browsers block background automated anchor file triggers.
        // We push the base64 raw photo output directly into an open window view context 
        // where mobile users can simply long-press down and click "Save Image" to camera roll.
        const newWindow = window.open();
        if (newWindow) {
            newWindow.document.write(`<img src="${dataUrl}" style="width:100%; max-width:1024px;" alt="Pixel Art"/>`);
            newWindow.document.title = "Hold down to save your Art!";
        } else {
            alert("Pop-up blocked! Please allow popups to save art on mobile screens.");
        }
    } else {
        // Standard Desktop Anchor Trigger Sequence
        const downloadLink = document.createElement("a");
        downloadLink.href = dataUrl;
        downloadLink.download = "pixel-art.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
});
