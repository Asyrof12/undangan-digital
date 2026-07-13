// Initialize Lenis Smooth Scroll
const lenis = new Lenis();
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Particles.js for Gold Dust
particlesJS("particles-js", {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#C8A44D" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 1.5, direction: "bottom", random: true, straight: false, out_mode: "out" }
    }
});

// Split text for reveal animation
document.querySelectorAll('.reveal-text').forEach(text => {
    const originalText = text.innerText;
    text.innerHTML = '';
    originalText.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerText = char === ' ' ? '\u00A0' : char;
        text.appendChild(span);
    });
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Opening Animation
const openTl = gsap.timeline();
openTl.set(".reveal-text span", { yPercent: 100 });
openTl.to(".reveal-text span", {
    yPercent: 0,
    stagger: 0.05,
    duration: 0.8,
    ease: "power4.out"
});

// Floating & Morphing Gunungan
gsap.to(".gunungan-img", {
    y: -20,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});

gsap.to(".gunungan-img path", {
    strokeDashoffset: 0,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
});

// Buka Undangan Logic
const btnOpen = document.getElementById('btn-open');
const bgMusic = document.getElementById('bg-music');

btnOpen.addEventListener('click', () => {
    // Play Music
    bgMusic.play().catch(() => console.log("Music play blocked by browser"));
    
    // Reveal Transitions
    gsap.to(".curtain-left", { xPercent: -100, duration: 2, ease: "power4.inOut" });
    gsap.to(".curtain-right", { xPercent: 100, duration: 2, ease: "power4.inOut" });
    gsap.to(".opening-content", { y: -100, opacity: 0, duration: 1, ease: "power4.inOut" });
    gsap.to("#opening-screen", { 
        pointerEvents: 'none',
        opacity: 0,
        delay: 1.5,
        duration: 1,
        onComplete: () => {
            document.getElementById('opening-screen').style.display = 'none';
            document.body.style.overflowY = 'auto';
            animateHero();
            gsap.to("#main-nav", { visibility: 'visible', opacity: 1, duration: 1 });
        }
    });
});

function animateHero() {
    gsap.from(".hero-content", {
        scale: 0.8,
        opacity: 0,
        duration: 2,
        ease: "power4.out"
    });
    gsap.from(".couple-frame", {
        y: 50,
        opacity: 0,
        duration: 1.5,
        delay: 0.5
    });
}

// Section Animations (Diversified)
const sectionConfigs = [
    { id: '#mempelai', anim: { y: 100, opacity: 0, duration: 1.2 } },
    { id: '#countdown', anim: { scale: 0.5, opacity: 0, duration: 1 } },
    { id: '#story', anim: { x: -100, opacity: 0, duration: 1.5 } },
    { id: '#galeri', anim: { y: 50, opacity: 0, stagger: 0.1, duration: 1 } },
    { id: '#acara', anim: { x: 100, rotate: 5, opacity: 0, duration: 1.2 } },
    { id: '#gift', anim: { y: 100, opacity: 0, duration: 1 } },
    { id: '#rsvp', anim: { scale: 1.1, opacity: 0, duration: 1 } },
    { id: '#ucapan', anim: { y: 50, opacity: 0, duration: 1 } }
];

sectionConfigs.forEach(config => {
    gsap.from(config.id + " > *", {
        scrollTrigger: {
            trigger: config.id,
            start: "top 80%",
            toggleActions: "play none none none"
        },
        ...config.anim,
        ease: "power3.out"
    });
});

// Countdown Logic with Flip effect
const targetDate = new Date("Dec 12, 2026 09:00:00").getTime();
function updateCountdown() {
    const now = new Date().getTime();
    const gap = targetDate - now;

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const d = Math.floor(gap / day);
    const h = Math.floor((gap % day) / hour);
    const m = Math.floor((gap % hour) / minute);
    const s = Math.floor((gap % minute) / second);

    setWithFlip('days', d);
    setWithFlip('hours', h);
    setWithFlip('minutes', m);
    setWithFlip('seconds', s);
}

function setWithFlip(id, val) {
    const el = document.getElementById(id);
    if (el.innerText !== val.toString()) {
        el.innerText = val.toString().padStart(2, '0');
        el.classList.remove('flip-num');
        void el.offsetWidth; // trigger reflow
        el.classList.add('flip-num');
    }
}
setInterval(updateCountdown, 1000);

// Copy to Clipboard Logic
document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const textToCopy = document.getElementById(targetId).innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = btn.innerText;
            btn.innerText = "Tersalin!";
            btn.style.background = "var(--emerald)";
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = "var(--grad-gold)";
            }, 2000);
        });
    });
});

// Magnetic Button Effect
const magneticBtns = document.querySelectorAll('.btn-gold');
magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    });
});

// Ripple Effect for Buttons
magneticBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        let ripples = document.createElement('span');
        ripples.style.left = x + 'px';
        ripples.style.top = y + 'px';
        ripples.classList.add('ripple');
        this.appendChild(ripples);
        setTimeout(() => { ripples.remove(); }, 1000);
    });
});
