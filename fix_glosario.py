#!/usr/bin/env python3
import re

with open('/home/miltron/.openclaw/workspace/fisconegociomx/guia/index.html', 'r') as f:
    content = f.read()

old_data = '''  const terminos = [
    { term:'RFC', abbr:'Registro Federal de Contribuyentes', def:'Clave única que el SAT asigna a personas físicas y morales para identificarlas fiscalmente. Es obligatorio para emitir facturas, abrir cuentas bancarias empresariales y cualquier trámite fiscal.', tip:'Tip: Tu RFC como persona física se compone de 4 letras de tu nombre + 6 dígitos de fecha de nacimiento + 3 caracteres de diferenciador.' },
    { term:'SAT', abbr:'Servicio de Administración Tributaria', def:'Órgano del gobierno mexicano encargado de aplicar la legislación fiscal, recortar impuestos federales y fiscalizar a los contribuyentes. Es con quien debes cumplir tus obligaciones fiscales mensual y anualmente.', tip:'Tip: Tienes acceso a todos tus trámites en sat.gob.mx con tu RFC + contraseña o e.firma.' },
    { term:'CFDI', abbr:'Comprobante Fiscal Digital por Internet', def:'La factura electrónica oficial en México. Documento XML que acredita una transacción comercial y tiene validez fiscal. Sin CFDI, un gasto no es deducible para efectos del ISR.', tip:'Tip: Siempre pide CFDI con tus datos fiscales correctos — RFC, nombre o razón social y uso del CFDI.' },
    { term:'IVA', abbr:'Impuesto al Valor Agregado', def:'Impuesto indirecto del 16% (general) o 0% (alimentos, medicinas) que se aplica al precio de bienes y servicios. Lo cobras a tus clientes y lo entregas al SAT mensualmente, descontando el IVA que tú pagaste a proveedores.', tip:'Tip: IVA cobrado − IVA pagado = IVA a pagar. Si pagas más IVA del que cobras, tienes saldo a favor.' },
    { term:'ISR', abbr:'Impuesto Sobre la Renta', def:'Impuesto que grava las ganancias. Como persona física con actividad empresarial pagas ISR sobre la diferencia entre ingresos y deducciones autorizadas. Las tasas van del 1.92% al 35% según el nivel de ingreso.', tip:'Tip: Entre más deducciones comprobables tengas (con CFDI), menos ISR pagas. El contador optimiza esto.' },
    { term:'IMSS', abbr:'Instituto Mexicano del Seguro Social', def:'Institución de seguridad social. Como patrón (si tienes empleados) debes inscribirlos al IMSS y pagar cuotas patronales mensuales. También puedes inscribirte voluntariamente como trabajador independiente.', tip:'Tip: No afiliar empleados al IMSS puede generar multas de hasta $200,000 MXN y responsabilidad solidaria.' },
    { term:'RESICO', abbr:'Régimen Simplificado de Confianza', def:'Régimen fiscal creado en 2022 para personas físicas con ingresos hasta $3.5 millones anuales. Ofrece tasas de ISR muy bajas (0.1% a 2.5%) y menos obligaciones. Ideal para emprendedores y profesionistas independientes.', tip:'Tip: En RESICO no puedes deducir gastos — la ventaja es la tasa baja, no las deducciones.' },
    { term:'Actividad Empresarial', abbr:'Régimen de Actividad Empresarial y Profesional', def:'Régimen para personas físicas que realizan actividades comerciales, industriales o de servicios. Permite deducir gastos relacionados con el negocio. Sin límite de ingresos. ISR con tablas progresivas del art. 96 LISR.', tip:'Tip: Si tus gastos deducibles son altos, este régimen puede resultar más conveniente que RESICO.' },
    { term:'Declaración Anual', abbr:'Declaración del ejercicio fiscal', def:'Declaración que presenta el resumen de ingresos, deducciones e impuestos del año completo (enero-diciembre). Para personas físicas se presenta en abril del año siguiente. Puede resultar en saldo a favor (devolución) o a pagar.', tip:'Tip: Si tienes saldo a favor y nunca has declarado, puedes perder el derecho a la devolución pasados 5 años.' },
    { term:'Declaración Mensual', abbr:'Pago provisional mensual', def:'Pago anticipado de impuestos que se realiza cada mes (ISR e IVA). No es el impuesto definitivo, sino un adelanto que se acredita contra el impuesto anual. Se presenta los primeros 17 días de cada mes.', tip:'Tip: No presentar declaraciones mensuales genera multas automáticas de $1,810 a $4,523 MXN por mes omitido.' },
    { term:'Deducible', abbr:'Gasto deducible de impuestos', def:'Gasto que el SAT permite restar de tus ingresos para calcular el ISR. Debe estar soportado con CFDI, ser estrictamente indispensable para tu actividad y estar pagado. Reduce directamente tu base gravable.', tip:'Tip: Ejemplos de gastos deducibles: renta de oficina, equipo de cómputo, papelería, servicios profesionales, gasolina (si es para el negocio).' },
    { term:'Retención', abbr:'Retención de impuestos', def:'Descuento que aplica quien te paga (empresa o persona moral) sobre tu pago, como adelanto de impuestos. Retenciones comunes: 10% de ISR en honorarios, 6% de IVA. Las retenciones se acreditan en tu declaración mensual.', tip:'Tip: Si te retienen impuestos, pide siempre el CFDI de retenciones para poder acreditarlos.' },
    { term:'Persona Física', abbr:'Contribuyente persona física', def:'Individuo que realiza actividades económicas con nombre propio. Tribute en regímenes como RESICO, Actividad Empresarial o Sueldos y Salarios. La responsabilidad patrimonial es ilimitada (responde con bienes personales).', tip:'Tip: La mayoría de emprendedores inician como persona física por la sencillez y menor costo administrativo.' },
    { term:'Persona Moral', abbr:'Sociedad o empresa constituida', def:'Entidad jurídica independiente (SA de CV, SAS, etc.) que tributa al 30% de ISR sobre utilidades. Ofrece separación patrimonial entre la empresa y el dueño. Requiere escritura notarial, acta constitutiva y más obligaciones contables.', tip:'Tip: Conviene constituir persona moral cuando los ingresos superan ~$2M anuales o cuando necesitas separar responsabilidades.' },
    { term:'Nómina', abbr:'Comprobante de pago de empleados', def:'Registro de pagos a empleados que incluye sueldo, prestaciones, deducciones e impuestos. El patrón debe emitir CFDI de nómina por cada pago. Es deducible para ISR de la empresa y obligación ante el IMSS.', tip:'Tip: Los CFDI de nómina deben timbrase antes del pago o máximo el día hábil siguiente.' },
    { term:'Régimen Fiscal', abbr:'Régimen tributario del contribuyente', def:'Marco legal bajo el cual una persona física o moral cumple sus obligaciones fiscales. Determina qué impuestos paga, a qué tasas, qué puede deducir y qué declaraciones debe presentar. Se elige al darse de alta en el SAT.', tip:'Tip: Puedes cambiar de régimen fiscal si tu situación cambia — idealmente con asesoría de un contador.' },
    { term:'Contabilidad Electrónica', abbr:'Contabilidad en medios electrónicos', def:'Obligación de llevar y enviar tu contabilidad al SAT en formato XML mensualmente (catálogo de cuentas, balanza de comprobación). Aplica a personas morales y a personas físicas con actividad empresarial con ingresos superiores a $4M anuales.', tip:'Tip: Llevar una contabilidad ordenada desde el inicio facilita este trámite y evita sorpresas en auditorías.' },
    { term:'Buzón Tributario', abbr:'Canal oficial de comunicación con el SAT', def:'Sistema electrónico oficial donde el SAT te notifica requerimientos, resoluciones y cartas invitación. Tienes 3 días hábiles para responder una notificación. Ignorarla puede equivaler a aceptar el acto.', tip:'Tip: Activa tu buzón tributario y revísalo al menos una vez a la semana. Muchas personas no saben que tienen requerimientos.' },
    { term:'CIF', abbr:'Constancia de Situación Fiscal', def:'Documento oficial del SAT que acredita tu situación como contribuyente: régimen fiscal, domicilio fiscal, obligaciones y fecha de alta. Lo solicitan bancos, clientes grandes y dependencias de gobierno.', tip:'Tip: Puedes descargar tu CIF actualizado en cualquier momento desde sat.gob.mx o en la app del SAT.' },
    { term:'e.firma', abbr:'Firma Electrónica Avanzada (antes FIEL)', def:'Certificado digital que equivale a tu firma autógrafa ante el SAT. Necesaria para trámites avanzados: declaración anual, buzón tributario, SUA, IMSS. Se obtiene en oficinas del SAT con identificación y cita previa.', tip:'Tip: Guarda tus archivos .cer y .key en un lugar seguro — perderlos implica revocar y obtener una nueva e.firma.' },
  ];

  let selected = null;

  function renderChips() {
    const container = document.getElementById('chips');
    terminos.forEach((t, i) => {
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.textContent = t.term;
      chip.onclick = () => selectTerm(i, chip);
      container.appendChild(chip);
    });
  }

  function selectTerm(i, chip) {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const t = terminos[i];
    const panel = document.getElementById('glosario-panel');
    panel.classList.add('has-content');
    panel.innerHTML = \`
      <div class="glosario-term">\${t.term}</div>
      <div class="glosario-abbr">\${t.abbr}</div>
      <div class="glosario-def">\${t.def}</div>
      \${t.tip ? \`<div class="glosario-tip"><strong>💡</strong> \${t.tip.replace('Tip: ','')}</div>\` : ''}
    \`;
  }

  renderChips();'''

new_data = '''  const terminos = [
    { term:'RFC', abbr:'Registro Federal de Contribuyentes', cat:'Alta y Obligaciones', def:'Clave única que el SAT asigna a personas físicas y morales para identificarlas fiscalmente. Es obligatorio para emitir facturas, abrir cuentas bancarias empresariales y cualquier trámite fiscal.', tip:'💡 Tu RFC como persona física se compone de 4 letras de tu nombre + 6 dígitos de fecha de nacimiento + 3 caracteres de diferenciador.' },
    { term:'SAT', abbr:'Servicio de Administración Tributaria', cat:'Autoridades', def:'Órgano del gobierno mexicano encargado de aplicar la legislación fiscal, recortar impuestos federales y fiscalizar a los contribuyentes. Es con quien debes cumplir tus obligaciones fiscales mensual y anualmente.', tip:'💡 Tienes acceso a todos tus trámites en sat.gob.mx con tu RFC + contraseña o e.firma.' },
    { term:'CFDI', abbr:'Comprobante Fiscal Digital por Internet', cat:'Facturación', def:'La factura electrónica oficial en México. Documento XML que acredita una transacción comercial y tiene validez fiscal. Sin CFDI, un gasto no es deducible para efectos del ISR.', tip:'💡 Siempre pide CFDI con tus datos fiscales correctos — RFC, nombre o razón social y uso del CFDI.' },
    { term:'IVA', abbr:'Impuesto al Valor Agregado', cat:'Impuestos', def:'Impuesto indirecto del 16% (general) o 0% (alimentos, medicinas) que se aplica al precio de bienes y servicios. Lo cobras a tus clientes y lo entregas al SAT mensualmente, descontando el IVA que pagaste a proveedores.', tip:'💡 IVA cobrado − IVA pagado = IVA a pagar. Si pagas más IVA del que cobras, tienes saldo a favor.' },
    { term:'ISR', abbr:'Impuesto Sobre la Renta', cat:'Impuestos', def:'Impuesto que grava las ganancias. Como persona física con actividad empresarial pagas ISR sobre la diferencia entre ingresos y deducciones autorizadas. Las tasas van del 1.92% al 35%.', tip:'💡 Entre más deducciones comprobables tengas (con CFDI), menos ISR pagas. El contador optimiza esto.' },
    { term:'IMSS', abbr:'Instituto Mexicano del Seguro Social', cat:'Obligaciones Patronales', def:'Institución de seguridad social. Como patrón debes inscribir empleados al IMSS y pagar cuotas patronales mensuales. También puedes afiliarte voluntariamente como trabajador independiente.', tip:'💡 No afiliar empleados puede generar multas de hasta $200,000 MXN y responsabilidad solidaria.' },
    { term:'RESICO', abbr:'Régimen Simplificado de Confianza', cat:'Regímenes Fiscales', def:'Régimen fiscal creado en 2022 para personas físicas con ingresos hasta $3.5 millones anuales. Tasas de ISR muy bajas (0.1% a 2.5%) y menos obligaciones. Ideal para emprendedores.', tip:'💡 En RESICO no puedes deducir gastos — la ventaja es la tasa baja, no las deducciones.' },
    { term:'Actividad Empresarial', abbr:'Régimen de Actividad Empresarial', cat:'Regímenes Fiscales', def:'Régimen para personas físicas con actividades comerciales, industriales o de servicios. Permite deducir gastos. Sin límite de ingresos. ISR con tablas progresivas del art. 96 LISR.', tip:'💡 Si tus gastos deducibles son altos, este régimen puede resultar más conveniente que RESICO.' },
    { term:'Declaración Anual', abbr:'Declaración del ejercicio fiscal', cat:'Declaraciones', def:'Resumen de ingresos, deducciones e impuestos del año completo (enero-diciembre). Se presenta en abril del año siguiente. Puede resultar en saldo a favor (devolución) o a pagar.', tip:'💡 Si tienes saldo a favor y nunca has declarado, puedes perder el derecho a la devolución pasados 5 años.' },
    { term:'Declaración Mensual', abbr:'Pago provisional mensual', cat:'Declaraciones', def:'Pago anticipado de impuestos (ISR e IVA) que se realiza cada mes. Se presenta los primeros 17 días. Es un adelanto que se acredita contra el impuesto anual.', tip:'💡 No presentar declaraciones mensuales genera multas automáticas de $1,810 a $4,523 MXN por mes omitido.' },
    { term:'Deducible', abbr:'Gasto deducible', cat:'Impuestos', def:'Gasto que el SAT permite restar de tus ingresos para calcular el ISR. Debe estar soportado con CFDI, ser indispensable para tu actividad y estar pagado. Reduce tu base gravable.', tip:'💡 Ejemplos: renta de oficina, equipo de cómputo, papelería, servicios profesionales, gasolina del negocio.' },
    { term:'Retención', abbr:'Retención de impuestos', cat:'Facturación', def:'Descuento que aplica quien te paga sobre tu pago, como adelanto de impuestos. Retenciones comunes: 10% de ISR en honorarios, 6% de IVA. Se acreditan en tu declaración mensual.', tip:'💡 Si te retienen impuestos, pide siempre el CFDI de retenciones para poder acreditarlos.' },
    { term:'Persona Física', abbr:'Contribuyente persona física', cat:'Alta y Obligaciones', def:'Individuo que realiza actividades económicas con nombre propio. Tributa en regímenes como RESICO o Actividad Empresarial. La responsabilidad patrimonial es ilimitada.', tip:'💡 La mayoría de emprendedores inician como persona física por la sencillez y menor costo administrativo.' },
    { term:'Persona Moral', abbr:'Sociedad o empresa constituida', cat:'Alta y Obligaciones', def:'Entidad jurídica independiente (SA de CV, SAS, etc.) que tributa al 30% de ISR sobre utilidades. Ofrece separación patrimonial. Requiere escritura notarial y más obligaciones.', tip:'💡 Conviene constituir persona moral cuando los ingresos superan ~$2M anuales o cuando necesitas separar responsabilidades.' },
    { term:'Nómina', abbr:'Comprobante de pago de empleados', cat:'Obligaciones Patronales', def:'Registro de pagos a empleados: sueldo, prestaciones, deducciones e impuestos. El patrón debe emitir CFDI de nómina por cada pago. Es deducible para ISR.', tip:'💡 Los CFDI de nómina deben timbrarse antes del pago o máximo el día hábil siguiente.' },
    { term:'Régimen Fiscal', abbr:'Régimen tributario', cat:'Regímenes Fiscales', def:'Marco legal bajo el cual cumples obligaciones fiscales. Determina qué impuestos pagas, a qué tasas, qué puedes deducir y qué declaraciones presentar.', tip:'💡 Puedes cambiar de régimen fiscal si tu situación cambia — idealmente con asesoría de un contador.' },
    { term:'Contabilidad Electrónica', abbr:'Contabilidad en medios electrónicos', cat:'Declaraciones', def:'Obligación de llevar y enviar contabilidad al SAT en formato XML mensualmente (catálogo de cuentas, balanza de comprobación). Aplica a personas morales y físicas con ingresos > $4M.', tip:'💡 Llevar contabilidad ordenada desde el inicio facilita este trámite y evita sorpresas en auditorías.' },
    { term:'Buzón Tributario', abbr:'Canal oficial de comunicación SAT', cat:'Autoridades', def:'Sistema electrónico donde el SAT te notifica requerimientos y resoluciones. Tienes 3 días hábiles para responder. Ignorarlo puede equivaler a aceptar el acto.', tip:'💡 Activa tu buzón tributario y revísalo al menos una vez a la semana.' },
    { term:'CIF', abbr:'Constancia de Situación Fiscal', cat:'Alta y Obligaciones', def:'Documento oficial del SAT que acredita tu situación como contribuyente: régimen fiscal, domicilio, obligaciones y fecha de alta. Lo solicitan bancos y clientes.', tip:'💡 Puedes descargar tu CIF actualizado en cualquier momento desde sat.gob.mx o en la app del SAT.' },
    { term:'e.firma', abbr:'Firma Electrónica Avanzada', cat:'Alta y Obligaciones', def:'Certificado digital que equivale a tu firma autógrafa ante el SAT. Necesaria para trámites avanzados: declaración anual, buzón tributario, IMSS. Se obtiene en oficinas del SAT.', tip:'💡 Guarda tus archivos .cer y .key en un lugar seguro — perderlos implica revoke y obtener una nueva.' },
  ];

  const cats = ['Todos', 'Impuestos', 'Facturación', 'Regímenes Fiscales', 'Declaraciones', 'Alta y Obligaciones', 'Obligaciones Patronales', 'Autoridades'];
  let activeCat = 'Todos';
  let searchQuery = '';
  let selectedIndex = null;

  function getFiltered() {
    return terminos.filter(t => {
      const matchCat = activeCat === 'Todos' || t.cat === activeCat;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || t.term.toLowerCase().includes(q) || t.abbr.toLowerCase().includes(q) || t.def.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }

  function renderCats() {
    const container = document.getElementById('glosario-cats');
    container.innerHTML = '';
    cats.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'cat-btn' + (cat === activeCat ? ' active' : '');
      btn.textContent = cat;
      btn.onclick = () => { activeCat = cat; renderCats(); renderGrid(); };
      container.appendChild(btn);
    });
  }

  function renderGrid() {
    const container = document.getElementById('glosario-grid');
    const filtered = getFiltered();
    container.innerHTML = '';
    if (filtered.length === 0) {
      container.innerHTML = '<div class="no-results"><span class="no-results-icon">🔍</span>No hay términos que coincidan con tu búsqueda</div>';
      return;
    }
    filtered.forEach(t => {
      const actualIdx = terminos.indexOf(t);
      const card = document.createElement('div');
      card.className = 'glosario-card' + (selectedIndex === actualIdx ? ' active-card' : '');
      card.innerHTML = '<div class="card-term">' + t.term + '</div><div class="card-abbr">' + t.abbr + '</div><div class="card-preview">' + t.def + '</div>';
      card.onclick = () => selectTerm(actualIdx, card);
      container.appendChild(card);
    });
  }

  function selectTerm(i, card) {
    selectedIndex = i;
    document.querySelectorAll('.glosario-card').forEach(c => c.classList.remove('active-card'));
    if (card) card.classList.add('active-card');
    const t = terminos[i];
    const panel = document.getElementById('glosario-panel');
    panel.classList.add('has-content');
    panel.innerHTML = '<div class="glosario-panel-header"><div><div class="glosario-term">' + t.term + '</div><div class="glosario-abbr">' + t.abbr + '</div></div><button class="glosario-close" onclick="closePanel()" aria-label="Cerrar">✕</button></div><div class="glosario-def">' + t.def + '</div>' + (t.tip ? '<div class="glosario-tip">' + t.tip + '</div>' : '');
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function closePanel() {
    selectedIndex = null;
    const panel = document.getElementById('glosario-panel');
    panel.classList.remove('has-content');
    panel.innerHTML = '<div class="glosario-empty"><span class="glosario-empty-icon">📋</span>Selecciona un término de la lista para ver su definición</div>';
    document.querySelectorAll('.glosario-card').forEach(c => c.classList.remove('active-card'));
  }

  renderCats();
  renderGrid();

  document.getElementById('glosario-search').addEventListener('input', function(e) {
    searchQuery = e.target.value;
    renderGrid();
  });'''

if old_data in content:
    content = content.replace(old_data, new_data)
    with open('/home/miltron/.openclaw/workspace/fisconegociomx/guia/index.html', 'w') as f:
        f.write(content)
    print("SUCCESS: Replacement done")
else:
    print("ERROR: old_data not found")
