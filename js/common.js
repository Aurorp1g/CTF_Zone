const hamburger = document.querySelector('.hamburger');
const navMenu   = document.querySelector('.nav-menu');
hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(13, 15, 24, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(13, 15, 24, 0.75)';
        navbar.style.backdropFilter = 'blur(12px)';
    }
});

(() => {
  const target = document.getElementById('footer-copyright');
  if (!target) return;

const text = '\u00A9 2024 BY Aurorp1g. \u00A0 From FosuSec Crypto.';
  let i = 0;

  function typeChar() {
    if (i < text.length) {
      target.textContent += text[i++];
      setTimeout(typeChar, 80); 
    }
  }
  typeChar();
})();