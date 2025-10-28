const categories = ['emf','rad','easel','uv','thermal'];

    function uncheckOthers(name, current){
      document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
        if(cb !== current) cb.checked = false;
      });
    }

    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', e => {
        if(e.target.checked) uncheckOthers(e.target.name, e.target);
      });
    });

    function showSummary(){
      const result = [];
      categories.forEach(cat => {
        const checked = document.querySelector(`input[name="${cat}"]:checked`);
        if(checked){
          result.push(`${cat.toUpperCase()}: Stufe ${checked.value}`);
        } else {
          result.push(`${cat.toUpperCase()}: —`);
        }
      });
      document.getElementById('summary').style.display = 'block';
      document.getElementById('summary').innerHTML = '<strong>Zusammenfassung:</strong><br>' + result.join('<br>');
    }

    function resetForm(){
      document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
      document.getElementById('summary').style.display = 'none';
    }

    // Farbverwaltung
    function applyColors(){
      const bg = localStorage.getItem('bgColor') || '#0a0f1a';
      const text = localStorage.getItem('textColor') || '#e2e8f0';
      const accent = localStorage.getItem('accentColor') || '#7c3aed';
      document.body.style.background = bg;
      document.body.style.color = text;
      document.querySelectorAll('.category').forEach(c => c.style.background = shadeColor(bg, 10));
      document.querySelectorAll('h2').forEach(h => h.style.color = accent);
      document.querySelectorAll('button').forEach(b => b.style.background = accent);
    }

    function shadeColor(color, percent) {
      let R = parseInt(color.substring(1,3),16);
      let G = parseInt(color.substring(3,5),16);
      let B = parseInt(color.substring(5,7),16);
      R = parseInt(R * (100 + percent) / 100);
      G = parseInt(G * (100 + percent) / 100);
      B = parseInt(B * (100 + percent) / 100);
      R = (R<255)?R:255; G = (G<255)?G:255; B = (B<255)?B:255;
      return `#${(R.toString(16).padStart(2,'0'))}${(G.toString(16).padStart(2,'0'))}${(B.toString(16).padStart(2,'0'))}`;
    }

    function togglePanel(){
      const panel = document.getElementById('colorPanel');
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    ['bgColor','textColor','accentColor'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', e => {
        localStorage.setItem(id, e.target.value);
        applyColors();
      });
    });

    window.addEventListener("load", () => {
        ['bgColor','textColor','accentColor'].forEach(id => {
            const el = document.getElementById(id);
            if(el && localStorage.getItem(id)) el.value = localStorage.getItem(id);
        });
        applyColors();

    });

    // Farben auf Standard zurücksetzen
    document.getElementById('resetColors')?.addEventListener('click', () => {
        // Standardwerte definieren
        const defaults = {
            bgColor: '#0a0f1a',
            textColor: '#e2e8f0',
            accentColor: '#7c3aed'
        };

        // LocalStorage zurücksetzen
        Object.entries(defaults).forEach(([key, value]) => {
            localStorage.setItem(key, value);
            const el = document.getElementById(key);
            if (el) el.value = value;
        });

        // Farben anwenden
        applyColors();
    });

// Stabiler, mobiler Sternenhintergrund
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d', { alpha: true });

let stars = [];
const numStars = 180;
let width, height;
let scrollOffset = 0;
let targetOffset = 0;

function getViewportSize() {
  const vp = window.visualViewport;
  return {
    width: vp ? vp.width : window.innerWidth,
    height: vp ? vp.height : window.innerHeight
  };
}

function resizeCanvas() {
  const { width: w, height: h } = getViewportSize();
  width = w;
  height = h;
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  generateStars();
}

function generateStars() {
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.3 + 0.2,
      alpha: Math.random() * 0.8 + 0.2,
      depth: -Math.random() * 0.4 + 0.1 // beeinflusst Parallax
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);
  for (let s of stars) {
    const y = (s.y + scrollOffset * s.depth) % height;
    const yy = y < 0 ? y + height : y;
    ctx.globalAlpha = s.alpha;
    ctx.beginPath();
    ctx.arc(s.x, yy, s.r, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function animate() {
  scrollOffset += (targetOffset - scrollOffset) * 0.08;
  drawStars();
  requestAnimationFrame(animate);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('scroll', () => {
  targetOffset = window.scrollY;
}, { passive: true });

// Initialisierung
resizeCanvas();
animate();

