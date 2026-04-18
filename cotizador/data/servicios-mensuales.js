/**
 * data/servicios-mensuales.js
 * Datos del Flujo 1 — Servicios Mensuales
 * Extraído del cotizador monolítico para modularización multi-flujo.
 *
 * Expone como globales:
 *   SM_R, SM_PRICES, SM_LV, SM_ADDONS, SM_OBLIG_ITEMS, SM_PROMO_CODES
 *
 * Nota: Se prefija "SM_" para evitar colisiones con otras variables globales
 * cuando convivan múltiples flujos en la misma página.
 * El módulo js/modules/servicios-mensuales.js los referencia internamente.
 */

/* ─── Regímenes ─────────────────────────────────────────────────────────── */
const SM_R = {
  resico:      { name: 'RESICO',                     icon: '🧾', tipo: 'Persona Física'  },
  pf_emp:      { name: 'PF Actividad Empresarial',   icon: '💼', tipo: 'Persona Física'  },
  plataformas: { name: 'Régimen de Plataformas',      icon: '📱', tipo: 'Persona Física'  },
  pm_general:  { name: 'General de Ley — PM',         icon: '🏢', tipo: 'Persona Moral'   },
};

/* ─── Precios base por régimen × nivel ─────────────────────────────────── */
const SM_PRICES = {
  resico:      { basico:  950, avanzado: 1750, empresarial: 3350 },
  pf_emp:      { basico: 1800, avanzado: 3400, empresarial: 6800 },
  plataformas: { basico: 1650, avanzado: 3400, empresarial: 6800 },
  pm_general:  { basico: 2500, avanzado: 5000, empresarial: 9800 },
};

/* ─── Niveles de servicio ───────────────────────────────────────────────── */
const SM_LV = {
  basico: {
    k: 'b', name: 'Básico',
    desc: 'Para quienes inician o tienen operaciones simples.',
    feats: {
      resico:      ['Declaraciones mensuales ISR e IVA', 'Alta y actualización de RFC', 'Declaración anual', 'Alertas de obligaciones', 'Atención por WhatsApp'],
      pf_emp:      ['Declaraciones mensuales ISR e IVA', 'Alta y actualización de RFC', 'Pagos provisionales', 'Declaración anual', 'Atención por WhatsApp'],
      plataformas: ['Declaraciones mensuales plataformas', 'Alta y actualización de RFC', 'Conciliación básica', 'Declaración anual', 'Atención por WhatsApp'],
      pm_general:  ['Declaraciones mensuales ISR/IVA/IMSS', 'Alta y actualización de RFC', 'DIOT mensual', 'Declaración anual', 'Atención por WhatsApp'],
    },
  },
  avanzado: {
    k: 'a', name: 'Avanzado', popular: true,
    desc: 'Para negocios activos con cumplimiento completo y soporte ampliado.',
    feats: {
      resico:      ['Todo lo del Básico', 'Contabilidad electrónica', 'Atención a requerimientos SAT', 'Declaraciones informativas', 'Consultas sin límite', 'Revisión preventiva semestral'],
      pf_emp:      ['Todo lo del Básico', 'Contabilidad electrónica', 'DIOT mensual', 'Atención a requerimientos SAT', 'Consultas sin límite', 'Revisión preventiva semestral'],
      plataformas: ['Todo lo del Básico', 'Contabilidad electrónica', 'Conciliación multi-plataforma', 'Atención a requerimientos SAT', 'Consultas sin límite', 'Revisión preventiva semestral'],
      pm_general:  ['Todo lo del Básico', 'Contabilidad electrónica completa', 'Declaraciones informativas', 'Atención a requerimientos SAT', 'Consultas sin límite', 'Revisión preventiva trimestral'],
    },
  },
  empresarial: {
    k: 'e', name: 'Empresarial',
    desc: 'Acompañamiento fiscal y administrativo total para empresas consolidadas.',
    feats: {
      resico:      ['Todo lo del Avanzado', 'Acompañamiento fiscal permanente', 'Asesoría de modelo de negocio', 'Plan administrativo', 'Sesiones mensuales', 'Optimización fiscal proactiva', 'Atención prioritaria'],
      pf_emp:      ['Todo lo del Avanzado', 'Acompañamiento fiscal permanente', 'Asesoría de modelo de negocio', 'Plan administrativo', 'Sesiones mensuales', 'Optimización fiscal proactiva', 'Atención prioritaria'],
      plataformas: ['Todo lo del Avanzado', 'Acompañamiento fiscal permanente', 'Asesoría de modelo de negocio', 'Plan administrativo', 'Sesiones mensuales', 'Optimización fiscal proactiva', 'Atención prioritaria'],
      pm_general:  ['Todo lo del Avanzado', 'Acompañamiento fiscal permanente', 'Asesoría de modelo de negocio', 'Plan administrativo', 'Sesiones mensuales', 'Optimización fiscal proactiva', 'Atención prioritaria'],
    },
  },
};

/* ─── Addons ────────────────────────────────────────────────────────────── */
const SM_ADDONS = [
  {
    id: 'cont_elec', name: 'Contabilidad Electrónica', plus: false,
    desc: 'Registro contable completo con envío mensual al SAT. Balanza y catálogo de cuentas.',
    price: { resico: 600, pf_emp: 600, plataformas: 550, pm_general: 1200 },
    note: 'Requerida legalmente en varios regímenes',
    includedIn: ['avanzado', 'empresarial'],
  },
  {
    id: 'acomp', name: 'Acompañamiento Fiscal Permanente', plus: true,
    desc: 'Asesor dedicado para consultas en tiempo real, revisión de contratos y blindaje ante el SAT.',
    price: { resico: 700, pf_emp: 1000, plataformas: 750, pm_general: 2000 },
    note: 'Previene multas y optimiza tu carga fiscal',
    includedIn: ['avanzado', 'empresarial'],
  },
  {
    id: 'facturacion', name: 'Emisión de CFDI (Facturación)', plus: false,
    desc: 'Emisión y envío de facturas a tus clientes. Hasta 50 CFDIs mensuales incluidos.',
    price: { resico: 500, pf_emp: 500, plataformas: 500, pm_general: 500 },
    note: '+$200 por cada 50 CFDIs adicionales',
    includedIn: [],
  },
  {
    id: 'nomina', name: 'Nómina', plus: false,
    desc: 'Cálculo y timbrado de nómina, altas IMSS, retenciones ISR y cuotas patronales.',
    pricePerEmp: { resico: 360, pf_emp: 360, plataformas: 360, pm_general: 360 },
    note: 'Por empleado / mes · mínimo 1',
    includedIn: [], hasCounter: true,
  },
  {
    id: 'oblig', name: 'Obligaciones Fiscales Especiales', plus: false,
    desc: 'Activa solo las obligaciones que apliquen a tu actividad. Precio individual por obligación.',
    price: { resico: 0, pf_emp: 0, plataformas: 0, pm_general: 0 },
    note: 'Selecciona las que apliquen',
    includedIn: [], hasSubItems: true,
  },
  {
    id: 'decl_inf', name: 'Declaraciones Informativas', plus: false,
    desc: 'DIOT, DIM, retenciones e información de pagos. Revisión y envío al SAT.',
    price: { resico: 300, pf_emp: 400, plataformas: 400, pm_general: 700 },
    note: 'Anual o según periodicidad',
    includedIn: ['avanzado', 'empresarial'],
  },
  {
    id: 'asesoria', name: 'Asesoría de Modelo de Negocio', plus: true,
    desc: 'Análisis y diseño de estructura legal-fiscal óptima. Incluye 2 sesiones mensuales.',
    price: { resico: 700, pf_emp: 800, plataformas: 750, pm_general: 1500 },
    note: 'Sesiones adicionales: $500 c/u',
    includedIn: ['empresarial'],
  },
  {
    id: 'plan_admin', name: 'Seguimiento Plan Administrativo', plus: true,
    desc: 'Flujo de caja, presupuestos y KPIs financieros. Reporte mensual.',
    price: { resico: 700, pf_emp: 700, plataformas: 650, pm_general: 1200 },
    note: 'Incluye reporte ejecutivo mensual',
    includedIn: ['empresarial'],
  },
  {
    id: 'sesiones', name: 'Sesiones de Seguimiento', plus: true,
    desc: 'Sesiones 1:1 para revisión fiscal, dudas y estrategia. Videollamada o presencial.',
    price: { resico: 400, pf_emp: 500, plataformas: 450, pm_general: 800 },
    note: 'Precio por sesión extra (2 incluidas en Empresarial)',
    includedIn: ['empresarial'],
  },
];

/* ─── Obligaciones fiscales especiales ─────────────────────────────────── */
const SM_OBLIG_ITEMS = [
  { id: 'o_iva_ret',     name: 'IVA Retenido',                   desc: 'Declaración mensual de IVA retenido a terceros',                     price: 200 },
  { id: 'o_ieps',        name: 'IEPS',                           desc: 'Impuesto Especial sobre Producción y Servicios',                     price: 350 },
  { id: 'o_isn',         name: 'Impuesto sobre Nómina (ISN)',    desc: 'Impuesto estatal sobre nómina. Varía por estado.',                   price: 250 },
  { id: 'o_ret_isr',     name: 'Retenciones ISR a Terceros',     desc: 'ISR retenido a proveedores de servicios profesionales',              price: 200 },
  { id: 'o_cedular',     name: 'Impuesto Cedular',               desc: 'Arrendadores y actividades profesionales estatales',                 price: 200 },
  { id: 'o_frontera',    name: 'IVA Frontera Norte (Tasa 0%)',   desc: 'Aplicable en región fronteriza norte de México',                    price: 250 },
  { id: 'o_ieps_beb',    name: 'IEPS Bebidas Azucaradas',        desc: 'Impuesto a bebidas con azúcar, saborizantes o energizantes',        price: 300 },
  { id: 'o_rep_cap',     name: 'Reportes de Capital Extranjero', desc: 'Información de inversiones y capitales del extranjero',             price: 450 },
  { id: 'o_econt_ext',   name: 'Contabilidad Electrónica Extra', desc: 'Módulos adicionales: activos fijos, inventarios, cuentas de orden', price: 300 },
  { id: 'o_inf_tercero', name: 'Inf. de Operaciones con Terceros', desc: 'Declaración informativa adicional (fuera de DIOT estándar)',       price: 280 },
];

/* ─── Códigos de descuento ──────────────────────────────────────────────── */
const SM_PROMO_CODES = {
  'FISCO5%2K26':  { pct: 5,  label: 'Descuento 5%'  },
  'FISCO10%2K26': { pct: 10, label: 'Descuento 10%' },
  'FISCO15%2K26': { pct: 15, label: 'Descuento 15%' },
};
