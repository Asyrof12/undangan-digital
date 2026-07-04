/* ========================================
   SCRIPT.JS — Undangan Digital
   NO GSAP DEPENDENCY — Pure JS & CSS
======================================== */

// =====================
// 1. PARTICLES
// =====================
particlesJS("particles-js", {
    particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: "#C8A44D" },
        shape: { type: "circle" },
        opacity: { value: 0.35, random: true, anim: { enable: true, speed: 0.5, opacity_min: 0.1 } },
        size: { value: 2.5, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 0.8, direction: "none", random: true, out_mode: "out" }
    },
    interactivity: { detect_on: "canvas", events: { onhover: { enable: false }, onclick: { enable: false } } }
});

// =====================
// 2. OPENING SCREEN
// =====================
const openingScreen = document.getElementById('opening-screen');
const btnOpen       = document.getElementById('btn-open');
const mainContent   = document.getElementById('main-content');
const mainNav       = document.getElementById('main-nav');
const musicBtn      = document.getElementById('music-btn');
const bgMusic       = document.getElementById('bg-music');

// Prevent scroll on open
document.body.style.overflow = 'hidden';

btnOpen.addEventListener('click', () => {
    // Play music
    bgMusic.volume = 0.4;
    bgMusic.play().catch(() => {});

    // Step 1: Curtains start opening
    openingScreen.classList.add('open');

    // Step 2: After short delay, start fading in main content
    // (so it appears gracefully as curtains slide away)
    setTimeout(() => {
        document.body.style.overflow = '';
        mainContent.classList.add('visible');

        // Trigger reveal for hero elements right as content fades in
        document.querySelectorAll('#hero .reveal').forEach(el => {
            el.classList.add('visible');
        });
    }, 800);

    // Step 3: After curtains fully open, fade out & remove opening screen
    setTimeout(() => {
        openingScreen.style.transition = 'opacity 0.6s ease';
        openingScreen.style.opacity = '0';
        openingScreen.style.pointerEvents = 'none';

        setTimeout(() => {
            openingScreen.style.display = 'none';
        }, 600);

        // Show nav & music button
        mainNav.classList.add('show');
        musicBtn.classList.add('show');
        musicBtn.classList.add('playing');
    }, 2000);
});

// =====================
// 3. MUSIC TOGGLE
// =====================
musicBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicBtn.classList.add('playing');
    } else {
        bgMusic.pause();
        musicBtn.classList.remove('playing');
    }
});

// =====================
// 4. INTERSECTION OBSERVER — Reveal on scroll
// =====================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
});

// =====================
// 5. ACTIVE NAV
// =====================
const sections = document.querySelectorAll('section, footer');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
        }
    });
}, { threshold: 0.5 });

sections.forEach(s => navObserver.observe(s));

// =====================
// 6. COUNTDOWN
// =====================
const weddingDate = new Date('2026-12-12T09:00:00').getTime();

function updateCountdown() {
    const now  = Date.now();
    const diff = weddingDate - now;

    if (diff <= 0) {
        ['days','hours','minutes','seconds'].forEach(id => {
            document.getElementById(id).textContent = '00';
        });
        return;
    }

    const d  = Math.floor(diff / 86400000);
    const h  = Math.floor((diff % 86400000) / 3600000);
    const m  = Math.floor((diff % 3600000) / 60000);
    const s  = Math.floor((diff % 60000) / 1000);

    const pad = n => String(n).padStart(2, '0');

    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el && el.textContent !== pad(val)) {
            el.textContent = pad(val);
            el.style.animation = 'none';
            el.offsetHeight; // reflow
            el.style.animation = 'flipNum 0.4s ease';
        }
    };

    setVal('days',    d);
    setVal('hours',   h);
    setVal('minutes', m);
    setVal('seconds', s);
}

// Add flip animation via style tag
const flipStyle = document.createElement('style');
flipStyle.textContent = `
@keyframes flipNum {
    0%   { opacity: 0.3; transform: translateY(-8px); }
    100% { opacity: 1;   transform: translateY(0); }
}
`;
document.head.appendChild(flipStyle);

setInterval(updateCountdown, 1000);
updateCountdown();

// =====================
// 7. COPY TO CLIPBOARD
// =====================
document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const text = document.getElementById(targetId).textContent.replace(/\s/g, '');

        navigator.clipboard.writeText(text).then(() => {
            const orig = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
            this.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
            setTimeout(() => {
                this.innerHTML = orig;
                this.style.background = '';
            }, 2500);
        }).catch(() => {
            // fallback for browsers that don't support clipboard API
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        });
    });
});

// =====================
// 8. RSVP FORM
// =====================
const rsvpForm = document.getElementById('rsvp-form');
if (rsvpForm) {
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name   = document.getElementById('rsvp-name').value.trim();
        const attend = document.getElementById('rsvp-attend').value;
        const count  = document.getElementById('rsvp-count').value;

        if (!name) return;

        const statusMap = { hadir: 'Hadir', ragu: 'Belum Pasti', tidak: 'Tidak Hadir' };
        alert(`Terima kasih, ${name}!\nStatus: ${statusMap[attend]}\nJumlah tamu: ${count}\n\nKonfirmasi Anda telah diterima 🙏`);
        rsvpForm.reset();
    });
}

// =====================
// 9. UCAPAN FORM
// =====================
const ucapanForm = document.getElementById('ucapan-form');
const ucapanList = document.getElementById('ucapan-list');

if (ucapanForm) {
    ucapanForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('ucapan-name').value.trim();
        const text = document.getElementById('ucapan-text').value.trim();

        if (!name || !text) return;

        const initial = name.charAt(0).toUpperCase();

        const item = document.createElement('div');
        item.className = 'ucapan-item glass-card';
        item.style.animation = 'slideInUp 0.5s ease';
        item.innerHTML = `
            <div class="ucapan-avatar">${initial}</div>
            <div class="ucapan-body">
                <strong>${name}</strong>
                <span class="ucapan-status hadir">Baru</span>
                <p>"${text}"</p>
            </div>
        `;

        ucapanList.prepend(item);
        ucapanForm.reset();
        ucapanList.scrollTop = 0;
    });
}

const slideStyle = document.createElement('style');
slideStyle.textContent = `
@keyframes slideInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(slideStyle);

// =====================
// 10. GALLERY LIGHTBOX (simple)
// =====================
document.querySelectorAll('.gallery-img').forEach(img => {
    img.addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; inset: 0; z-index: 9999;
            background: rgba(0,0,0,0.92);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; animation: fadeIn 0.3s ease;
            padding: 2rem;
        `;
        const bigImg = document.createElement('img');
        bigImg.src = img.src.replace('w=600', 'w=1200');
        bigImg.style.cssText = 'max-width: 100%; max-height: 90vh; border-radius: 12px; border: 2px solid rgba(200,164,77,0.4);';
        overlay.appendChild(bigImg);
        overlay.addEventListener('click', () => overlay.remove());
        document.body.appendChild(overlay);
    });
});

const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
@keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
}
`;
document.head.appendChild(fadeStyle);

console.log('✅ Undangan Digital — Script loaded successfully');
