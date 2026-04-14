
  let activeTag = null;

  function renderCloud() {
    const cloud = document.getElementById('glosario-cloud');
    const tags = ['RFC y SAT','CFDI y facturación','Impuestos (ISR, IVA)','Nómina y empleados','Deducciones','Trámites digitales'];
    cloud.innerHTML = tags.map(t => '<div class="cloud-tag" onclick="filterByTag(\''+t+'\',this)">'+t+'</div>').join('');
  }

  function filterByTag(tag, el) {
    if(activeTag === tag) { activeTag = null; el.classList.remove('active'); renderGlosario(null); }
    else {
      document.querySelectorAll('.cloud-tag').forEach(t => t.classList.remove('active'));
      el.classList.add('active');
      activeTag = tag;
      const map = {
        'RFC y SAT': ['RFC','SAT','CIF','e.firma','Buzón Tributario'],
        'CFDI y facturación': ['CFDI','Retención','Nómina'],
        'Impuestos (ISR, IVA)': ['ISR','IVA','Declaración Anual','Declaración Mensual'],
        'Nómina y empleados': ['IMSS','Nómina','Retención'],
        'Deducciones': ['Deducible','Actividad Empresarial','RESICO'],
        'Trámites digitales': ['e.firma','CIF','Buzón Tributario','Contabilidad Electrónica','Régimen Fiscal']
      };
      const show = map[tag] || null;
      renderGlosario(show);
    }
  }

  function renderGlosario(showTerms) {
    const list = document.getElementById('glosario-list');
    if(!list) return;
    list.innerHTML = '';
    const toShow = showTerms ? terminos.filter(t => showTerms.includes(t.term)) : terminos;
    toShow.forEach((t) => {
      const actualIdx = terminos.indexOf(t);
      const item = document.createElement('div');
      item.className = 'glosario-item';
      item.innerHTML = '<div class="glosario-row" onclick="toggleGlosario('+actualIdx+',this.parentElement)"><div class="glosario-term-row">'+t.term+'<span>'+t.abbr+'</span></div><div class="glosario-arrow">▼</div></div><div class="glosario-body"><div class="glosario-def">'+t.def+'</div>'+(t.tip ? '<div class="glosario-tip"><strong>💡</strong> '+t.tip.replace('Tip: ','')+'</div>' : '')+'</div>';
      list.appendChild(item);
    });
  }

  function toggleGlosario(idx, el) {
    const wasOpen = el.classList.contains('open');
    document.querySelectorAll('.glosario-item.open').forEach(i => i.classList.remove('open'));
    if(!wasOpen) el.classList.add('open');
  }

  renderCloud();
  renderGlosario(null);
