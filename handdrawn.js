/**
 * SMOOTHIE - Hand-drawn Style Effects with p5.js
 * Creates colored pencil strokes and rice paper (Xuan paper) texture effects
 */

// Global variables for p5.js sketches
let paperCanvas;
let decorCanvas;

// Rice paper color palette - warm, natural tones
const paperColors = {
    base: [252, 248, 240],      // Warm cream white
    fiber1: [245, 235, 220],    // Light beige
    fiber2: [238, 228, 210],    // Soft tan
    fiber3: [230, 218, 195],    // Warm oatmeal
    spot: [220, 205, 180]       // Aged spots
};

// Colored pencil palette - vibrant but soft
const pencilColors = {
    blue: [100, 140, 200],
    cyan: [80, 180, 200],
    pink: [220, 130, 160],
    orange: [240, 170, 100],
    green: [120, 180, 140],
    purple: [160, 130, 190],
    teal: [90, 190, 175]
};

/**
 * Create rice paper (Xuan paper) texture background
 * This runs as a p5.js instance for the main background
 */
function createPaperTexture(p) {
    p.setup = function() {
        // Create canvas with 2x viewport size to ensure full coverage
        const w = window.innerWidth * 2;
        const h = window.innerHeight * 2;

        const canvas = p.createCanvas(w, h);
        canvas.parent('paper-background');

        p.pixelDensity(1);
        p.noLoop();
        drawPaperTexture(p);
    };

    p.windowResized = function() {
        const w = window.innerWidth * 2;
        const h = window.innerHeight * 2;
        p.resizeCanvas(w, h);
        drawPaperTexture(p);
    };
}

/**
 * Draw the rice paper texture with fibers and spots
 */
function drawPaperTexture(p) {
    // Base cream color
    p.background(paperColors.base);

    // Load pixels for direct manipulation
    p.loadPixels();

    // Add subtle noise texture
    for (let x = 0; x < p.width; x++) {
        for (let y = 0; y < p.height; y++) {
            const idx = 4 * (y * p.width + x);

            // Perlin noise for organic texture
            const noiseVal = p.noise(x * 0.01, y * 0.01);
            const variation = p.map(noiseVal, 0, 1, -8, 8);

            // Add fiber-like texture
            const fiberNoise = p.noise(x * 0.05, y * 0.02);
            const fiberVar = p.map(fiberNoise, 0, 1, -5, 5);

            p.pixels[idx] = paperColors.base[0] + variation + fiberVar;
            p.pixels[idx + 1] = paperColors.base[1] + variation + fiberVar;
            p.pixels[idx + 2] = paperColors.base[2] + variation + fiberVar;
            p.pixels[idx + 3] = 255;
        }
    }
    p.updatePixels();

    // Draw dense paper fibers - horizontal
    p.strokeWeight(0.8);
    for (let i = 0; i < 2000; i++) {
        const x = p.random(p.width);
        const y = p.random(p.height);
        const len = p.random(15, 60);
        const angle = p.random(-0.2, 0.2);

        p.stroke(paperColors.fiber2[0], paperColors.fiber2[1], paperColors.fiber2[2], p.random(15, 40));
        p.push();
        p.translate(x, y);
        p.rotate(angle);
        p.line(0, 0, len, 0);
        p.pop();
    }

    // Draw vertical fibers
    for (let i = 0; i < 800; i++) {
        const x = p.random(p.width);
        const y = p.random(p.height);
        const len = p.random(10, 40);

        p.stroke(paperColors.fiber3[0], paperColors.fiber3[1], paperColors.fiber3[2], p.random(10, 25));
        p.line(x, y, x + p.random(-5, 5), y + len);
    }

    // Add subtle grid-like texture (rice paper weave)
    p.strokeWeight(0.3);
    for (let x = 0; x < p.width; x += p.random(30, 60)) {
        p.stroke(paperColors.fiber1[0], paperColors.fiber1[1], paperColors.fiber1[2], 8);
        p.line(x + p.random(-3, 3), 0, x + p.random(-3, 3), p.height);
    }
    for (let y = 0; y < p.height; y += p.random(40, 80)) {
        p.stroke(paperColors.fiber1[0], paperColors.fiber1[1], paperColors.fiber1[2], 6);
        p.line(0, y + p.random(-3, 3), p.width, y + p.random(-3, 3));
    }

    // Add soft watercolor-like blotches
    p.noStroke();
    for (let i = 0; i < 30; i++) {
        const x = p.random(p.width);
        const y = p.random(p.height);
        const size = p.random(50, 150);
        p.fill(paperColors.fiber2[0], paperColors.fiber2[1], paperColors.fiber2[2], p.random(3, 8));
        p.ellipse(x, y, size, size * p.random(0.6, 1.4));
    }

    // Add aged spots
    for (let i = 0; i < 200; i++) {
        const x = p.random(p.width);
        const y = p.random(p.height);
        const size = p.random(2, 12);
        p.fill(paperColors.spot[0], paperColors.spot[1], paperColors.spot[2], p.random(8, 25));
        p.ellipse(x, y, size, size * p.random(0.8, 1.2));
    }

    // Add some colored pencil scribbles for decoration
    const decorColors = [
        [180, 200, 220, 15],  // light blue
        [220, 200, 180, 15],  // warm beige
        [200, 180, 200, 12],  // light purple
        [180, 210, 190, 12]   // light green
    ];

    for (let i = 0; i < 50; i++) {
        const x = p.random(p.width);
        const y = p.random(p.height);
        const col = decorColors[Math.floor(p.random(decorColors.length))];
        p.stroke(col[0], col[1], col[2], col[3]);
        p.strokeWeight(p.random(0.5, 2));
        p.noFill();

        // Draw small curved scribbles
        p.beginShape();
        for (let j = 0; j < 5; j++) {
            p.curveVertex(
                x + p.random(-30, 30),
                y + p.random(-30, 30)
            );
        }
        p.endShape();
    }
}

/**
 * Draw a line with colored pencil effect
 * Simulates the texture of colored pencil strokes
 */
function drawPencilLine(p, x1, y1, x2, y2, color, alpha = 1, strokes = 3) {
    const dist = p.dist(x1, y1, x2, y2);
    const angle = p.atan2(y2 - y1, x2 - x1);

    for (let s = 0; s < strokes; s++) {
        p.beginShape();
        p.noFill();

        // Vary color slightly for each stroke
        const colorVar = p.random(-10, 10);
        p.stroke(
            color[0] + colorVar,
            color[1] + colorVar,
            color[2] + colorVar,
            255 * alpha * p.random(0.7, 1)
        );
        p.strokeWeight(p.random(0.5, 1.5));

        // Draw wavy line to simulate pencil texture
        const steps = Math.max(10, Math.floor(dist / 3));
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const px = p.lerp(x1, x2, t);
            const py = p.lerp(y1, y2, t);

            // Add perpendicular wobble
            const wobble = p.noise(i * 0.3 + s) * 2 - 1;
            const offsetX = Math.cos(angle + Math.PI / 2) * wobble;
            const offsetY = Math.sin(angle + Math.PI / 2) * wobble;

            p.curveVertex(px + offsetX, py + offsetY);
        }
        p.endShape();
    }
}

/**
 * Draw a rectangle with hand-drawn pencil border
 */
function drawPencilRect(p, x, y, w, h, color, filled = false) {
    if (filled) {
        // Fill with pencil strokes (cross-hatching effect)
        const spacing = 4;
        p.push();
        for (let i = 0; i < h; i += spacing) {
            const strokeAlpha = p.random(0.2, 0.4);
            drawPencilLine(p, x, y + i, x + w, y + i, color, strokeAlpha, 1);
        }
        // Cross-hatch
        for (let i = 0; i < w; i += spacing * 2) {
            const strokeAlpha = p.random(0.1, 0.2);
            drawPencilLine(p, x + i, y, x + i, y + h, color, strokeAlpha, 1);
        }
        p.pop();
    }

    // Draw border with hand-drawn effect
    const extend = 3; // Slight extension at corners

    // Top
    drawPencilLine(p, x - extend, y, x + w + extend, y, color, 0.8, 2);
    // Right
    drawPencilLine(p, x + w, y - extend, x + w, y + h + extend, color, 0.8, 2);
    // Bottom
    drawPencilLine(p, x + w + extend, y + h, x - extend, y + h, color, 0.8, 2);
    // Left
    drawPencilLine(p, x, y + h + extend, x, y - extend, color, 0.8, 2);
}

/**
 * Draw a circle with hand-drawn pencil effect
 */
function drawPencilCircle(p, cx, cy, r, color, filled = false) {
    if (filled) {
        // Fill with circular pencil strokes
        for (let ri = r; ri > 0; ri -= 3) {
            const alpha = p.map(ri, 0, r, 0.4, 0.1);
            drawPencilEllipse(p, cx, cy, ri, ri, color, alpha);
        }
    }

    // Draw border
    drawPencilEllipse(p, cx, cy, r, r, color, 0.8);
}

/**
 * Draw an ellipse with pencil effect
 */
function drawPencilEllipse(p, cx, cy, rx, ry, color, alpha = 1) {
    const strokes = 3;

    for (let s = 0; s < strokes; s++) {
        p.beginShape();
        p.noFill();

        const colorVar = p.random(-10, 10);
        p.stroke(
            color[0] + colorVar,
            color[1] + colorVar,
            color[2] + colorVar,
            255 * alpha * p.random(0.7, 1)
        );
        p.strokeWeight(p.random(0.8, 1.5));

        const steps = 60;
        for (let i = 0; i <= steps + 3; i++) {
            const angle = (i / steps) * p.TWO_PI;
            const wobble = p.noise(i * 0.2 + s) * 3 - 1.5;
            const px = cx + (rx + wobble) * Math.cos(angle);
            const py = cy + (ry + wobble) * Math.sin(angle);
            p.curveVertex(px, py);
        }
        p.endShape();
    }
}

/**
 * Create decoration canvas for UI elements
 */
function createDecorationCanvas(p) {
    p.setup = function() {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent('decoration-layer');
        canvas.style('position', 'fixed');
        canvas.style('top', '0');
        canvas.style('left', '0');
        canvas.style('z-index', '1000');
        canvas.style('pointer-events', 'none');

        p.pixelDensity(1);
        p.clear();
    };

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    // Expose drawing functions globally
    window.drawHanddrawnBorder = function(element) {
        const rect = element.getBoundingClientRect();
        p.clear();
        drawPencilRect(p, rect.left, rect.top, rect.width, rect.height, pencilColors.blue);
    };
}

/**
 * Draw hand-drawn icons
 */
const HanddrawnIcons = {
    // Star icon (hand-drawn)
    star: function(p, cx, cy, size, color) {
        const points = 5;
        const outerR = size;
        const innerR = size * 0.4;

        p.beginShape();
        p.noFill();
        p.stroke(color[0], color[1], color[2], 200);
        p.strokeWeight(1.5);

        for (let i = 0; i < points * 2; i++) {
            const angle = (i * p.PI / points) - p.PI / 2;
            const r = (i % 2 === 0) ? outerR : innerR;
            const wobble = p.random(-2, 2);
            const px = cx + (r + wobble) * Math.cos(angle);
            const py = cy + (r + wobble) * Math.sin(angle);
            p.curveVertex(px, py);
        }
        // Close the shape
        const firstAngle = -p.PI / 2;
        p.curveVertex(cx + outerR * Math.cos(firstAngle), cy + outerR * Math.sin(firstAngle));
        p.endShape(p.CLOSE);
    },

    // Atom/molecule icon (hand-drawn)
    atom: function(p, cx, cy, size, color) {
        // Draw electron orbits
        for (let i = 0; i < 3; i++) {
            p.push();
            p.translate(cx, cy);
            p.rotate(i * p.PI / 3);
            drawPencilEllipse(p, 0, 0, size, size * 0.4, color, 0.7);
            p.pop();
        }

        // Draw nucleus
        drawPencilCircle(p, cx, cy, size * 0.15, color, true);
    },

    // Download icon (hand-drawn)
    download: function(p, cx, cy, size, color) {
        // Arrow body
        drawPencilLine(p, cx, cy - size * 0.4, cx, cy + size * 0.2, color, 0.9, 2);

        // Arrow head
        drawPencilLine(p, cx - size * 0.3, cy, cx, cy + size * 0.4, color, 0.9, 2);
        drawPencilLine(p, cx + size * 0.3, cy, cx, cy + size * 0.4, color, 0.9, 2);

        // Base line
        drawPencilLine(p, cx - size * 0.4, cy + size * 0.5, cx + size * 0.4, cy + size * 0.5, color, 0.9, 2);
    },

    // Document icon (hand-drawn)
    document: function(p, cx, cy, size, color) {
        const w = size * 0.7;
        const h = size;
        const fold = size * 0.2;

        // Main rectangle
        drawPencilLine(p, cx - w/2, cy - h/2, cx + w/2 - fold, cy - h/2, color, 0.8, 2);
        drawPencilLine(p, cx + w/2, cy - h/2 + fold, cx + w/2, cy + h/2, color, 0.8, 2);
        drawPencilLine(p, cx + w/2, cy + h/2, cx - w/2, cy + h/2, color, 0.8, 2);
        drawPencilLine(p, cx - w/2, cy + h/2, cx - w/2, cy - h/2, color, 0.8, 2);

        // Fold corner
        drawPencilLine(p, cx + w/2 - fold, cy - h/2, cx + w/2 - fold, cy - h/2 + fold, color, 0.8, 2);
        drawPencilLine(p, cx + w/2 - fold, cy - h/2 + fold, cx + w/2, cy - h/2 + fold, color, 0.8, 2);

        // Text lines
        const lineY = cy - h * 0.15;
        for (let i = 0; i < 3; i++) {
            drawPencilLine(p, cx - w * 0.3, lineY + i * size * 0.18, cx + w * 0.3, lineY + i * size * 0.18, color, 0.4, 1);
        }
    },

    // Code icon (hand-drawn brackets)
    code: function(p, cx, cy, size, color) {
        // Left bracket <
        drawPencilLine(p, cx - size * 0.1, cy - size * 0.4, cx - size * 0.4, cy, color, 0.9, 2);
        drawPencilLine(p, cx - size * 0.4, cy, cx - size * 0.1, cy + size * 0.4, color, 0.9, 2);

        // Right bracket >
        drawPencilLine(p, cx + size * 0.1, cy - size * 0.4, cx + size * 0.4, cy, color, 0.9, 2);
        drawPencilLine(p, cx + size * 0.4, cy, cx + size * 0.1, cy + size * 0.4, color, 0.9, 2);
    },

    // Lightning bolt (hand-drawn)
    lightning: function(p, cx, cy, size, color) {
        const points = [
            [cx, cy - size * 0.5],
            [cx - size * 0.15, cy - size * 0.1],
            [cx + size * 0.1, cy - size * 0.1],
            [cx - size * 0.05, cy + size * 0.5],
            [cx + size * 0.2, cy],
            [cx - size * 0.05, cy],
            [cx + size * 0.1, cy - size * 0.5]
        ];

        for (let i = 0; i < points.length - 1; i++) {
            drawPencilLine(p, points[i][0], points[i][1], points[i+1][0], points[i+1][1], color, 0.9, 2);
        }
    },

    // Flask/science icon (hand-drawn)
    flask: function(p, cx, cy, size, color) {
        const top = cy - size * 0.5;
        const neck = cy - size * 0.2;
        const bottom = cy + size * 0.5;
        const neckW = size * 0.15;
        const bottomW = size * 0.4;

        // Neck
        drawPencilLine(p, cx - neckW, top, cx - neckW, neck, color, 0.8, 2);
        drawPencilLine(p, cx + neckW, top, cx + neckW, neck, color, 0.8, 2);

        // Top rim
        drawPencilLine(p, cx - neckW - 3, top, cx + neckW + 3, top, color, 0.8, 2);

        // Body
        drawPencilLine(p, cx - neckW, neck, cx - bottomW, bottom, color, 0.8, 2);
        drawPencilLine(p, cx + neckW, neck, cx + bottomW, bottom, color, 0.8, 2);
        drawPencilLine(p, cx - bottomW, bottom, cx + bottomW, bottom, color, 0.8, 2);

        // Liquid
        const liquidTop = cy + size * 0.1;
        drawPencilLine(p, cx - size * 0.25, liquidTop, cx + size * 0.25, liquidTop, pencilColors.cyan, 0.5, 1);
    },

    // Question mark (hand-drawn)
    question: function(p, cx, cy, size, color) {
        // Curve of question mark
        p.beginShape();
        p.noFill();
        p.stroke(color[0], color[1], color[2], 200);
        p.strokeWeight(2);

        const startAngle = p.PI * 1.2;
        const endAngle = p.PI * 0.2;
        const r = size * 0.3;

        for (let a = startAngle; a > endAngle; a -= 0.1) {
            const wobble = p.random(-1, 1);
            const px = cx + (r + wobble) * Math.cos(a);
            const py = cy - size * 0.15 + (r + wobble) * Math.sin(a);
            p.curveVertex(px, py);
        }
        p.endShape();

        // Stem
        drawPencilLine(p, cx, cy + size * 0.05, cx, cy + size * 0.2, color, 0.8, 2);

        // Dot
        drawPencilCircle(p, cx, cy + size * 0.4, size * 0.06, color, true);
    },

    // Mail/contact icon (hand-drawn)
    mail: function(p, cx, cy, size, color) {
        const w = size * 0.9;
        const h = size * 0.6;

        // Envelope rectangle
        drawPencilRect(p, cx - w/2, cy - h/2, w, h, color);

        // V fold lines
        drawPencilLine(p, cx - w/2, cy - h/2, cx, cy + h * 0.1, color, 0.7, 2);
        drawPencilLine(p, cx + w/2, cy - h/2, cx, cy + h * 0.1, color, 0.7, 2);
    },

    // Home icon (hand-drawn)
    home: function(p, cx, cy, size, color) {
        const roofTop = cy - size * 0.4;
        const roofBase = cy;
        const bottom = cy + size * 0.4;
        const w = size * 0.7;

        // Roof
        drawPencilLine(p, cx, roofTop, cx - w/2 - size * 0.1, roofBase, color, 0.8, 2);
        drawPencilLine(p, cx, roofTop, cx + w/2 + size * 0.1, roofBase, color, 0.8, 2);

        // Walls
        drawPencilLine(p, cx - w/2, roofBase, cx - w/2, bottom, color, 0.8, 2);
        drawPencilLine(p, cx + w/2, roofBase, cx + w/2, bottom, color, 0.8, 2);

        // Base
        drawPencilLine(p, cx - w/2, bottom, cx + w/2, bottom, color, 0.8, 2);

        // Door
        const doorW = size * 0.2;
        const doorH = size * 0.3;
        drawPencilRect(p, cx - doorW/2, bottom - doorH, doorW, doorH, color);
    }
};

/**
 * Initialize hand-drawn effects
 */
function initHanddrawnEffects() {
    // Create container divs for p5.js canvases
    const paperBg = document.createElement('div');
    paperBg.id = 'paper-background';
    document.body.insertBefore(paperBg, document.body.firstChild);

    const decorLayer = document.createElement('div');
    decorLayer.id = 'decoration-layer';
    document.body.appendChild(decorLayer);

    // Initialize p5.js instances
    paperCanvas = new p5(createPaperTexture);

    // Add hand-drawn styling to elements after DOM is loaded
    setTimeout(applyHanddrawnStyles, 100);
}

/**
 * Apply hand-drawn CSS classes to elements
 */
function applyHanddrawnStyles() {
    // Add hand-drawn class to cards
    document.querySelectorAll('.feature-card, .citation-paper, .paper-card, .faq-item').forEach(el => {
        el.classList.add('handdrawn-card');
    });

    // Add hand-drawn class to buttons
    document.querySelectorAll('.btn-primary, .btn-secondary, .paper-link').forEach(el => {
        el.classList.add('handdrawn-btn');
    });

    // Add hand-drawn class to inputs
    document.querySelectorAll('input, select, textarea').forEach(el => {
        el.classList.add('handdrawn-input');
    });
}

/**
 * Create a canvas with hand-drawn icon
 */
function createIconCanvas(iconName, size, colorKey = 'blue') {
    const canvas = document.createElement('canvas');
    canvas.width = size * 2;
    canvas.height = size * 2;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';

    const iconSketch = function(p) {
        p.setup = function() {
            p.createCanvas(size * 2, size * 2);
            p.pixelDensity(2);
            p.background(0, 0, 0, 0);
            p.clear();

            const color = pencilColors[colorKey] || pencilColors.blue;
            const cx = size;
            const cy = size;
            const iconSize = size * 0.7;

            if (HanddrawnIcons[iconName]) {
                HanddrawnIcons[iconName](p, cx, cy, iconSize, color);
            }

            p.noLoop();
        };
    };

    new p5(iconSketch, canvas);
    return canvas;
}

/**
 * Replace emoji icons with hand-drawn versions
 */
function replaceEmojisWithHanddrawn() {
    // Map emoji to icon names
    const emojiMap = {
        '': 'atom',
        '': 'lightning',
        '': 'flask',
        '': 'document',
        '': 'download',
        '': 'code',
        '': 'question',
        '': 'mail',
        '': 'home',
        '': 'star'
    };

    document.querySelectorAll('.feature-icon').forEach(el => {
        const emoji = el.textContent.trim();
        if (emojiMap[emoji]) {
            el.textContent = '';
            el.style.display = 'flex';
            el.style.justifyContent = 'center';
            el.style.alignItems = 'center';

            // Create and append hand-drawn icon
            const iconCanvas = createIconCanvas(emojiMap[emoji], 40, 'teal');
            el.appendChild(iconCanvas);
        }
    });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHanddrawnEffects);
} else {
    initHanddrawnEffects();
}

// Export for use in other scripts
window.HanddrawnEffects = {
    drawPencilLine,
    drawPencilRect,
    drawPencilCircle,
    drawPencilEllipse,
    HanddrawnIcons,
    pencilColors,
    paperColors,
    createIconCanvas,
    replaceEmojisWithHanddrawn
};
