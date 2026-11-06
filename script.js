// Indique au CSS que JavaScript fonctionne (évite des sections invisibles sans JS)
document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 1. Apparition des sections au scroll */
const sections = document.querySelectorAll('main section');
sections.forEach((s) => s.classList.add('reveal'));

if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  sections.forEach((s) => revealObserver.observe(s));
} else {
  sections.forEach((s) => s.classList.add('visible'));
}

/* 2. Effet machine à écrire */
const typingEl = document.getElementById('typing');
if (typingEl && !reduceMotion) {
  const words = ['Junior web developer', 'HTML & CSS enthusiast', 'Fast learner'];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const type = () => {
    const word = words[wordIndex];
    typingEl.textContent = word.slice(0, charIndex);

    if (!deleting && charIndex < word.length) {
      charIndex++;
    } else if (deleting && charIndex > 0) {
      charIndex--;
    } else if (!deleting) {
      deleting = true;
      return setTimeout(type, 1500); // pause à la fin du mot
    } else {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
    setTimeout(type, deleting ? 50 : 100);
  };
  type();
}

/* 3. Lien actif dans la navigation */
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]:not(.btn-dark)');
const watched = document.querySelectorAll('header[id], section[id]');

if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  watched.forEach((s) => navObserver.observe(s));
}

/* 4. Mode sombre (mémorisé, avec la préférence du système par défaut) */
const toggle = document.getElementById('theme-toggle');

const applyTheme = (dark) => {
  document.body.classList.toggle('dark', dark);
  if (toggle) toggle.textContent = dark ? '☀️' : '🌙';
};

let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) { /* stockage indisponible */ }

applyTheme(saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);

if (toggle) {
  toggle.addEventListener('click', () => {
    const dark = !document.body.classList.contains('dark');
    applyTheme(dark);
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) { /* ignoré */ }
  });
}

/* 5. Année automatique dans le footer */
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();


// const splash = document.getElementById('splash');
// const site = document.getElementById('site');
// const startBtn = document.getElementById('get-started');
// const canvas = document.getElementById('particles');
// const ctx = canvas.getContext('2d');

// document.body.style.overflow = 'hidden';

// /* --- Particules reliées entre elles --- */
// let particles = [];
// let animId;

// function resizeCanvas() {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     const count = Math.min(80, Math.floor(canvas.width / 18));
//     particles = Array.from({ length: count }, () => ({
//         x: Math.random() * canvas.width,
//         y: Math.random() * canvas.height,
//         vx: (Math.random() - 0.5) * 0.5,
//         vy: (Math.random() - 0.5) * 0.5,
//         r: Math.random() * 2 + 1
//     }));
// }

// function drawParticles() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     particles.forEach((p, i) => {
//         p.x += p.vx;
//         p.y += p.vy;
//         if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
//         if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

//         ctx.beginPath();
//         ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
//         ctx.fillStyle = 'rgba(255,255,255,0.7)';
//         ctx.fill();

//         for (let j = i + 1; j < particles.length; j++) {
//             const q = particles[j];
//             const dist = Math.hypot(p.x - q.x, p.y - q.y);
//             if (dist < 120) {
//                 ctx.beginPath();
//                 ctx.moveTo(p.x, p.y);
//                 ctx.lineTo(q.x, q.y);
//                 ctx.strokeStyle = `rgba(181,224,45,${0.25 * (1 - dist / 120)})`;
//                 ctx.lineWidth = 1;
//                 ctx.stroke();
//             }
//         }
//     });
//     animId = requestAnimationFrame(drawParticles);
// }

// resizeCanvas();
// drawParticles();
// window.addEventListener('resize', resizeCanvas);

// /* --- Spot lumineux qui suit la souris --- */
// splash.addEventListener('mousemove', (e) => {
//     splash.style.setProperty('--mx', e.clientX + 'px');
//     splash.style.setProperty('--my', e.clientY + 'px');
// });

// /* --- Clic sur Get Started --- */
// startBtn.addEventListener('click', () => {
//     site.classList.remove('hidden');
//     splash.classList.add('fade-out');
//     document.body.style.overflow = '';
//     setTimeout(() => {
//         cancelAnimationFrame(animId);
//         splash.remove();
//     }, 800);
// });


const splash = document.getElementById('splash');
const site = document.getElementById('site');
const startBtn = document.getElementById('get-started');
const hero = document.getElementById('home');

document.body.style.overflow = 'hidden';

/* --- Particules reliées (réutilisable) --- */
function startParticles(canvas) {
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    let particles = [];
    let animId;

    function resize() {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
        const count = Math.min(80, Math.floor(canvas.width / 18));
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            r: Math.random() * 2 + 1
        }));
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dist = Math.hypot(p.x - q.x, p.y - q.y);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(181,224,45,${0.25 * (1 - dist / 120)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        });
        animId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', resize);
    };
}

/* --- Spot lumineux qui suit la souris --- */
function trackMouse(el) {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        el.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
}

/* --- Splash --- */
const stopSplashParticles = startParticles(document.getElementById('particles'));
trackMouse(splash);
trackMouse(hero);

/* --- Clic sur Get Started --- */
startBtn.addEventListener('click', () => {
    site.classList.remove('hidden');
    startParticles(document.getElementById('hero-particles')); // lance les particules du hero
    splash.classList.add('fade-out');
    document.body.style.overflow = '';
    setTimeout(() => {
        stopSplashParticles();
        splash.remove();
    }, 800);
});
/* --- Menu hamburger --- */
const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
const navbar = document.querySelector('.navbar');

function toggleMenu(forceState) {
    const open = typeof forceState === 'boolean'
        ? forceState
        : !menu.classList.contains('open');

    menu.classList.toggle('open', open);
    menuBtn.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.style.overflow = open ? 'hidden' : '';
}

menuBtn.addEventListener('click', () => toggleMenu());

// Ferme le menu quand on clique sur un lien
menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
});

// Ferme avec la touche Échap
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(false);
});

// Fond sombre de la navbar après un peu de scroll
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
});