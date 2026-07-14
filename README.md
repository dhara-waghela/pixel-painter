# Pixel Painter !!

A responsive browser-based pixel art drawing app built with HTML, CSS, and JavaScript using the HTML5 Canvas API.

## Features
- **High-Resolution Canvas Export:** Saves your artwork natively as a crisp, full-sized 1024x1024 JPEG image.
- **Dense 128×128 Grid:** Built with an advanced 128x128 pixel matrix allowing for highly detailed, vintage-style digital illustrations.
- **Ultra-Light Inner Borders:** Includes optimized faint layout grid lines (`rgba(0,0,0,0.12)`) that assist your creation process without cluttering the screen view.
- **Clean Export Engine:** Automatically strips away the inner grid layout lines when you hit save, outputting purely your design.
- **Cross-Platform Saving:** Triggers immediate automatic file downloads on desktop computers, and opens an isolated long-press pop-up window context on mobile phone browsers for painless camera-roll saving.
- **Mobile Touch Support:** Uses specialized event overrides to prevent accidental page-scrolling or zooming while drawing on touch devices.
- **Color Picker & Tools:** Quickly switch color values or toggle between the Brush, Eraser, and full-canvas Clear utility.

## Built With
- **HTML5 Canvas API** - Handles structural painting data calculations and pixel rendering loops.
- **CSS3** - Implements responsive design structures, absolute aspect-ratio locks, and pixel-snapped rendering filters (`image-rendering: pixelated`).
- **Vanilla JavaScript (ES6+)** - Drives screen-to-matrix percentage mapping coordinates, performance-optimized line batching, and cross-origin mobile storage workarounds.

## Installation & Usage
1. Download or clone the repository to your machine:
   - `index.html`
   - `style.css`
   - `script.js`
2. Keep all three files inside the same project directory folder.
3. Double-click `index.html` to open and run the app instantly in any modern web browser—no local servers or installations required!
