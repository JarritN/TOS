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

    // 🎨 Farbverwaltung
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