// ═══════════════════════════════════════════════
// Daniel Trajano — Portfolio | script.js
// ═══════════════════════════════════════════════

const sections = document.querySelectorAll('section');
  const links    = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 80) current = sec.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });

let lbImages = [];
  let lbIndex  = 0;

  function openLightbox(src, alt) {
    // collect all gallery images
    // Only show images from the same project gallery
    var clickedImg = Array.from(document.querySelectorAll('[data-gallery] img')).find(i => i.src === src);
    var gallery = clickedImg ? clickedImg.closest('[data-gallery]') : null;
    lbImages = Array.from((gallery || document).querySelectorAll('img')).map(i => ({src: i.src, alt: i.alt}));
    lbIndex  = lbImages.findIndex(i => i.src === src);
    if (lbIndex < 0) lbIndex = 0;
    renderLightbox();
    const lb = document.getElementById('lightbox');
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function renderLightbox() {
    document.getElementById('lb-img').src     = lbImages[lbIndex].src;
    document.getElementById('lb-img').alt     = lbImages[lbIndex].alt;
    document.getElementById('lb-caption').textContent = lbImages[lbIndex].alt;
    // dots
    const dots = document.getElementById('lb-dots');
    dots.innerHTML = lbImages.map((_, i) =>
      `<span onclick="event.stopPropagation();lbGoTo(${i})" style="
        width:${i===lbIndex?'20px':'8px'};height:8px;border-radius:4px;
        background:${i===lbIndex?'var(--accent)':'rgba(255,255,255,0.25)'};
        cursor:pointer;transition:all .25s;display:inline-block;
      "></span>`
    ).join('');
  }

  function lbNavigate(dir) {
    lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
    const img = document.getElementById('lb-img');
    img.style.animation = 'none';
    img.offsetHeight;
    img.style.animation = 'lbZoomIn 0.2s ease';
    renderLightbox();
  }

  function lbGoTo(i) { lbIndex = i; renderLightbox(); }

  function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (lb.style.display === 'none') return;
    if (e.key === 'ArrowRight') lbNavigate(1);
    if (e.key === 'ArrowLeft')  lbNavigate(-1);
    if (e.key === 'Escape')     closeLightbox();
  });

function openGifLightbox(container) {
    var img = container.querySelector('.gif-thumb');
    var gifSrc = img.dataset.gif;
    var alt = img.alt || 'Jogo';
    // Collect all GIF srcs from proj-games gallery
    lbImages = Array.from(
      document.querySelectorAll('[data-gallery="proj-games"] .gif-thumb')
    ).map(function(i){ return { src: i.dataset.gif, alt: i.alt || 'Jogo' }; });
    lbIndex = lbImages.findIndex(function(i){ return i.src === gifSrc; });
    if(lbIndex < 0) lbIndex = 0;
    renderLightbox();
    var lb = document.getElementById('lightbox');
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

// ─────────────────────────────────
// Theme, Nav & Lightbox Handlers
// ─────────────────────────────────

// ── Toggle ──
  function toggleTheme() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    var next = dark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setIcon(next === 'dark');
  }

  function setIcon(isDark) {
    var moon = document.getElementById('icon-moon');
    var sun  = document.getElementById('icon-sun');
    if (!moon || !sun) return;
    moon.style.display = isDark ? 'block' : 'none';
    sun.style.display  = isDark ? 'none'  : 'block';
  }

  // ── Sync icon after DOM ready ──
  document.addEventListener('DOMContentLoaded', function() {
    setIcon(document.documentElement.getAttribute('data-theme') === 'dark');
  });

  // ── Nav scroll ──
  window.addEventListener('scroll', function() {
    var sections = document.querySelectorAll('section');
    var links = document.querySelectorAll('.nav-links a');
    var current = '';
    sections.forEach(function(s){ if(window.scrollY >= s.offsetTop - 80) current = s.id; });
    links.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href') === '#'+current); });
  });

  // ── Lightbox keyboard ──
  document.addEventListener('keydown', function(e) {
    var lb = document.getElementById('lightbox');
    if (!lb || lb.style.display === 'none') return;
    if (e.key === 'ArrowRight') lbNavigate(1);
    if (e.key === 'ArrowLeft')  lbNavigate(-1);
    if (e.key === 'Escape')     closeLightbox();
  });

  // ── Lightbox touch swipe ──
  var _tx = 0, _ty = 0;
  document.addEventListener('DOMContentLoaded', function(){
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.addEventListener('touchstart', function(e){ _tx=e.touches[0].clientX; _ty=e.touches[0].clientY; },{passive:true});
    lb.addEventListener('touchend', function(e){
      if(lb.style.display==='none') return;
      var dx=e.changedTouches[0].clientX-_tx, dy=e.changedTouches[0].clientY-_ty;
      if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>25){ dx<0?lbNavigate(1):lbNavigate(-1); }
    },{passive:true});
  });