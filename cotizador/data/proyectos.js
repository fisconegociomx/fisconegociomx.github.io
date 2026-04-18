/**
 * data/proyectos.js — Gestión de Proyecto
 * Datos estáticos: tipos de proyecto, tarifas, multiplicadores
 */

window.DATOS_PROYECTO = {

  // ── Tipos de proyecto ──────────────────────────────────────────────────────
  TIPOS: {
    IMPLEMENTACION: {
      key: 'IMPLEMENTACION',
      nombre: 'Implementación Fiscal',
      icon: '🏗️',
      desc: 'Diseño e implementación de procesos fiscales desde cero (altas, CFDI, declaraciones periódicas)',
      valorHora: 1200,
      horasMin: 20,
      horasMax: 40
    },
    REESTRUCTURACION: {
      key: 'REESTRUCTURACION',
      nombre: 'Reestructuración Fiscal',
      icon: '🔄',
      desc: 'Diagnóstico y reestructuración de situación fiscal, remediación de obligaciones vencidas',
      valorHora: 1500,
      horasMin: 30,
      horasMax: 60
    },
    MIGRACION: {
      key: 'MIGRACION',
      nombre: 'Migración de Régimen',
      icon: '↗️',
      desc: 'Cambio de régimen fiscal (RESICO → General, PF → PM, etc.) con análisis de impacto',
      valorHora: 1200,
      horasMin: 15,
      horasMax: 30
    },
    ESTRATEGICA: {
      key: 'ESTRATEGICA',
      nombre: 'Consultoría Estratégica',
      icon: '📋',
      desc: 'Revisión integral, planeación fiscal, optimización de carga tributaria',
      valorHora: 1500,
      horasMin: 10,
      horasMax: 25
    },
    PERSONALIZADO: {
      key: 'PERSONALIZADO',
      nombre: 'Proyecto Personalizado',
      icon: '📦',
      desc: 'Descripción libre abierta (captura tus necesidades en el siguiente paso)',
      valorHora: 1200,
      horasMin: 10,
      horasMax: 100
    }
  },

  // ── Régimen fiscal actual del cliente ────────────────────────────────────
  REGIMENES: {
    RESICO: {
      key: 'RESICO',
      nombre: 'RESICO',
      icon: '🧾',
      desc: 'Régimen Simplificado de Confianza',
      tipo: 'Persona Física'
    },
    PF_ACTIVIDAD: {
      key: 'PF_ACTIVIDAD',
      nombre: 'PF Actividad Empresarial',
      icon: '💼',
      desc: 'Persona Física con actividad profesional o negocio',
      tipo: 'Persona Física'
    },
    PLATAFORMAS: {
      key: 'PLATAFORMAS',
      nombre: 'Régimen de Plataformas',
      icon: '📱',
      desc: 'Ingresos por plataformas digitales (Uber, Airbnb, Rappi, etc.)',
      tipo: 'Persona Física'
    },
    GENERAL_LEY: {
      key: 'GENERAL_LEY',
      nombre: 'General de Ley (PM)',
      icon: '🏢',
      desc: 'Personas Morales (S.A. de C.V., S. de R.L., A.C., etc.)',
      tipo: 'Persona Moral'
    },
    SIN_ALTA: {
      key: 'SIN_ALTA',
      nombre: 'Sin alta aún',
      icon: '🌱',
      desc: 'El cliente aún no tiene RFC o alta ante el SAT',
      tipo: 'Sin alta'
    }
  },

  // ── Tamaño del cliente ───────────────────────────────────────────────────
  TAMANOS: {
    MICRO: {
      key: 'MICRO',
      nombre: 'Micro / En fase inicial',
      icon: '🔹',
      desc: '0 empleados / sin negocio aún o ingresos mínimos',
      multiplicador: 0.8
    },
    PEQUENA: {
      key: 'PEQUENA',
      nombre: 'Pequeña empresa',
      icon: '🔸',
      desc: '1–5 empleados / hasta $500k ingresos',
      multiplicador: 1.0
    },
    MEDIANA: {
      key: 'MEDIANA',
      nombre: 'Mediana',
      icon: '🔶',
      desc: '6–20 empleados / $500k–$3M ingresos',
      multiplicador: 1.3
    },
    MEDIANA_GRANDE: {
      key: 'MEDIANA_GRANDE',
      nombre: 'Mediana-Grande',
      icon: '🔷',
      desc: '21–50 empleados / $3M–$10M ingresos',
      multiplicador: 1.6
    },
    GRANDE: {
      key: 'GRANDE',
      nombre: 'Grande',
      icon: '🟡',
      desc: '51+ empleados / +$10M ingresos',
      multiplicador: 2.0
    }
  },

  // ── Obligaciones vencidas ────────────────────────────────────────────────
  OBLIGACIONES: {
    NINGUNA: {
      key: 'NINGUNA',
      nombre: 'No, está al día',
      icon: '✅',
      desc: 'Cliente al corriente en todas sus obligaciones',
      multiplicador: 1.0
    },
    UNO_TRES_MESES: {
      key: 'UNO_TRES_MESES',
      nombre: 'Sí, 1–3 meses',
      icon: '⚠️',
      desc: 'Obligaciones vencidas de 1 a 3 meses',
      multiplicador: 1.25
    },
    TRES_DOCE_MESES: {
      key: 'TRES_DOCE_MESES',
      nombre: 'Sí, 3–12 meses',
      icon: '🚨',
      desc: 'Obligaciones vencidas entre 3 y 12 meses',
      multiplicador: 1.50
    },
    MAS_DE_UN_ANO: {
      key: 'MAS_DE_UN_ANO',
      nombre: 'Sí, más de 12 meses o carta invitación SAT',
      icon: '🔴',
      desc: 'Situación grave, posible carta invitación o requerimientos formales',
      multiplicador: 1.80
    }
  },

  // ── Gestión requerida SAT/IMSS ────────────────────────────────────────────
  GESTIONES: {
    NINGUNA: {
      key: 'NINGUNA',
      nombre: 'No se requiere',
      icon: '❌',
      desc: 'Solo consultoría y documentación',
      cargoFijo: 0
    },
    SAT: {
      key: 'SAT',
      nombre: 'Representación ante SAT',
      icon: '🏛️',
      desc: 'Devoluciones, aclaraciones, RFC, cancelaciones',
      cargoFijo: 5000
    },
    IMSS: {
      key: 'IMSS',
      nombre: 'Gestión IMSS',
      icon: '🏥',
      desc: 'Altas/bajas de trabajador,斯蒂芬',
      cargoFijo: 5000
    },
    AMBAS: {
      key: 'AMBAS',
      nombre: 'Ambos (SAT + IMSS)',
      icon: '⚙️',
      desc: 'Representación SAT + Gestión IMSS',
      cargoFijo: 8000
    }
  },

  // ── Duración del proyecto ────────────────────────────────────────────────
  DURACIONES: {
    URGENTE: {
      key: 'URGENTE',
      nombre: 'Urgente (1–2 semanas)',
      icon: '⚡',
      desc: 'Entrega en menos de 15 días',
      multiplicador: 1.30,
      badge: 'urgent'
    },
    CORTO: {
      key: 'CORTO',
      nombre: 'Corto plazo (1 mes)',
      icon: '📅',
      desc: '4 semanas',
      multiplicador: 1.0,
      badge: 'base'
    },
    MEDIANO: {
      key: 'MEDIANO',
      nombre: 'Mediano plazo (2–3 meses)',
      icon: '📆',
      desc: '8–12 semanas',
      multiplicador: 0.90,
      badge: 'relaxed'
    },
    FLEXIBLE: {
      key: 'FLEXIBLE',
      nombre: 'Flexible (sin fecha límite)',
      icon: '�自由的',
      desc: 'Sin fecha límite definida',
      multiplicador: 0.85,
      badge: 'relaxed'
    }
  },

  // ── Modalidad de acompañamiento ──────────────────────────────────────────
  MODALIDADES: {
    SOLO_ENTREGABLES: {
      key: 'SOLO_ENTREGABLES',
      nombre: 'Solo entregables',
      icon: '📁',
      desc: 'Documentos y archivos sin reuniones',
      multiplicador: 0.85
    },
    ACOMPANAMIENTO: {
      key: 'ACOMPANAMIENTO',
      nombre: 'Con acompañamiento',
      icon: '🤝',
      desc: 'Incluye reuniones periódicas (quincenales)',
      multiplicador: 1.0
    },
    SESION_INICIAL: {
      key: 'SESION_INICIAL',
      nombre: 'Llamada / Sesión inicial + entrega',
      icon: '📞',
      desc: 'Una sesión de alineación + entregables',
      multiplicador: 1.10
    },
    ACOMPANAMIENTO_COMPLETO: {
      key: 'ACOMPANAMIENTO_COMPLETO',
      nombre: 'Acompañamiento completo',
      icon: '🛡️',
      desc: 'Mes completo de soporte continuo',
      multiplicador: 1.40
    }
  }
};
