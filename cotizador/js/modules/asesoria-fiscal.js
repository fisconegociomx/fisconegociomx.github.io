// ============================================================
// MÓDULO: ASESORÍA FISCAL
// Flujo separado del cotizador de Servicios Mensuales
// ============================================================

window.AF = {
  tipo: null,          // 'puntual' | 'mensual' | 'proyecto' | 'revision'
  contribuyente: null, // 'pf' | 'pm'
  regimen: null,       // depending on contribuyente
  rfcStatus: null,     // 'al_corriente' | 'con_avisos' | 'vencido' | 'sin_alta'
  avisosSat: [],       // array of selected aviso ids
  urgencia: null,     // 'normal' | 'prioritaria' | 'urgente'
  // Detalle por tipo
  temasPuntual: [],    // for puntual
  nivelMensual: null,  // for mensual: 'esencial' | 'profesional' | 'premium'
  tipoProyecto: null,   // for proyecto
  alcanceRevision: null, // for revision
  // Cliente
  cliente: {},
  // Pricing
  precioBase: 0,
  multiplicador: 1,
  total: 0
};

// ── INIT ──────────────────────────────────────────────────────────────────────
function initAsesoria() {
  hideAllSections();
  document.getElementById('asesoria-flow').style.display = 'block';
  document.getElementById('af-steps').style.display = 'block';
  updateAFSteps(1);
  renderAF1();
}

// ── STEP 1: TIPO DE ASESORÍA ─────────────────────────────────────────────────
function renderAF1() {
  const content = document.getElementById('af-content');
  content.innerHTML = '';
  content.innerHTML = `
    <div class="sec-label">Paso 1 de 4 — Asesoría Fiscal</div>
    <div class="sec-title">¿Qué tipo de asesoría necesitas?</div>
    <div class="sec-sub">Cada modalidad tiene alcance, duración y precio diferente.</div>
    <div class="regime-grid">
      <div class="r-card" onclick="pickTipoAsesoria('puntual')">
        <div class="r-icon">🎯</div>
        <div class="r-name">Puntual</div>
        <div class="r-desc">Consulta o problema específico. Resuelve tu duda en una sesión.</div>
        <span class="r-who" style="color:var(--green)">Desde $500 MXN</span>
      </div>
      <div class="r-card" onclick="pickTipoAsesoria('mensual')">
        <div class="r-icon">📅</div>
        <div class="r-name">Mensual</div>
        <div class="r-desc">Soporte fiscal continuo. Ideal para resolver dudas frecuentes.</div>
        <span class="r-who" style="color:var(--green)">Desde $1,200 MXN/mes</span>
      </div>
      <div class="r-card" onclick="pickTipoAsesoria('proyecto')">
        <div class="r-icon">📋</div>
        <div class="r-name">Proyecto</div>
        <div class="r-desc">Implementación o análisis extenso. Plazos definidos y entregables.</div>
        <span class="r-who" style="color:var(--green)">Desde $800 MXN</span>
      </div>
      <div class="r-card" onclick="pickTipoAsesoria('revision')">
        <div class="r-icon">🔍</div>
        <div class="r-name">Revisión</div>
        <div class="r-desc">Auditoría o revisión de situación fiscal. Diagnóstico completo.</div>
        <span class="r-who" style="color:var(--green)">Desde $1,500 MXN</span>
      </div>
    </div>
    <div class="nav">
      <button class="btn-back" onclick="goBackToMenu()">← Menú principal</button>
      <button class="btn-next" id="af1-next" disabled onclick="renderAF2()">Siguiente →</button>
    </div>
  `;
}

function pickTipoAsesoria(tipo) {
  window.AF.tipo = tipo;
  var btn = document.getElementById('af1-next');
  if (btn) {
    btn.disabled = false;
    btn.textContent = 'Siguiente →';
  }
}

// ── STEP 2: RÉGIMEN Y CONTEXTO ───────────────────────────────────────────────
function renderAF2() {
  updateAFSteps(2);
  const content = document.getElementById('af-content');
  content.innerHTML = '';
  let regimenOptions = '';

  if (window.AF.contribuyente === 'pf') {
    regimenOptions = `
      <div class="regime-grid" style="margin-bottom:16px">
        <div class="r-card${window.AF.regimen==='resico'?' sel':''}" onclick="pickAFRegimen('resico')">
          <div class="r-icon">🧾</div><div class="r-name">RESICO</div>
          <div class="r-desc">Régimen Simplificado de Confianza. Tasas desde 1%.</div>
        </div>
        <div class="r-card${window.AF.regimen==='actividad_empresarial'?' sel':''}" onclick="pickAFRegimen('actividad_empresarial')">
          <div class="r-icon">💼</div><div class="r-name">Actividad Empresarial</div>
          <div class="r-desc">Negocios propios, venta de bienes o prestación de servicios.</div>
        </div>
        <div class="r-card${window.AF.regimen==='plataformas'?' sel':''}" onclick="pickAFRegimen('plataformas')">
          <div class="r-icon">📱</div><div class="r-name">Plataformas Digitales</div>
          <div class="r-desc">Uber, Airbnb, Rappi, MercadoLibre, Amazon y otras.</div>
        </div>
        <div class="r-card${window.AF.regimen==='honorarios'?' sel':''}" onclick="pickAFRegimen('honorarios')">
          <div class="r-icon">🎓</div><div class="r-name">Servicios Profesionales</div>
          <div class="r-desc">Actividad profesional independiente (honorarios).</div>
        </div>
      </div>`;
  } else {
    regimenOptions = `
      <div class="regime-grid" style="margin-bottom:16px">
        <div class="r-card${window.AF.regimen==='general_pm'?' sel':''}" onclick="pickAFRegimen('general_pm')">
          <div class="r-icon">🏢</div><div class="r-name">General de Ley — PM</div>
          <div class="r-desc">S.A. de C.V., S. de R.L., A.C. y similares.</div>
        </div>
        <div class="r-card${window.AF.regimen==='simplificado'?' sel':''}" onclick="pickAFRegimen('simplificado')">
          <div class="r-icon">📊</div><div class="r-name">Régimen Simplificado de Confianza</div>
          <div class="r-desc">Personas morales con ingresos hasta $35M anuales.</div>
        </div>
      </div>`;
  }

  const rfcStatusOptions = `
    <div class="regime-grid">
      <div class="r-card${window.AF.rfcStatus==='al_corriente'?' sel':''}" onclick="pickAFRFCStatus('al_corriente')">
        <div class="r-icon">✅</div><div class="r-name">Al día</div>
        <div class="r-desc">Todas las obligaciones al corriente, sin pendientes.</div>
      </div>
      <div class="r-card${window.AF.rfcStatus==='con_avisos'?' sel':''}" onclick="pickAFRFCStatus('con_avisos')">
        <div class="r-icon">⚠️</div><div class="r-name">Con avisos</div>
        <div class="r-desc">Tienes notificaciones o requerimientos pendientes.</div>
      </div>
      <div class="r-card${window.AF.rfcStatus==='vencido'?' sel':''}" onclick="pickAFRFCStatus('vencido')">
        <div class="r-icon">⛔</div><div class="r-name">Vencido / rezago</div>
        <div class="r-desc">Contabilidad o declaraciones atrasadas.</div>
      </div>
      <div class="r-card${window.AF.rfcStatus==='sin_alta'?' sel':''}" onclick="pickAFRFCStatus('sin_alta')">
        <div class="r-icon">🆕</div><div class="r-name">Sin alta o en proceso</div>
        <div class="r-desc">RFC dado de baja, sin activar o en alta nueva.</div>
      </div>
    </div>`;

  content.innerHTML = `
    <div class="sec-label">Paso 2 de 4 — Asesoría Fiscal</div>
    <div class="sec-title">Contexto fiscal</div>
    <div class="sec-sub">Ayúdanos a entender tu situación para calcular el precio correcto.</div>

    <div style="margin-bottom:20px">
      <div class="sec-label" style="margin-top:0">Tipo de contribuyente</div>
      <div class="regime-grid">
        <div class="r-card${window.AF.contribuyente==='pf'?' sel':''}" onclick="pickAFContribuyente('pf')">
          <div class="r-icon">👤</div><div class="r-name">Persona Física</div>
          <div class="r-desc">Individual, independiente o freelancer.</div>
        </div>
        <div class="r-card${window.AF.contribuyente==='pm'?' sel':''}" onclick="pickAFContribuyente('pm')">
          <div class="r-icon">🏢</div><div class="r-name">Persona Moral</div>
          <div class="r-desc">Empresa constituida: S.A., S. de R.L., A.C., etc.</div>
        </div>
      </div>
    </div>

    ${window.AF.contribuyente ? `
    <div style="margin-bottom:20px">
      <div class="sec-label" style="margin-top:0">Régimen fiscal</div>
      ${regimenOptions}
    </div>` : ''}

    ${window.AF.regimen ? `
    <div style="margin-bottom:20px">
      <div class="sec-label" style="margin-top:0">Estatus RFC ante el SAT</div>
      <div class="sec-sub" style="margin-bottom:12px">¿Cómo está tu situación fiscal actualmente?</div>
      ${rfcStatusOptions}
    </div>` : ''}

    ${window.AF.rfcStatus ? `
    <div style="margin-bottom:20px">
      <div class="sec-label" style="margin-top:0">Avisos o complicaciones SAT</div>
      <div class="sec-sub" style="margin-bottom:12px">Selecciona si hay algo que debamos considerar (puede ser ninguno)</div>
      <div class="addons-grid">
        <div class="a-card${window.AF.avisosSat.includes('devolucion')?' sel':''}" onclick="toggleAFAviso('devolucion')">
          <div class="a-chk">${window.AF.avisosSat.includes('devolucion')?'✓':''}</div>
          <div class="a-info">
            <div class="a-name">Solicitud de devolución</div>
            <div class="a-desc">Tienes un saldo a favor y estás en proceso de devolución.</div>
          </div>
        </div>
        <div class="a-card${window.AF.avisosSat.includes('requerimiento')?' sel':''}" onclick="toggleAFAviso('requerimiento')">
          <div class="a-chk">${window.AF.avisosSat.includes('requerimiento')?'✓':''}</div>
          <div class="a-info">
            <div class="a-name">Requerimiento SAT</div>
            <div class="a-desc">Acabas de recibir un requerimiento o notificación oficial.</div>
          </div>
        </div>
        <div class="a-card${window.AF.avisosSat.includes('multa')?' sel':''}" onclick="toggleAFAviso('multa')">
          <div class="a-chk">${window.AF.avisosSat.includes('multa')?'✓':''}</div>
          <div class="a-info">
            <div class="a-name">Multa o sanción</div>
            <div class="a-desc">Tienes una multa, clausura o sanción en proceso.</div>
          </div>
        </div>
        <div class="a-card${window.AF.avisosSat.includes('auditoria')?' sel':''}" onclick="toggleAFAviso('auditoria')">
          <div class="a-chk">${window.AF.avisosSat.includes('auditoria')?'✓':''}</div>
          <div class="a-info">
            <div class="a-name">Auditoría en curso</div>
            <div class="a-desc">Hay una auditoría, visita o verificación activa.</div>
          </div>
        </div>
        <div class="a-card${window.AF.avisosSat.includes('ninguno')?' sel':''}" onclick="toggleAFAviso('ninguno')">
          <div class="a-chk">${window.AF.avisosSat.includes('ninguno')?'✓':''}</div>
          <div class="a-info">
            <div class="a-name">Ninguna / sin complicaciones</div>
            <div class="a-desc">Todo está en orden, no hay avisos pendientes.</div>
          </div>
        </div>
      </div>
    </div>` : ''}

    <div class="nav">
      <button class="btn-back" onclick="renderAF1()">← Tipo de asesoría</button>
      <button class="btn-next" onclick="renderAF3()" ${(!window.AF.contribuyente || !window.AF.regimen || !window.AF.rfcStatus) ? 'disabled' : ''}>Siguiente →</button>
    </div>
  `;
}

function pickAFContribuyente(tipo) {
  window.AF.contribuyente = tipo;
  window.AF.regimen = null;
  renderAF2();
}

function pickAFRegimen(reg) {
  window.AF.regimen = reg;
  renderAF2();
}

function pickAFRFCStatus(status) {
  window.AF.rfcStatus = status;
  renderAF2();
}

function toggleAFAviso(aviso) {
  const idx = window.AF.avisosSat.indexOf(aviso);
  if (idx > -1) {
    window.AF.avisosSat.splice(idx, 1);
  } else {
    if (aviso === 'ninguno') {
      window.AF.avisosSat = ['ninguno'];
    } else {
      window.AF.avisosSat = window.AF.avisosSat.filter(a => a !== 'ninguno');
      window.AF.avisosSat.push(aviso);
    }
  }
  renderAF2();
}

// ── STEP 3: DETALLE DEL SERVICIO ─────────────────────────────────────────────
function renderAF3() {
  updateAFSteps(3);
  const content = document.getElementById('af-content');
  content.innerHTML = '';
  const tipo = window.AF.tipo;
  let detailHTML = '';

  if (tipo === 'puntual') {
    // Temas para asesoría puntual
    const temas = [
      { id: 'isr', name: 'ISR (Impuesto sobre la Renta)', desc: 'Retenciones, pagos provisionales, declaración anual', price: 500 },
      { id: 'iva', name: 'IVA', desc: 'Traslado, acreditamiento, declaraciones mensuales', price: 500 },
      { id: 'cfdi', name: 'CFDI / Facturación', desc: 'Timbrado, corrección, cancelación de facturas', price: 400 },
      { id: 'rfc', name: 'Alta / Actualización RFC', desc: 'Alta en el RFC, actualización de situación fiscal', price: 400 },
      { id: 'imax', name: 'Impuesto Municipal (ISN)', desc: 'Impuesto sobre nómina en tu estado', price: 300 },
      { id: 'ieps', name: 'IEPS', desc: 'Impuesto especial sobre productos y servicios', price: 350 },
      { id: 'plataformas', name: 'Ingresos en Plataformas', desc: 'Declaración de ingresos en apps (Uber, Airbnb, etc)', price: 500 },
      { id: 'regs', name: 'Cambio de Régimen Fiscal', desc: 'Migración entre regímenes tributarios', price: 700 },
      { id: 'arrendamiento', name: 'Arrendamiento', desc: 'Declaración de ingresos por renta de bienes', price: 450 },
      { id: 'nomina', name: 'Nómina', desc: 'Cálculo de retenciones, timbrado de nómina', price: 500 },
      { id: 'credito', name: 'Crédito Fiscal', desc: 'Devoluciones, compensaciones, saldos a favor', price: 600 },
      { id: 'otro', name: 'Otro tema', desc: 'Otro tema no listado arriba', price: 500 },
    ];

    const temaCards = temas.map(t => `
      <div class="a-card${window.AF.temasPuntual.includes(t.id)?' sel':''}" onclick="toggleAFTema('${t.id}')">
        <div class="a-chk">${window.AF.temasPuntual.includes(t.id)?'✓':''}</div>
        <div class="a-info">
          <div class="a-name">${t.name}</div>
          <div class="a-desc">${t.desc}</div>
          <div class="a-price">+${fmtAF(t.price)} MXN</div>
        </div>
      </div>
    `).join('');

    detailHTML = `
      <div class="sec-label">Paso 3 de 4 — Asesoría Fiscal · Puntual</div>
      <div class="sec-title">¿Sobre qué tema necesitas asesoría?</div>
      <div class="sec-sub">Selecciona uno o varios temas. Se cobra por tema.</div>
      <div class="addons-grid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">
        ${temaCards}
      </div>
    `;

  } else if (tipo === 'mensual') {
    // Niveles mensuales
    detailHTML = `
      <div class="sec-label">Paso 3 de 4 — Asesoría Fiscal · Mensual</div>
      <div class="sec-title">Nivel de servicio mensual</div>
      <div class="sec-sub">Soporte continuo con diferentes niveles de atención.</div>
      <div class="level-grid">
        <div class="l-card${window.AF.nivelMensual==='esencial'?' sel':''}" onclick="pickAFNivelMensual('esencial')">
          <div class="l-badge b">ESENCIAL</div>
          <div class="l-price b">${fmtAF(1200)}</div>
          <div class="l-price-note">MXN / mes</div>
          <div class="l-desc">Para contribuyentes con operaciones simples y pocas obligaciones.</div>
          <ul class="l-feats">
            <li><span class="ck">✓</span>Hasta 5 consultas/mes</li>
            <li><span class="ck">✓</span>Revisión de declaraciones</li>
            <li><span class="ck">✓</span>Soporte por WhatsApp</li>
            <li><span class="ck">✓</span>Alertas de obligaciones</li>
          </ul>
        </div>
        <div class="l-card${window.AF.nivelMensual==='profesional'?' sel':''}" onclick="pickAFNivelMensual('profesional')">
          <div class="l-badge a">PROFESIONAL</div>
          <div class="l-price a">${fmtAF(2500)}</div>
          <div class="l-price-note">MXN / mes</div>
          <div class="l-desc">Para negocios activos con mayor complejidad fiscal.</div>
          <ul class="l-feats">
            <li><span class="ck">✓</span>Consultas ilimitadas</li>
            <li><span class="ck">✓</span>Contabilidad electrónica</li>
            <li><span class="ck">✓</span>Revisión fiscal mensual</li>
            <li><span class="ck">✓</span>Atención a requerimientos SAT</li>
            <li><span class="ck">✓</span>Soporte prioritario</li>
          </ul>
        </div>
        <div class="l-card${window.AF.nivelMensual==='premium'?' sel':''}" onclick="pickAFNivelMensual('premium')">
          <div class="l-badge e">PREMIUM</div>
          <div class="l-price e">${fmtAF(4500)}</div>
          <div class="l-price-note">MXN / mes</div>
          <div class="l-desc">Acompañamiento fiscal total con acceso directo al especialista.</div>
          <ul class="l-feats">
            <li><span class="ck">✓</span>Todo lo de Profesional</li>
            <li><span class="ck">✓</span>Sessions mensuales 1:1</li>
            <li><span class="ck">✓</span>Asesoría de modelo de negocio</li>
            <li><span class="ck">✓</span>Plan administrativo y fiscal</li>
            <li><span class="ck">✓</span>Optimización fiscal proactiva</li>
            <li><span class="ck">✓</span>Atención prioritaria 24h</li>
          </ul>
        </div>
      </div>
    `;

  } else if (tipo === 'proyecto') {
    const proyectos = [
      { id: 'alta_rfc', name: 'Alta de RFC y obligaciones', desc: 'Alta completa ante el SAT: RFC, obligaciones, configuración de facturación.', price: 800, entrega: '1-3 días' },
      { id: 'migracion_regimen', name: 'Migración de régimen fiscal', desc: 'Análisis y ejecución de cambio de régimen (RESICO → General, etc).', price: 2500, entrega: '1-2 semanas' },
      { id: 'devolucion', name: 'Solicitud de devolución de impuestos', desc: 'Prepara documentación, cálculos y seguimiento ante el SAT.', price: 3000, entrega: '2-4 semanas' },
      { id: 'compliance', name: 'Cumplimiento fiscal completo (compliance)', desc: 'Revisión y regularización de situación fiscal. Adecuación de obligaciones.', price: 5000, entrega: '3-6 semanas' },
      { id: 'estructura', name: 'Estructura legal-fiscal', desc: 'Diseño de estructura societaria óptima (holding, fideicomiso, etc).', price: 8000, entrega: '4-8 semanas' },
      { id: 'due_diligence', name: 'Due diligence fiscal', desc: 'Auditoría de situación fiscal para compra/venta de empresas.', price: 6000, entrega: '2-4 semanas' },
    ];

    const proyectoCards = proyectos.map(p => `
      <div class="a-card${window.AF.tipoProyecto===p.id?' sel':''}" onclick="pickAFProyecto('${p.id}', ${p.price})">
        <div class="a-info">
          <div class="a-name">${p.name}</div>
          <div class="a-desc">${p.desc}</div>
          <div style="font-size:11px;color:var(--gray);margin-top:4px">⏱ Entrega: ${p.entrega}</div>
          <div class="a-price">${fmtAF(p.price)} MXN</div>
        </div>
      </div>
    `).join('');

    detailHTML = `
      <div class="sec-label">Paso 3 de 4 — Asesoría Fiscal · Proyecto</div>
      <div class="sec-title">Tipo de proyecto</div>
      <div class="sec-sub">Selecciona el proyecto que necesitas. Precio fijo por entregable.</div>
      <div class="addons-grid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">
        ${proyectoCards}
      </div>
    `;

  } else if (tipo === 'revision') {
    const alcances = [
      { id: 'revision_basica', name: 'Revisión básica', desc: 'Revisión de situación fiscal actual: declaraciones, avisos, cumplimiento general.', price: 1500 },
      { id: 'revision_pro', name: 'Revisión profesional', desc: 'Diagnóstico completo con análisis de riesgos, oportunidades de ahorro y plan de acción.', price: 3000 },
      { id: 'revision_exhaustiva', name: 'Revisión exhaustiva', desc: 'Auditoría fiscal completa, revisión de contabilidad, detección de contingencias y regularización.', price: 5000 },
    ];

    const alcanceCards = alcances.map(a => `
      <div class="a-card${window.AF.alcanceRevision===a.id?' sel':''}" onclick="pickAFAlcance('${a.id}', ${a.price})">
        <div class="a-info">
          <div class="a-name">${a.name}</div>
          <div class="a-desc">${a.desc}</div>
          <div class="a-price">${fmtAF(a.price)} MXN</div>
        </div>
      </div>
    `).join('');

    detailHTML = `
      <div class="sec-label">Paso 3 de 4 — Asesoría Fiscal · Revisión</div>
      <div class="sec-title">Alcance de la revisión</div>
      <div class="sec-sub">Selecciona qué tan profunda necesitas la revisión fiscal.</div>
      <div class="addons-grid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">
        ${alcanceCards}
      </div>
    `;
  }

  content.innerHTML = detailHTML + `
    <div class="nav">
      <button class="btn-back" onclick="renderAF2()">← Contexto fiscal</button>
      <button class="btn-next" onclick="renderAF4()" ${!isAF3Complete()?'disabled':''}>Siguiente →</button>
    </div>
  `;
}

function toggleAFTema(temaId) {
  const idx = window.AF.temasPuntual.indexOf(temaId);
  if (idx > -1) {
    window.AF.temasPuntual.splice(idx, 1);
  } else {
    window.AF.temasPuntual.push(temaId);
  }
  renderAF3();
}

function pickAFNivelMensual(nivel) {
  window.AF.nivelMensual = nivel;
  renderAF3();
}

function pickAFProyecto(projId, price) {
  window.AF.tipoProyecto = projId;
  window.AF.precioBase = price;
  renderAF3();
}

function pickAFAlcance(alcanceId, price) {
  window.AF.alcanceRevision = alcanceId;
  window.AF.precioBase = price;
  renderAF3();
}

function isAF3Complete() {
  const t = window.AF.tipo;
  if (t === 'puntual') return window.AF.temasPuntual.length > 0;
  if (t === 'mensual') return !!window.AF.nivelMensual;
  if (t === 'proyecto') return !!window.AF.tipoProyecto;
  if (t === 'revision') return !!window.AF.alcanceRevision;
  return false;
}

// ── STEP 4: URGENCIA ──────────────────────────────────────────────────────────
function renderAF4() {
  updateAFSteps(4);
  const content = document.getElementById('af-content');
  content.innerHTML = '';

  // Calculate base price for puntual
  if (window.AF.tipo === 'puntual') {
    const temaPrices = {
      isr: 500, iva: 500, cfdi: 400, rfc: 400, imax: 300, ieps: 350,
      plataformas: 500, regs: 700, arrendamiento: 450, nomina: 500, credito: 600, otro: 500
    };
    let total = 0;
    window.AF.temasPuntual.forEach(t => { total += temaPrices[t] || 500; });
    window.AF.precioBase = total;
  }

  // Set nivel price for mensual
  if (window.AF.tipo === 'mensual') {
    const nivelPrices = { esencial: 1200, profesional: 2500, premium: 4500 };
    window.AF.precioBase = nivelPrices[window.AF.nivelMensual] || 0;
  }

  content.innerHTML = `
    <div class="sec-label">Paso 4 de 4 — Asesoría Fiscal</div>
    <div class="sec-title">Urgencia del servicio</div>
    <div class="sec-sub">El nivel de urgencia afecta el precio. Normal es el estándar.</div>
    <div class="regime-grid" style="max-width:700px">
      <div class="r-card${window.AF.urgencia==='normal'?' sel':''}" onclick="pickAFUrgencia('normal', 1.0)">
        <div class="r-icon">📅</div>
        <div class="r-name">Normal</div>
        <div class="r-desc">Atención en 3-5 días hábiles. Es el ritmo estándar.</div>
        <span class="r-who" style="color:var(--green)">Multiplicador: 1.00x</span>
      </div>
      <div class="r-card${window.AF.urgencia==='prioritaria'?' sel':''}" onclick="pickAFUrgencia('prioritaria', 1.20)">
        <div class="r-icon">⚡</div>
        <div class="r-name">Prioritaria</div>
        <div class="r-desc">Atención en 24-48h. Requiere disponibilidad del equipo.</div>
        <span class="r-who" style="color:var(--gold)">Multiplicador: 1.20x</span>
      </div>
      <div class="r-card${window.AF.urgencia==='urgente'?' sel':''}" onclick="pickAFUrgencia('urgente', 1.35)">
        <div class="r-icon">🚨</div>
        <div class="r-name">Urgente</div>
        <div class="r-desc">Atención el mismo día. Para situaciones críticas o con plazo inmediato.</div>
        <span class="r-who" style="color:#f87171">Multiplicador: 1.35x</span>
      </div>
    </div>
    <div style="margin-top:20px;padding:16px 20px;background:var(--dark-3);border:1px solid var(--border);border-radius:14px;text-align:center">
      <div style="font-size:11px;color:var(--gray);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Precio base estimado</div>
      <div style="font-size:28px;font-weight:900;color:var(--green)">${fmtAF(window.AF.precioBase)} <span style="font-size:14px;font-weight:400;color:var(--gray)">MXN</span></div>
      ${window.AF.tipo === 'mensual' ? '<div style="font-size:12px;color:var(--gray);margin-top:4px">por mes</div>' : ''}
    </div>
    <div class="nav">
      <button class="btn-back" onclick="renderAF3()">← Detalle</button>
      <button class="btn-next" onclick="renderAFResumen()" ${!window.AF.urgencia?'disabled':''}>Ver resumen →</button>
    </div>
  `;
}

function pickAFUrgencia(tipo, mult) {
  window.AF.urgencia = tipo;
  window.AF.multiplicador = mult;
  window.AF.total = Math.round(window.AF.precioBase * mult);
  renderAFResumen();
}

// ── RESUMEN ───────────────────────────────────────────────────────────────────
function renderAFResumen() {
  updateAFSteps(5);
  const content = document.getElementById('af-content');
  const tipoLabels = { puntual: 'Puntual', mensual: 'Mensual', proyecto: 'Proyecto', revision: 'Revisión' };
  const tipoLabel = tipoLabels[window.AF.tipo];
  const urgenciaMult = window.AF.multiplicador;

  let detalleLabel = '';
  let serviciosHTML = '';

  if (window.AF.tipo === 'puntual') {
    const temaNames = {
      isr: 'ISR', iva: 'IVA', cfdi: 'CFDI / Facturación', rfc: 'Alta/Actualización RFC',
      imax: 'Impuesto Municipal', ieps: 'IEPS', plataformas: 'Plataformas Digitales',
      regs: 'Cambio de Régimen', arrendamiento: 'Arrendamiento', nomina: 'Nómina',
      credito: 'Crédito Fiscal', otro: 'Otro tema'
    };
    detalleLabel = window.AF.temasPuntual.map(t => temaNames[t] || t).join(', ');
    serviciosHTML = window.AF.temasPuntual.map(t => {
      const prices = { isr: 500, iva: 500, cfdi: 400, rfc: 400, imax: 300, ieps: 350, plataformas: 500, regs: 700, arrendamiento: 450, nomina: 500, credito: 600, otro: 500 };
      return `<div class="sum-row"><span class="sum-row-lbl">${temaNames[t] || t}</span><span class="sum-row-val">${fmtAF(prices[t] || 500)}</span></div>`;
    }).join('');
  } else if (window.AF.tipo === 'mensual') {
    const nivelNames = { esencial: 'Esencial ($1,200/mes)', profesional: 'Profesional ($2,500/mes)', premium: 'Premium ($4,500/mes)' };
    detalleLabel = nivelNames[window.AF.nivelMensual] || '';
    serviciosHTML = `<div class="sum-row"><span class="sum-row-lbl">Plan ${window.AF.nivelMensual.charAt(0).toUpperCase() + window.AF.nivelMensual.slice(1)} mensual</span><span class="sum-row-val">${fmtAF(window.AF.precioBase / urgenciaMult)}/mes</span></div>`;
  } else if (window.AF.tipo === 'proyecto') {
    const projNames = {
      alta_rfc: 'Alta RFC y obligaciones', migracion_regimen: 'Migración de régimen',
      devolucion: 'Devolución de impuestos', compliance: 'Cumplimiento fiscal completo',
      estructura: 'Estructura legal-fiscal', due_diligence: 'Due diligence fiscal'
    };
    detalleLabel = projNames[window.AF.tipoProyecto] || window.AF.tipoProyecto;
    serviciosHTML = `<div class="sum-row"><span class="sum-row-lbl">Proyecto</span><span class="sum-row-val">${fmtAF(window.AF.precioBase / urgenciaMult)}</span></div>`;
  } else if (window.AF.tipo === 'revision') {
    const alcanceNames = {
      revision_basica: 'Revisión básica', revision_pro: 'Revisión profesional', revision_exhaustiva: 'Revisión exhaustiva'
    };
    detalleLabel = alcanceNames[window.AF.alcanceRevision] || window.AF.alcanceRevision;
    serviciosHTML = `<div class="sum-row"><span class="sum-row-lbl">Alcance</span><span class="sum-row-val">${fmtAF(window.AF.precioBase / urgenciaMult)}</span></div>`;
  }

  const multLabel = urgenciaMult > 1 ? `<div class="sum-row"><span class="sum-row-lbl">Multiplicador de urgencia (${urgenciaMult}x)</span><span class="sum-row-val" style="color:var(--gold)">×${urgenciaMult}</span></div>` : '';

  content.innerHTML = `
    <div class="sec-label">Asesoría Fiscal — Resumen</div>
    <div class="sec-title">Tu cotización de asesoría</div>
    <div class="sec-sub">Revisa los detalles y genera tu cotización formal.</div>

    <div class="sum-wrap">
      <div class="sum-left">
        <div class="sum-block">
          <div class="sum-block-title">Detalles del servicio</div>
          <div class="sum-row"><span class="sum-row-lbl">Tipo</span><span class="sum-row-val">${tipoLabel}</span></div>
          <div class="sum-row"><span class="sum-row-lbl">Detalle</span><span class="sum-row-val">${detalleLabel}</span></div>
          <div class="sum-row"><span class="sum-row-lbl">Contribuyente</span><span class="sum-row-val">${window.AF.contribuyente === 'pf' ? 'Persona Física' : 'Persona Moral'}</span></div>
          <div class="sum-row"><span class="sum-row-lbl">Régimen</span><span class="sum-row-val">${window.AF.regimen}</span></div>
          <div class="sum-row"><span class="sum-row-lbl">Estatus RFC</span><span class="sum-row-val">${window.AF.rfcStatus}</span></div>
          <div class="sum-row"><span class="sum-row-lbl">Urgencia</span><span class="sum-row-val">${window.AF.urgencia.charAt(0).toUpperCase() + window.AF.urgencia.slice(1)}</span></div>
          ${serviciosHTML}
          ${multLabel}
          <div class="sum-row"><span class="sum-row-lbl">Subtotal</span><span class="sum-row-val">${fmtAF(window.AF.precioBase / urgenciaMult)}</span></div>
          <div class="sum-row"><span class="sum-row-lbl">IVA (16%)</span><span class="sum-row-val">${fmtAF(Math.round(window.AF.precioBase / urgenciaMult * 0.16))}</span></div>
          <div class="sum-row total-row"><span class="sum-row-lbl">Total</span><span class="sum-row-val">${fmtAF(Math.round(window.AF.total * 1.16))}</span></div>
        </div>
        ${window.AF.avisosSat.length ? `
        <div class="sum-block">
          <div class="sum-block-title">Consideraciones</div>
          ${window.AF.avisosSat.map(a => `<div style="display:flex;gap:8px;font-size:13px;color:var(--gray-light);padding:7px 0;border-bottom:1px solid var(--border)"><span style="color:var(--gold);font-weight:700">⚠</span>${a}</div>`).join('')}
        </div>` : ''}
      </div>

      <div class="sticky-card">
        <div class="sc-tag">Asesoría Fiscal · ${tipoLabel}</div>
        <div class="sc-regime">${detalleLabel}</div>
        <div class="sc-label">Total estimado</div>
        <div class="sc-total">${fmtAF(window.AF.total)}</div>
        <div class="sc-period">+ IVA = ${fmtAF(Math.round(window.AF.total * 1.16))}</div>
        <div class="sc-bdown">
          <div class="sc-item"><span class="sc-item-lbl">Precio base</span><span class="sc-item-val">${fmtAF(window.AF.precioBase / urgenciaMult)}</span></div>
          ${urgenciaMult > 1 ? `<div class="sc-item"><span class="sc-item-lbl">Urgencia (${urgenciaMult}x)</span><span class="sc-item-val" style="color:var(--gold)">+${fmtAF(window.AF.total - window.AF.precioBase / urgenciaMult)}</span></div>` : ''}
        </div>
        <a class="sc-cta" href="https://wa.me/524442522739?text=${encodeURIComponent('Hola Fernando, me interesa cotizar asesoría fiscal: ' + tipoLabel + ' - ' + detalleLabel + '. ¿Podemos agendar una llamada?')}" target="_blank">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Solicitar propuesta formal
        </a>
        <button class="sc-edit" onclick="renderAF4()">✏️ Ajustar urgencia</button>
        <div class="sc-disc">Precio referencial. La propuesta formal puede variar según complejidad.</div>
        <button onclick="generatePDFAsesoria()" style="width:100%;margin-top:10px;padding:13px;background:var(--green);color:var(--dark);border:none;border-radius:12px;font-size:13px;font-weight:800;cursor:pointer;font-family:'Inter',sans-serif;display:flex;align-items:center;justify-content:center;gap:7px">📄 Generar cotización formal</button>
      </div>
    </div>

    <div class="client-form" style="margin-top:24px">
      <div class="cf-title">Datos del cliente (opcional)</div>
      <div class="cf-grid">
        <div class="cf-field">
          <label class="cf-label">Nombre completo</label>
          <input class="cf-input" id="af_nombre" type="text" placeholder="Ej. Juan García López" />
        </div>
        <div class="cf-field">
          <label class="cf-label">Correo electrónico</label>
          <input class="cf-input" id="af_email" type="email" placeholder="correo@ejemplo.com" />
        </div>
        <div class="cf-field full">
          <label class="cf-label">Notas adicionales</label>
          <input class="cf-input" id="af_notas" type="text" placeholder="Observaciones o contexto adicional (opcional)" />
        </div>
      </div>
    </div>

    <div class="nav">
      <button class="btn-back" onclick="renderAF4()">← Urgencia</button>
      <button class="btn-next" onclick="generatePDFAsesoria()">📄 Generar cotización</button>
    </div>
  `;
}

// ── PDF GENERATION ─────────────────────────────────────────────────────────────
function generatePDFAsesoria() {
  const tipoLabels = { puntual: 'Puntual', mensual: 'Mensual', proyecto: 'Proyecto', revision: 'Revisión' };
  const tipoLabel = tipoLabels[window.AF.tipo];

  let detalleLabel = '';
  let precioBase = window.AF.precioBase / window.AF.multiplicador;
  let serviciosRows = '';

  if (window.AF.tipo === 'puntual') {
    const temaNames = {
      isr: 'ISR', iva: 'IVA', cfdi: 'CFDI / Facturación', rfc: 'Alta/Actualización RFC',
      imax: 'Impuesto Municipal', ieps: 'IEPS', plataformas: 'Plataformas Digitales',
      regs: 'Cambio de Régimen', arrendamiento: 'Arrendamiento', nomina: 'Nómina',
      credito: 'Crédito Fiscal', otro: 'Otro tema'
    };
    const temaPrices = { isr: 500, iva: 500, cfdi: 400, rfc: 400, imax: 300, ieps: 350, plataformas: 500, regs: 700, arrendamiento: 450, nomina: 500, credito: 600, otro: 500 };
    detalleLabel = window.AF.temasPuntual.map(t => temaNames[t] || t).join(', ');
    window.AF.temasPuntual.forEach(t => {
      serviciosRows += `<tr><td><strong>${temaNames[t] || t}</strong></td><td style="color:#6b7280;font-size:12px">Asesoría puntual</td><td style="text-align:right;font-weight:600">${fmtAF(temaPrices[t] || 500)}</td></tr>`;
    });
  } else if (window.AF.tipo === 'mensual') {
    const nivelNames = { esencial: 'Esencial', profesional: 'Profesional', premium: 'Premium' };
    detalleLabel = nivelNames[window.AF.nivelMensual] + ' — Mensual';
    serviciosRows = `<tr><td><strong>Plan ${nivelNames[window.AF.nivelMensual]} mensual</strong></td><td style="color:#6b7280;font-size:12px">Soporte fiscal mensual</td><td style="text-align:right;font-weight:600">${fmtAF(precioBase)}/mes</td></tr>`;
  } else if (window.AF.tipo === 'proyecto') {
    const projNames = {
      alta_rfc: 'Alta RFC y obligaciones', migracion_regimen: 'Migración de régimen',
      devolucion: 'Devolución de impuestos', compliance: 'Cumplimiento fiscal completo',
      estructura: 'Estructura legal-fiscal', due_diligence: 'Due diligence fiscal'
    };
    detalleLabel = projNames[window.AF.tipoProyecto] || window.AF.tipoProyecto;
    serviciosRows = `<tr><td><strong>${detalleLabel}</strong></td><td style="color:#6b7280;font-size:12px">Proyecto con entregable definido</td><td style="text-align:right;font-weight:600">${fmtAF(precioBase)}</td></tr>`;
  } else if (window.AF.tipo === 'revision') {
    const alcanceNames = {
      revision_basica: 'Revisión básica', revision_pro: 'Revisión profesional', revision_exhaustiva: 'Revisión exhaustiva'
    };
    detalleLabel = alcanceNames[window.AF.alcanceRevision] || window.AF.alcanceRevision;
    serviciosRows = `<tr><td><strong>${detalleLabel}</strong></td><td style="color:#6b7280;font-size:12px">Servicio de revisión fiscal</td><td style="text-align:right;font-weight:600">${fmtAF(precioBase)}</td></tr>`;
  }

  const iva = Math.round(window.AF.total * 0.16);
  const totalIva = Math.round(window.AF.total * 1.16);
  const today = new Date();
  const dateStr = today.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
  const folio = 'AF-' + today.getFullYear().toString().slice(2) + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(Math.floor(Math.random() * 9000) + 1000);

  const nombre = document.getElementById('af_nombre') ? document.getElementById('af_nombre').value : '';
  const email = document.getElementById('af_email') ? document.getElementById('af_email').value : '';
  const notas = document.getElementById('af_notas') ? document.getElementById('af_notas').value : '';

  let clientRows = '';
  if (nombre) clientRows += `<div class="pdf-client-item"><div class="label">Nombre</div><div class="val">${nombre}</div></div>`;
  if (email) clientRows += `<div class="pdf-client-item"><div class="label">Correo</div><div class="val">${email}</div></div>`;
  if (!clientRows) clientRows = '<div class="pdf-client-item"><div class="label">Cliente</div><div class="val">Por definir</div></div>';

  document.getElementById('pdfDoc').innerHTML = `
    <div class="pdf-header">
      <div>
        <div class="pdf-logo-name">FiscoNegocio</div>
        <div class="pdf-logo-tag">Asesoría Fiscal y Empresarial</div>
        <div class="pdf-logo-contact">C.P. Fernando Mendoza Ferreira<br>📱 444 252 2739 · fisconegociomx.github.io</div>
      </div>
      <div class="pdf-folio-box">
        <div class="pdf-folio-label">Cotización No.</div>
        <div class="pdf-folio">${folio}</div>
        <div class="pdf-date">Fecha: ${dateStr}</div>
        <div class="pdf-vigencia">Asesoría Fiscal · ${tipoLabel}</div>
      </div>
    </div>
    <div class="pdf-section-title">Datos del cliente</div>
    <div class="pdf-client-grid">${clientRows}</div>
    <div class="pdf-section-title">Servicio de asesoría</div>
    <table class="pdf-services-table"><thead><tr><th>Servicio</th><th>Tipo</th><th style="text-align:right">Monto</th></tr></thead><tbody>${serviciosRows}</tbody></table>
    ${window.AF.multiplicador > 1 ? `<div style="margin-top:10px;font-size:12px;color:var(--gold);font-weight:600">⚡ Urgencia: ${window.AF.urgencia} (multiplicador ${window.AF.multiplicador}x)</div>` : ''}
    <div class="pdf-totals"><div class="pdf-totals-box">
      <div class="pdf-tot-row"><span class="lbl">Subtotal</span><span>${fmtAF(precioBase)}</span></div>
      ${window.AF.multiplicador > 1 ? `<div class="pdf-tot-row" style="color:#92400e"><span class="lbl">Urgencia (${window.AF.multiplicador}x)</span><span>+${fmtAF(window.AF.total - precioBase)}</span></div>` : ''}
      <div class="pdf-tot-row"><span class="lbl">IVA (16%)</span><span>${fmtAF(iva)}</span></div>
      <div class="pdf-tot-row"><span class="lbl">Total</span><span>${fmtAF(totalIva)}</span></div>
    </div></div>
    ${notas ? `<div class="pdf-terms" style="margin-top:20px"><div class="pdf-terms-title">Notas</div><p>${notas}</p></div>` : ''}
    <div class="pdf-terms">
      <div class="pdf-terms-title">Condiciones y términos</div>
      <p>• Cotización válida 30 días naturales.<br>
      • Precios incluyen IVA.<br>
      • El inicio del servicio está sujeto a confirmación y primer pago.<br>
      • Para asesorías puntuales: la sesión se agenda una vez confirmado el pago.<br>
      • Para asesorías mensuales: el servicio inicia el día 1 del mes siguiente al primer pago.<br>
      • FiscoNegocio puede actualizar tarifas con 30 días de aviso previo.</p>
    </div>
    <div class="pdf-footer">
      <div class="pdf-footer-left">FiscoNegocio · C.P. Fernando Mendoza Ferreira<br>Asesoría Fiscal y Empresarial · San Luis Potosí, México</div>
      <div class="pdf-footer-right">${folio}</div>
    </div>
  `;

  document.getElementById('printModal').classList.add('visible');
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function fmtAF(n) {
  return '$' + Math.round(n).toLocaleString('es-MX');
}

function hideAllSections() {
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
  document.getElementById('asesoria-flow').style.display = 'none';
  document.getElementById('af-steps').style.display = 'none';
  window.AF = {};
}

function updateAFSteps(step) {
  // AF steps: 1=Inicio, 2=Régimen, 3=Detalle, 4=Urgencia, 5=Resumen
  const labels = ['Tipo', 'Contexto', 'Detalle', 'Urgencia', 'Resumen'];
  document.getElementById('af-steps').innerHTML = `
    <div class="steps">
      ${labels.slice(0, step).map((l, i) => `
        <div class="hs ${i + 1 === step ? 'active' : 'done'}">
          <div class="hs-n">${i + 1}</div><span>${l}</span>
        </div>
        ${i < step - 1 ? '<div class="hs-line done"></div>' : ''}
      `).join('')}
    </div>
  `;
}

function goBackToMenu() {
  hideAllSections();
  // Show step 0 / menu
  document.getElementById('menu-flow').style.display = 'block';
  document.getElementById('menu-steps').style.display = 'flex';
}

function resetAF() {
  window.AF = {
    tipo: null, contribuyente: null, regimen: null, rfcStatus: null,
    avisosSat: [], urgencia: null, temasPuntual: [],
    nivelMensual: null, tipoProyecto: null, alcanceRevision: null,
    cliente: {}, precioBase: 0, multiplicador: 1, total: 0
  };
}