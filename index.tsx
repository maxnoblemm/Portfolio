// --- Setup ---
const canvas = document.getElementById('interactive-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let mouse = { x: width / 2, y: height / 2, radius: 80 };

// --- Scene Management ---
let currentSceneIndex = 0;
const scenes = ['bacteria', 'space', 'immune'];
let particles: (Particle | ImmuneCell | RedBloodCell)[] = [];
let rocket: Rocket | null = null;
let celestialBodies: CelestialBody[] = [];
let antibodies: Antibody[] = [];
let foodParticles: FoodParticle[] = [];
let viruses: Virus[] = [];
let blackHole: BlackHole | null = null;
let isPaused = false;
let isImmuneGameOver = false;

// Scene-specific state
let greenTintLevel = 0;
let sicknessLevel = 0;

// Transition State
let isTransitioning = false;
let transitionAlpha = 0;
let transitionState: 'fading-out' | 'fading-in' = 'fading-out';
const transitionSpeed = 0.04;

function switchScene() {
    if (!isTransitioning) {
        isTransitioning = true;
        transitionState = 'fading-out';
    }
}

function lerpColor(color1: string, color2: string, factor: number): string {
    const c1 = { r: parseInt(color1.slice(1,3), 16), g: parseInt(color1.slice(3,5), 16), b: parseInt(color1.slice(5,7), 16) };
    const c2 = { r: parseInt(color2.slice(1,3), 16), g: parseInt(color2.slice(3,5), 16), b: parseInt(color2.slice(5,7), 16) };
    const r = Math.round(c1.r + factor * (c2.r - c1.r));
    const g = Math.round(c1.g + factor * (c2.g - c1.g));
    const b = Math.round(c1.b + factor * (c2.b - c1.b));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function getSceneBackground() {
    const scene = scenes[currentSceneIndex];
    if (scene === 'bacteria') {
        // Base color is a gradient
        const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height));
        const baseColor1 = '#3a2a2a';
        const baseColor2 = '#1a0a0a';
        const greenColor1 = lerpColor(baseColor1, '#2e4d2e', greenTintLevel);
        const greenColor2 = lerpColor(baseColor2, '#152b15', greenTintLevel);
        gradient.addColorStop(0, greenColor1);
        gradient.addColorStop(1, greenColor2);
        return gradient;
    }
    if (scene === 'immune') {
        const baseRed = '#4a0e0e';
        const sickBlack = '#000000';
        return lerpColor(baseRed, sickBlack, sicknessLevel);
    }
    return '#000000'; // Space background
}

function initScene() {
    particles = [];
    rocket = null;
    celestialBodies = [];
    antibodies = [];
    foodParticles = [];
    viruses = [];
    blackHole = null;
    isImmuneGameOver = false;
    greenTintLevel = 0;
    sicknessLevel = 0;

    const sceneName = scenes[currentSceneIndex];

    if (sceneName === 'bacteria') {
        const colors = ['#f2d7d5', '#d4efdf', '#d6eaf8', '#fdebd0', '#e8daef'];
        for (let i = 0; i < 150; i++) {
            const microbeType = ['circle', 'rod', 'worm', 'blob'][Math.floor(Math.random() * 4)];
            particles.push(new Particle(microbeType, colors));
        }
    } else if (sceneName === 'space') {
        for (let i = 0; i < 250; i++) {
            particles.push(new Particle('star'));
        }
        const earthX = width * 0.15;
        const earthY = height * 0.3;
        celestialBodies.push(new CelestialBody(earthX, earthY, 50, '#3d4d9b', '#82a2f5', 'earth')); // Earth
        celestialBodies.push(new CelestialBody(earthX, earthY, 15, '#b0b0b0', '#e0e0e0', 'moon')); // Moon
        
        rocket = new Rocket(width / 2, height / 2);
    } else if (sceneName === 'immune') {
        for (let i = 0; i < 40; i++) particles.push(new RedBloodCell());
        for (let i = 0; i < 30; i++) particles.push(new ImmuneCell('t_cell'));
        for (let i = 0; i < 15; i++) particles.push(new ImmuneCell('b_cell'));
        for (let i = 0; i < 5; i++) particles.push(new ImmuneCell('macrophage'));
    }
}

// --- Entity Classes ---

class FoodParticle {
    x: number; y: number; radius: number; life: number; maxLife: number;
    constructor(x: number, y: number) {
        this.x = x; this.y = y; this.radius = 15;
        this.maxLife = 300; // lasts for 5 seconds
        this.life = this.maxLife;
    }
    update() {
        this.life--;
    }
    draw() {
        const alpha = Math.min(1, this.life / 100);
        ctx.fillStyle = `rgba(118, 186, 70, ${alpha})`; // broccoli green
        ctx.strokeStyle = `rgba(62, 115, 23, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 + (this.life * 0.01);
            const r = this.radius * 0.6;
            ctx.arc( this.x + Math.cos(angle) * r, this.y + Math.sin(angle) * r, this.radius * 0.5, 0, Math.PI * 2 );
        }
        ctx.fill();
        ctx.stroke();
    }
}

class BlackHole {
    x: number; y: number; radius: number; eventHorizonRadius: number; rotation: number;
    constructor(x: number, y: number) {
        this.x = x; this.y = y;
        this.radius = 15; // Moon's radius is 15
        this.eventHorizonRadius = this.radius * 2.5;
        this.rotation = 0;
    }
    update() {
        this.rotation += 0.005;
    }
    draw() {
        ctx.save();
        // Distortion effect
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        const gradient = ctx.createLinearGradient(-this.eventHorizonRadius, 0, this.eventHorizonRadius, 0);
        gradient.addColorStop(0, 'rgba(200, 200, 255, 0)');
        gradient.addColorStop(0.2, 'rgba(200, 200, 255, 0.3)');
        gradient.addColorStop(0.5, 'rgba(200, 200, 255, 0)');
        gradient.addColorStop(0.8, 'rgba(200, 200, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(200, 200, 255, 0)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, this.eventHorizonRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // The black hole itself
        const coreGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        coreGradient.addColorStop(0.5, '#000');
        coreGradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Virus {
    x: number; y: number; radius: number; vx: number; vy: number;
    rotation: number; spikes: { angle: number, length: number }[];
    constructor(x: number, y: number) {
        this.x = x; this.y = y; this.radius = 12;
        this.vx = (Math.random() - 0.5) * 0.5; this.vy = (Math.random() - 0.5) * 0.5;
        this.rotation = 0; this.spikes = [];
        for (let i = 0; i < 12; i++) {
            this.spikes.push({ angle: (i / 12) * Math.PI * 2, length: Math.random() * 4 + 4 });
        }
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        this.rotation += 0.01;
        this.vx *= 0.99; this.vy *= 0.99;
        if (this.x - this.radius < 0 || this.x + this.radius > width) this.vx *= -1;
        if (this.y - this.radius < 0 || this.y + this.radius > height) this.vy *= -1;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = '#9e4242'; ctx.lineWidth = 2;
        this.spikes.forEach(spike => {
            ctx.beginPath(); ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(spike.angle) * (this.radius + spike.length), Math.sin(spike.angle) * (this.radius + spike.length));
            ctx.stroke();
        });
        ctx.fillStyle = '#6b2d2d';
        ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }
}


class RedBloodCell {
    x: number; y: number; radius: number;
    vx: number; vy: number;
    gradient: CanvasGradient;

    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 8 + 10;
        this.vx = (Math.random() - 0.2) * 0.5; // General flow direction
        this.vy = (Math.random() - 0.5) * 0.2;
        this.gradient = ctx.createRadialGradient(0, 0, this.radius * 0.4, 0, 0, this.radius);
        this.gradient.addColorStop(0, '#e74c3c');
        this.gradient.addColorStop(1, '#c0392b');
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x - this.radius > width) this.x = -this.radius;
        if (this.x + this.radius < 0) this.x = width + this.radius;
        if (this.y - this.radius > height) this.y = -this.radius;
        if (this.y + this.radius < 0) this.y = height + this.radius;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}


class CelestialBody {
    x: number; y: number; radius: number; baseRadius: number; color1: string; color2: string; type: 'earth' | 'moon';
    orbitRadius: number; orbitAngle: number; earthX: number; earthY: number;
    constructor(x: number, y: number, radius: number, color1: string, color2: string, type: 'earth' | 'moon') {
        this.x = x; this.y = y; this.radius = radius; this.baseRadius = radius;
        this.color1 = color1; this.color2 = color2; this.type = type;
        this.earthX = x; this.earthY = y;
        this.orbitRadius = this.radius * 8;
        this.orbitAngle = Math.random() * Math.PI * 2;
    }

    update() {
        if (blackHole) {
            const dx = blackHole.x - this.x;
            const dy = blackHole.y - this.y;
            const distSq = dx * dx + dy * dy;
            const force = 1500 / distSq;
            this.x += (dx / Math.sqrt(distSq)) * force;
            this.y += (dy / Math.sqrt(distSq)) * force;
            if (distSq < blackHole.radius * blackHole.radius * 4) {
                this.radius *= 0.95;
            }
        } else if (this.type === 'moon') {
            const earth = celestialBodies.find(c => c.type === 'earth');
            if(earth) {
                this.orbitAngle += 0.002;
                this.x = earth.x + Math.cos(this.orbitAngle) * this.orbitRadius;
                this.y = earth.y + Math.sin(this.orbitAngle) * this.orbitRadius;
            }
        }
    }

    draw() {
        const gradient = ctx.createRadialGradient(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.1, this.x, this.y, this.radius);
        gradient.addColorStop(0, this.color2);
        gradient.addColorStop(1, this.color1);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Rocket {
    x: number; y: number; vx: number; vy: number; angle: number; size: number; baseSize: number;
    flameSize: number;

    constructor(x: number, y: number) {
        this.x = x; this.y = y; this.vx = 0; this.vy = 0;
        this.angle = 0; this.size = 15; this.baseSize = 15; this.flameSize = 0;
    }

    update() {
         if (blackHole) {
            const dx = blackHole.x - this.x;
            const dy = blackHole.y - this.y;
            const distSq = dx * dx + dy * dy;
            const force = 1000 / distSq; // Black holes are strong
            this.vx += (dx / Math.sqrt(distSq)) * force;
            this.vy += (dy / Math.sqrt(distSq)) * force;
            if (distSq < blackHole.radius * blackHole.radius * 9) { // Start shrinking when close
                this.size *= 0.97;
            }
        } else {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            this.angle = Math.atan2(dy, dx);
            const ax = Math.cos(this.angle) * 0.05;
            const ay = Math.sin(this.angle) * 0.05;
            this.vx += ax; this.vy += ay;
        }

        this.vx *= 0.98; this.vy *= 0.98;
        this.x += this.vx; this.y += this.vy;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        this.flameSize = speed * 4;
    }
    
    drawFlame() { //... same as before ...
        if (this.flameSize < 1 || this.size < 1) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = `rgba(255, 180, 0, ${Math.random() * 0.5 + 0.5})`;
        ctx.beginPath();
        ctx.moveTo(-this.size * 0.6, 0);
        ctx.lineTo(-this.size * 0.8 - this.flameSize, this.size * (Math.random() * 0.5 + 0.25));
        ctx.lineTo(-this.size * 0.8 - this.flameSize, -this.size * (Math.random() * 0.5 + 0.25));
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    draw() { //... same as before ...
        this.drawFlame();
        if (this.size < 0.5) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = '#dbdbdb';
        ctx.beginPath();
        ctx.moveTo(this.size, 0);
        ctx.lineTo(-this.size / 2, this.size / 1.5);
        ctx.lineTo(-this.size * 0.8, this.size / 1.6);
        ctx.lineTo(-this.size, 0);
        ctx.lineTo(-this.size * 0.8, -this.size / 1.6);
        ctx.lineTo(-this.size / 2, -this.size / 1.5);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#9bf6ff';
        ctx.beginPath();
        ctx.arc(this.size * 0.4, 0, this.size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class Antibody {
    x: number; y: number; vx: number; vy: number;
    radius: number; life: number;

    constructor(x: number, y: number, targetX: number, targetY: number) {
        this.x = x; this.y = y; this.radius = 2; this.life = 100;
        const angle = Math.atan2(targetY - y, targetX - x);
        const speed = 5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
    }

    draw() {
        ctx.fillStyle = `rgba(255, 230, 150, ${this.life / 100})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class ImmuneCell {
    x: number; y: number; radius: number; color: string;
    vx: number; vy: number; type: string;
    angle: number; angleSpeed: number;
    isLatched: boolean;
    fireCooldown: number;
    tentacles: {angle: number, length: number}[];

    constructor(type: string) {
        this.type = type;
        this.x = Math.random() * width; this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 2; this.vy = (Math.random() - 0.5) * 2;
        this.isLatched = false; this.fireCooldown = 0; this.angle = 0;
        this.angleSpeed = Math.random() * 0.01 - 0.005;
        this.tentacles = []; this.color = '#ffb3b3';

        if (type === 't_cell') {
            this.radius = Math.random() * 8 + 5; this.color = '#ffb3b3';
        } else if (type === 'b_cell') {
            this.radius = Math.random() * 6 + 10; this.color = '#ffcccc';
        } else { // macrophage
            this.radius = Math.random() * 10 + 15; this.color = '#ffcedd';
             for (let i = 0; i < 8; i++) {
                this.tentacles.push({ angle: (Math.PI * 2 / 8) * i, length: this.radius * (Math.random() * 0.5 + 1.5) });
            }
        }
    }

    update() {
        let targetX = mouse.x;
        let targetY = mouse.y;
        let targetExists = true;

        // Prioritize nearest virus
        if (viruses.length > 0) {
            let closestVirus: Virus | null = null;
            let min_dist = Infinity;
            viruses.forEach(virus => {
                const dist = Math.hypot(this.x - virus.x, this.y - virus.y);
                if (dist < min_dist) {
                    min_dist = dist;
                    closestVirus = virus;
                }
            });
            if (closestVirus) {
                targetX = closestVirus.x;
                targetY = closestVirus.y;
            }
        } else {
            targetExists = false;
        }

        const dx = targetX - this.x;
        const dy = targetY - this.y;
        let distance = Math.hypot(dx, dy);

        if (this.type !== 'b_cell' && targetExists && distance < this.radius + 5) {
            this.isLatched = true;
        }
        if (this.isLatched) {
             if (!targetExists || distance > mouse.radius) this.isLatched = false;
             this.vx *= 0.8; this.vy *= 0.8;
             this.x += (targetX - this.x) * 0.2;
             this.y += (targetY - this.y) * 0.2;
        } else {
            if (targetExists && distance < mouse.radius * 2) {
                const force = (mouse.radius * 2 - distance) / (mouse.radius * 2);
                this.vx += (dx / distance) * force * 0.3;
                this.vy += (dy / distance) * force * 0.3;
            }

            if (this.type === 'b_cell' && this.fireCooldown <= 0 && targetExists && distance < mouse.radius * 3) {
                antibodies.push(new Antibody(this.x, this.y, targetX, targetY));
                this.fireCooldown = 30;
            }
            this.vx += (Math.random() - 0.5) * 0.05;
            this.vy += (Math.random() - 0.5) * 0.05;
        }

        if (this.fireCooldown > 0) this.fireCooldown--;
        this.angle += this.angleSpeed;
        this.vx *= 0.98; this.vy *= 0.98;
        this.x += this.vx; this.y += this.vy;

        if (this.x - this.radius < 0) { this.x = this.radius; this.vx *= -1; }
        if (this.x + this.radius > width) { this.x = width - this.radius; this.vx *= -1; }
        if (this.y - this.radius < 0) { this.y = this.radius; this.vy *= -1; }
        if (this.y + this.radius > height) { this.y = height - this.radius; this.vy *= -1; }
    }

    draw() { // ... same as before ...
        ctx.fillStyle = this.color;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();

        if (this.type === 'macrophage') {
            const time = performance.now() / 300;
            ctx.moveTo(this.radius, 0);
            for (let i = 0; i < this.tentacles.length; i++) {
                const t = this.tentacles[i];
                const wiggle = Math.sin(t.angle * 3 + time) * 5;
                const reach = (Math.sin(t.angle * 2.5 + time * 2) + 1) / 2 * 15;
                ctx.quadraticCurveTo(
                    Math.cos(t.angle) * (this.radius + wiggle),
                    Math.sin(t.angle) * (this.radius + wiggle),
                    Math.cos(t.angle + 0.4) * (t.length + reach),
                    Math.sin(t.angle + 0.4) * (t.length + reach),
                );
            }
        } else {
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        }

        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}


class Particle {
    x: number; y: number; radius: number; color: string;
    vx: number; vy: number; type: string;
    angle: number; length: number; wiggle: number;
    alpha: number;

    constructor(type: string, colors?: string[], specificColor?: string) {
        this.type = type;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.angle = Math.random() * Math.PI * 2;
        this.wiggle = 0;
        this.alpha = Math.random() * 0.5 + 0.5;

        if (type === 'star') {
            this.radius = Math.random() * 1.5;
            this.color = `rgba(255, 255, 255, ${this.alpha})`;
        } else { // microbes
            if (specificColor) {
                this.color = specificColor;
            } else {
                this.color = colors![Math.floor(Math.random() * colors!.length)];
            }
            if (type === 'rod') {
                this.radius = Math.random() * 3 + 2; this.length = Math.random() * 20 + 10;
            } else if (type === 'worm') {
                this.radius = Math.random() * 2 + 1; this.length = 10;
            } else { this.radius = Math.random() * 6 + 3; }
        }
    }

    update() {
        const sceneName = scenes[currentSceneIndex];
        
        if (sceneName === 'bacteria') {
            // Attraction to food overrides fleeing
            if (foodParticles.length > 0) {
                const closestFood = foodParticles.reduce((prev, curr) => Math.hypot(this.x - prev.x, this.y - prev.y) < Math.hypot(this.x - curr.x, this.y - curr.y) ? prev : curr);
                const dx = closestFood.x - this.x;
                const dy = closestFood.y - this.y;
                const distance = Math.hypot(dx, dy);
                if (distance > 1) {
                    this.vx += (dx / distance) * 0.08;
                    this.vy += (dy / distance) * 0.08;
                }
            } else { // Fleeing logic
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.hypot(dx, dy);
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.vx -= (dx / distance) * force * 2.5;
                    this.vy -= (dy / distance) * force * 2.5;
                }
            }
            
            this.angle += (Math.random() - 0.5) * 0.05;
            this.vx += (Math.random() - 0.5) * 0.05;
            this.vy += (Math.random() - 0.5) * 0.05;
            this.vx *= 0.96; this.vy *= 0.96;
            this.x += this.vx; this.y += this.vy;
            this.wiggle += 0.08;

            if (this.x - this.radius < 0) { this.x = this.radius; this.vx *= -1; }
            if (this.x + this.radius > width) { this.x = width - this.radius; this.vx *= -1; }
            if (this.y - this.radius < 0) { this.y = this.radius; this.vy *= -1; }
            if (this.y + this.radius > height) { this.y = height - this.radius; this.vy *= -1; }

        } else if (sceneName === 'space' && this.type === 'star') {
            this.alpha += (Math.random() - 0.5) * 0.1;
            if (this.alpha > 1) this.alpha = 1; if (this.alpha < 0.3) this.alpha = 0.3;
            this.color = `rgba(255, 255, 255, ${this.alpha})`;
        }
    }

    draw() { // ... same as before ...
        ctx.fillStyle = this.color;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        switch (this.type) {
            case 'star':
            case 'circle':
                ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
                break;
            case 'blob':
                ctx.moveTo(this.radius, 0);
                for(let i=0; i < Math.PI * 2; i+= 0.5) {
                    const r = this.radius + Math.sin(i * 3 + this.wiggle) * this.radius * 0.2;
                    ctx.lineTo(Math.cos(i) * r, Math.sin(i) * r);
                }
                ctx.closePath();
                break;
            case 'rod':
                ctx.roundRect(-this.length / 2, -this.radius, this.length, this.radius * 2, this.radius);
                break;
            case 'worm':
                for (let i = 0; i < this.length; i++) {
                    const x = (i - this.length / 2) * this.radius;
                    const y = Math.sin(i * 0.5 + this.wiggle) * this.radius * 1.2;
                    ctx.arc(x, y, this.radius, 0, Math.PI * 2);
                }
                break;
        }
        ctx.fill();
        ctx.restore();
    }
}


// --- Animation Loop ---
function animate() {
    if (!isPaused) {
        ctx.fillStyle = getSceneBackground();
        ctx.fillRect(0, 0, width, height);

        const sceneName = scenes[currentSceneIndex];
        
        // Update and Draw entities
        if (sceneName === 'bacteria') {
            const foodConsumedThisFrame = new Set<FoodParticle>();
            const newMicrobes: Particle[] = [];

            // Check for consumption
            for (const food of foodParticles) {
                for (const microbe of particles) {
                    if (microbe instanceof Particle) {
                        const dist = Math.hypot(microbe.x - food.x, microbe.y - food.y);
                        if (dist < microbe.radius + food.radius) {
                            foodConsumedThisFrame.add(food);
                            
                            const microbeType = ['circle', 'rod', 'worm', 'blob'][Math.floor(Math.random() * 4)];
                            const newMicrobe = new Particle(microbeType, undefined, '#76ba46'); 
                            newMicrobe.x = food.x;
                            newMicrobe.y = food.y;
                            newMicrobes.push(newMicrobe);
                            
                            break; // This food is eaten, move to the next food particle
                        }
                    }
                }
            }
            
            particles.push(...newMicrobes);
            
            const nextFrameFood: FoodParticle[] = [];
            for (const food of foodParticles) {
                if (foodConsumedThisFrame.has(food)) {
                    continue; // Skip consumed food
                }
                food.update(); // Update life countdown
                if (food.life > 0) {
                    nextFrameFood.push(food);
                    food.draw(); // Draw if it's still alive
                }
            }
            foodParticles = nextFrameFood;
        }
        
        if (sceneName === 'space') {
            celestialBodies.forEach(p => { p.update(); p.draw(); });
            celestialBodies = celestialBodies.filter(c => c.radius > 1);
            if(blackHole) { blackHole.update(); blackHole.draw(); }
        }
        
        if (sceneName === 'immune') {
            // Run combat logic
            const immuneCells = particles.filter(p => p instanceof ImmuneCell) as ImmuneCell[];
            if (viruses.length > 0 && immuneCells.length > 0) {
                const virusesToRemove = new Set<Virus>();
                const immuneCellsToRemove = new Set<ImmuneCell>();
                const newViruses: {x: number, y: number}[] = [];

                for (const cell of immuneCells) {
                    for (const virus of viruses) {
                         if (virusesToRemove.has(virus)) continue;
                         const dist = Math.hypot(cell.x - virus.x, cell.y - virus.y);
                         if (dist < cell.radius + virus.radius) {
                             if (Math.random() < 0.5) {
                                virusesToRemove.add(virus);
                             } else {
                                immuneCellsToRemove.add(cell);
                                newViruses.push({ x: cell.x, y: cell.y });
                             }
                             break; // Cell has interacted, move to next
                         }
                    }
                }
                if (virusesToRemove.size > 0 || immuneCellsToRemove.size > 0) {
                    viruses = viruses.filter(v => !virusesToRemove.has(v));
                    particles = particles.filter(p => !immuneCellsToRemove.has(p as ImmuneCell));
                    newViruses.forEach(v => viruses.push(new Virus(v.x, v.y)));
                }
            }
            if (immuneCells.length === 0 && viruses.length > 0) {
                isImmuneGameOver = true;
            }

            particles.filter(p => p instanceof RedBloodCell).forEach(p => { p.update(); p.draw(); });
            viruses.forEach(v => { v.update(); v.draw(); });
        }

        particles.filter(p => !(p instanceof RedBloodCell)).forEach(p => { p.update(); p.draw(); });

        if (sceneName === 'immune') {
            antibodies = antibodies.filter(a => a.life > 0);
            antibodies.forEach(a => { a.update(); a.draw(); });
        }

        if (rocket) { 
            rocket.update(); rocket.draw(); 
            if (rocket.size < 1) rocket = null;
        }

        if (isImmuneGameOver) {
            ctx.fillStyle = `rgba(0,0,0,0.1)`;
            ctx.fillRect(0,0,width,height);
        }
        
        // Handle transitions
        if (isTransitioning) {
            if (transitionState === 'fading-out') {
                transitionAlpha += transitionSpeed;
                if (transitionAlpha >= 1) {
                    transitionAlpha = 1;
                    currentSceneIndex = (currentSceneIndex + 1) % scenes.length;
                    initScene();
                    transitionState = 'fading-in';
                }
            } else if (transitionState === 'fading-in') {
                transitionAlpha -= transitionSpeed;
                if (transitionAlpha <= 0) {
                    transitionAlpha = 0;
                    isTransitioning = false;
                }
            }
            ctx.fillStyle = `rgba(0, 0, 0, ${transitionAlpha})`;
            ctx.fillRect(0, 0, width, height);
        }
    }
    requestAnimationFrame(animate);
}

// ====== Sequential sections with single-stack fan-out (Publications then Cover Art) ======
const pubsSection   = document.getElementById('pubs-section')   as HTMLElement | null;
const coversSection = document.getElementById('covers-section') as HTMLElement | null;
const labelPubs     = document.getElementById('label-pubs')     as HTMLElement | null;
const labelCovers   = document.getElementById('label-covers')   as HTMLElement | null;

const clamp = (v:number, a=0, b=1) => Math.max(a, Math.min(b, v));

function handlePapersScroll() {
  if (pubsSection)   animateSectionLikeSingleStack(pubsSection,   labelPubs);
  if (coversSection) animateSectionLikeSingleStack(coversSection, labelCovers);
}

function animateSectionLikeSingleStack(section: HTMLElement, label: HTMLElement | null) {
  const papers = Array.from(section.querySelectorAll<HTMLElement>('.paper'));
  if (!papers.length) return;

  const rect = section.getBoundingClientRect();
  const vh = window.innerHeight;

  if (rect.bottom < 0 || rect.top > vh) return;

  const animationDuration = vh * 1.5;
  const animationStartPoint = section.offsetTop - vh / 2;
  const currentScroll = window.scrollY;
  let progress = (currentScroll - animationStartPoint) / animationDuration;
  progress = clamp(progress, 0, 1);

  const paperCount = papers.length;
  const middleIndex = Math.floor(paperCount / 2);

  papers.forEach((paper, idx) => {
    const idxProp = parseInt(paper.style.getPropertyValue('--i'));
    const i = Number.isNaN(idxProp) ? idx : idxProp;

    const initialRotate = (i - middleIndex) * 2.5;
    const initialX = (i - middleIndex) * 5;
    const initialY = (i - middleIndex) * -5 + 100;
    const initialScale = 0.5;

    const finalRotate = (i - middleIndex) * 18;
    const finalX = (i - middleIndex) * 190;
    const finalY = Math.abs(i - middleIndex) * -50;
    const finalScale = 1;

    const currentRotate = initialRotate + (finalRotate - initialRotate) * progress;
    const currentX = initialX + (finalX - initialX) * progress;
    const currentY = initialY + (finalY - initialY) * progress;
    const currentScale = initialScale + (finalScale - initialScale) * progress;

    paper.style.transform = `translateY(${currentY}px) translateX(${currentX}px) rotate(${currentRotate}deg) scale(${currentScale})`;
  });

  if (label) {
    label.style.left = '50%';
    label.style.transform = 'translateX(-50%)';
    label.style.opacity = String(1 - progress);
  }
}

function animateStack(items: HTMLElement[], centerX: number, baseY: number, p: number) {
  if (!items.length) return;
  const cardW = items[0].offsetWidth || 280;

  const mid = (items.length - 1) / 2;
  const SPREAD_X = 300;
  const SPREAD_R = 22;
  const LIFT_Y   = 60;
  const SCALE_FROM = 0.5, SCALE_TO = 1;

  items.forEach((el, idx) => {
    const k = idx - mid;
    const iRot = k * 2.5;
    const iX   = 0;
    const iY   = 100 + k * -5;

    const fRot = k * SPREAD_R;
    const fX   = centerX + k * SPREAD_X;
    const fY   = baseY + Math.abs(k) * -LIFT_Y;

    const curRot = iRot + (fRot - iRot) * p;
    const curX   = iX   + (fX   - iX)   * p;
    const curY   = iY   + (fY   - iY)   * p;
    const curS   = SCALE_FROM + (SCALE_TO - SCALE_FROM) * p;

    el.style.transform = `translateX(${curX - cardW/2}px) translateY(${curY}px) rotate(${curRot}deg) scale(${curS})`;
  });
}

// --- Event Listeners & Initialization ---
canvas.addEventListener('click', (e) => {
    if (isPaused || isTransitioning) return;
    const sceneName = scenes[currentSceneIndex];
    if (sceneName === 'bacteria') {
        foodParticles.push(new FoodParticle(e.clientX, e.clientY));
        greenTintLevel = Math.min(0.4, greenTintLevel + 0.05);
    } else if (sceneName === 'space') {
        if (!blackHole) {
            blackHole = new BlackHole(e.clientX, e.clientY);
        }
    } else if (sceneName === 'immune') {
        if (!isImmuneGameOver) {
             viruses.push(new Virus(e.clientX, e.clientY));
             sicknessLevel = Math.min(0.8, sicknessLevel + 0.08);
        }
    }
});

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    isTransitioning = false;
    transitionAlpha = 0;
    initScene();
    handlePapersScroll();
});

const coverMap: Record<string, string> = {
  "Final_Cover_Submission-01.png": new URL("./Assets/Covers/Final_Cover_Submission-01.png", import.meta.url).href,
  "Final_Cover_Submission-02.png": new URL("./Assets/Covers/Final_Cover_Submission-02.png", import.meta.url).href,
  "NatAging_Cover.png":             new URL("./Assets/Covers/NatAging_Cover.png", import.meta.url).href,
  "TPE_Cover.png":                  new URL("./Assets/Covers/TPE_Cover.png", import.meta.url).href,
  "SubstrateStiffness.png":         new URL("./Assets/Covers/SubstrateStiffness.png", import.meta.url).href,
  "ImmunologicalBiomarkers.png":         new URL("./Assets/Covers/ImmunologicalBiomarkers.png", import.meta.url).href,
  "CellReportsAD.png":         new URL("./Assets/Covers/CellReportsAD.png", import.meta.url).href,
  "GastroenterologyDDW2025.png":         new URL("./Assets/Covers/GastroenterologyDDW2025.png", import.meta.url).href,
};

document.querySelectorAll<HTMLElement>(".paper").forEach(p => {
  const file = p.dataset.cover;
  if (!file) return;
  const url = coverMap[file];
  const inner = p.querySelector<HTMLElement>(".paper-inner");
  if (inner && url) inner.style.backgroundImage = `url(${url})`;
});

document.querySelectorAll<HTMLElement>('.paper').forEach(card => {
    const targetId = card.dataset.id;
    if (!targetId) return;
    card.addEventListener('click', () => {
      const target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });  

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        if (!isPaused) { isPaused = true; canvas.classList.add('blurred'); }
    } else {
        if (isPaused) { isPaused = false; canvas.classList.remove('blurred'); }
    }
    handlePapersScroll();
});

initScene();
animate();
handlePapersScroll();
setInterval(() => {
    if (!isPaused) switchScene();
}, 15000);
