# SPEC.md — Fase 2: Asesoría Fiscal
## Cotizador Fisconegocio — Módulo independiente

---

## 1. Descripción del flujo

Este módulo se activa desde el **Paso 0** cuando el usuario selecciona **"Asesoría fiscal"**. Es un wizard separado del cotizador mensual existente (Servicios mensuales) y del resto de las fases por construir.

**Flujo:** Paso 0 → AF-1 → AF-2 → AF-3 → AF-4 → Datos del cliente

**Principios de diseño:**
- No assumes que el cliente ya tiene un régimen fiscal definido — muchas veces viene a asesoría justamente por eso
- El wizard guía, no pregunta todo de golpe
- El precio se calcula en tiempo real desde el primer paso
- El resultado final es una cotización formal, igual que el cotizador actual

---

## 2. Pasos del wizard

### Paso AF-0 (ya existe): "¿Qué quieres cotizar?"
Opciones visuales con íconos. Al seleccionar "Asesoría fiscal" se carga `asesoria-fiscal.js` y se muestra `sec-af-1`.

---

### AF-1 — Tipo de Asesoría

**Pregunta:** "¿Qué tipo de asesoría necesitas?"
**Subtexto:** "Selecciona la que mejor describa tu situación actual."

**Opciones (cards seleccionables, single-select):**

| ID | Nombre | Descripción | Indicador de complejidad |
|---|---|---|---|
| `puntual` | Asesoría Puntual | Consulta sobre un tema específico. Ideal para dudas concretas. | Baja |
| `mensual` | Asesoría Mensual | Acompañamiento fiscal permanente con consultas ilimitadas. | Media |
| `proyecto` | Asesoría por Proyecto | Trámite, regularización o análisis complejo con entregable definido. | Alta |
| `revision` | Revisión / Diagnóstico | Evaluación completa de tu situación fiscal actual. | Media |

**Lógica:**
- Single-select (click en card desselecciona la anterior)
- Al seleccionar, se guarda `af.tipo` y se habilita el botón "Siguiente"
- Se muestra una barra de "complejidad estimada" que da visibilidad del rango de precio

**Pricing seed:** Este paso define el multiplicador base de la cotización.

---

### AF-2 — Régimen Fiscal y Contexto

**Pregunta:** "¿Cuál es tu situación fiscal actual?"
**Subtexto:** "No te preocupes si no estás seguro — selecciona la opción que más se acerque."

**Preguntas:**
1. **Tipo de contribuyente:**
   - Persona Física
   - Persona Moral

2. **Régimen fiscal (si PF):**
   - RESICO
   - PF Actividad Empresarial
   - Régimen de Plataformas Digitales
   - No lo sé / Aún no me doy de alta

3. **Régimen fiscal (si PM):**
   - General de Ley
   - No lo sé / Aún no constituido

4. **¿Ya tienes RFC activo ante el SAT?**
   - Sí, con obligaciones activas
   - Sí, pero sin movimiento
   - No, aún no me doy de alta
   - No estoy seguro

5. **¿Has recibido algún aviso o requerimiento del SAT?**
   - No
   - Sí — carta instructiva
   - Sí — resolución/oficio
   - No estoy seguro

**Lógica:**
- Las preguntas son secuenciales pero todas visibles (accordion collapsed por default, expande la siguiente al responder la anterior)
- Se guarda `af.regimen`, `af.contribuyente`, `af.rfcStatus`, `af.satNotice`
- Si el usuario seleccionó "Asesoría Puntual" en AF-1 y no sabe su régimen, se muestra un aviso: "Para una asesoría puntual sobre régimen fiscal, este contexto es suficiente. Continúa."
- Pricing: el régimen "No lo sé / Sin dar de alta" suma un cargo por asesoría de incorporación

---

### AF-3 — Detalle del servicio

**Comportamiento depends del tipo seleccionado en AF-1:**

#### Si `puntual`:
**Pregunta:** "¿Sobre qué tema necesitas la asesoría?"
**Opciones:**
- Cambio de régimen fiscal
- Facturación / CFDI
- Declarationes (mensuales, anuales)
- IMSS / Nómina
- Subsidios y estímulos fiscales
- Otra / No estoy seguro

**Campo adicional:**
- textarea: "Describe brevemente tu situación o pregunta" (placeholder: "Ej: Quiero cambiar de RESICO a Régimen General porque mis ingresos ya superaron los 3.5 millones...")

#### Si `mensual`:
**Pregunta:** "¿Qué nivel de acompañamiento necesitas?"

| Nivel | Precio/mes | Descripción |
|---|---|---|
| Escencial | $1,200 MXN | Hasta 4 consultas/mes, respuesta en 48h, alertas de obligaciones |
| Profesional | $2,500 MXN | Consultas ilimitadas, respuesta en 24h, revisión trimestral de cumplimiento |
| Premium | $4,500 MXN | Todo lo anterior + sesiones 1:1 mensuales + optimización fiscal proactiva |

**Fields adicionales:**
- ¿Tienes empleados en nómina? (Sí/No) — si sí, agregar gestión de nómina +$400/empleado/mes
- ¿Necesitas emisión de CFDI? (Sí/No) — si sí, +$500/mes (hasta 50 CFDIs)

#### Si `proyecto`:
**Pregunta:** "¿Qué tipo de proyecto?"

| Proyecto | Precio base | Descripción |
|---|---|---|
| Alta de RFC / régimen fiscal | $800 MXN | Trámite completo de inscripción ante el SAT |
| Constitución de persona moral | $3,500 MXN | Constitución de S. de R.L. o S.A. de C.V., alta RFC, первый trámite |
| Regularización fiscal | $2,500–$6,000 MXN | Depende de años en omisión (ver tabla de complejidad) |
| Diseño de estructura fiscal | $4,000 MXN | Análisis de régimen óptimo, simulaciones, recomendación |
| Defensa fiscal / recurso | $3,000–$8,000 MXN | Depende de complejidad del caso (ver tabla) |
| Due diligence fiscal | $5,000 MXN | Revisión completa de situación fiscal de empresa |

**Sub-preguntas:**
- Número de años en omisión (si regularización): 1 / 2 / 3 / 4 / 5+ — ajusta el precio
- Tipo de requerimiento SAT (si defensa): Carta instructiva / Resolución de liquidación / Otro
- Volumen de empleados (si constitución PM): 0 / 1–5 / 6–20 / 21+ — ajusta precio de alta

**Campo:**
- textarea: "Describe tu proyecto o situación" (placeholder: "Llevo 3 años emitiendo facturas sin estar dado de alta...")

#### Si `revision`:
**Pregunta:** "¿Qué alcance tiene la revisión?"
- Revisión fiscal express (régimen + cumplimiento actual): $1,500 MXN
- Diagnóstico completo (régimen, obligaciones, nómina, riesgos): $3,000 MXN
- Evaluación pre-inversión / due diligence: $5,000 MXN

**Campo:**
- textarea: "¿Qué te gustaría revisar?" (placeholder: "Quiero saber si estoy pagando los impuestos correctos...")

---

### AF-4 — Urgencia y Formato

**Pregunta:** "¿Qué tan pronto necesitas la asesoría?"

| Opción | Descripción | Ajuste de precio |
|---|---|---|
| Sin urgencia | Respuesta en 5–7 días hábiles | Base |
| Prioritaria | Respuesta en 48h hábiles | +20% |
| Urgente | Respuesta en 24h o menos | +35% |

**Formato de entrega:**
- Videollamada / Llamada telefónica
- Documento escrito / Dictamen
- Ambos (videollamada + documento)

---

### Datos del Cliente (comparte con cotizador existente)

Esta fase reutiliza el Paso 4 del cotizador actual (formulario de cliente, sin cambios).

---

## 3. Campos y opciones — Resumen

### Variables de estado del wizard

```javascript
af = {
  tipo: null,           // 'puntual' | 'mensual' | 'proyecto' | 'revision'
  contribuyente: null,  // 'pf' | 'pm'
  regimen: null,        // 'resico' | 'pf_emp' | 'plataformas' | 'general_ley' | 'no_sabe'
  rfcStatus: null,     // 'activo' | 'sin_movimiento' | 'sin_alta' | 'no_sabe'
  satNotice: null,      // 'no' | 'carta' | 'resolucion' | 'no_sabe'
  // Puntual
  temaPuntual: null,
  descripcion: '',
  // Mensual
  nivelMensual: null,  // 'esencial' | 'profesional' | 'premium'
  conNomina: false,
  numEmpleados: 0,
  conFacturacion: false,
  // Proyecto
  tipoProyecto: null,
  anosOmision: 0,
  tipoRequerimiento: null,
  numEmpleadosPM: 0,
  descripcionProyecto: '',
  // Revision
  alcanceRevision: null,
  descripcionRevision: '',
  // Urgencia
  urgencia: 'normal',   // 'normal' | 'prioritaria' | 'urgente'
  formatoEntrega: null,  // 'videollamada' | 'documento' | 'ambos'
}
```

### Catálogo de precios base

```javascript
const AF_PRICES = {
  puntual: {
    cambio_regimen:      800,
    facturacion_cfdi:   600,
    declaraciones:       700,
    imss_nomina:         900,
    subsidios_estímulos:  500,
    otra:                700,
  },
  mensual: {
    esencial:    1200,
    profesional: 2500,
    premium:     4500,
  },
  proyecto: {
    alta_rfc:             800,
    constitucion_pm:      3500,
    regularizacion: {
      base: 2500,
      porAno: 800,       // anosOmision - 1 * 800
      max: 6000,
    },
    diseno_estructura:    4000,
    defensa_fiscal: {
      carta_instructiva:  3000,
      resolucion_liq:      5500,
      otro:                8000,
    },
    due_diligence:        5000,
  },
  revision: {
    express:   1500,
    completa:  3000,
    preInversion: 5000,
  },
  // Add-ons
  nomina: 400,          // por empleado / mes
  facturacion: 500,      // por mes (hasta 50 CFDIs)
  urgencia: {
    normal:      1.0,
    prioritaria: 1.20,
    urgente:     1.35,
  },
  incorporacion: 500,   // cargo extra si no tiene RFC / no ha iniciado
};
```

---

## 4. Lógica de pricing

### Fórmula general

```
subtotal = precio_base_servicio + sum(addons) + cargo_incorporacion
descuento_promo = subtotal * pct_descuento (si aplica)
subtotal_descuento = subtotal - descuento_promo
iva = subtotal_descuento * 0.16
total = subtotal_descuento + iva
total_mensual = total / meses_contrato (si aplica)
```

### Detalle por tipo

**Puntual:**
```
precio = precio_base_por_tema * factor_urgencia
```
Sin IVA en el precio mostrado (se puede agregar en cotización formal). Servicio de una sola ocasión.

**Mensual:**
```
precio = precio_nivel + (nomina ? num_empleados * 400 : 0) + (facturacion ? 500 : 0)
precio_mensual = precio * factor_urgencia
```
El add-on de nómina solo aparece si el usuario marcó "sí" en la pregunta correspondiente.

**Proyecto:**
```
precio = precio_base_proyecto
// Regularización: base + (anos - 1) * 800, capped a 6000
// Defensa: según tipo de requerimiento
precio_mensual = precio  // se presenta como un solo monto
```
Los proyectos pueden incluir un cargo por "sesión de arranque" de bienvenida ($300 MXN adicionales) que se muestra como línea separada.

**Revisión:**
```
precio = precio_alcance
```
Se muestra como monto único.

### Urgencia
```
factor = AF_PRICES.urgencia[urgencia]
subtotal = precio_base * factor
```

### Cargo por incorporación (RFC no activo)
```
if (rfcStatus === 'sin_alta' || rfcStatus === 'no_sabe') {
  cargo_incorporacion = 500;
}
```

### Descuentos por volumen (solo para mensual)
- 3 meses prepagados: 5% descuento
- 6 meses prepagados: 10% descuento
- 12 meses prepagados: 15% descuento

### Generación de folio
```
'AF-' + año(2 dígitos) + mes(2 dígitos) + '-' + random(4 dígitos)
Ejemplo: AF-2604-7293
```

---

## 5. Notas técnicas para implementación

### Arquitectura
- Mantener en archivo separado: `asesoria-fiscal.js` que se carga condicionalmente cuando el usuario selecciona "Asesoría fiscal" en Paso 0
- El state management del wizard de asesoría vive en un objeto `af` separado del state `S` del cotizador mensual para evitar colisiones
- Cuando el usuario llega al paso de "Datos del cliente", el state `af` se normaliza a un formato compatible con la función `generatePDF()` existente del cotizador, para reutilizar el modal de impresión y el PDF

### Integración con Paso 0
```javascript
// En el handler de click del Paso 0:
function selectTipoCotizacion(tipo) {
  if (tipo === 'asesoria_fiscal') {
    // Ocultar sec1-4 del cotizador mensual
    document.querySelectorAll('.cotizador-mensual .sec').forEach(s => s.classList.remove('active'));
    // Mostrar wizard de asesoría
    document.getElementById('wizard-asesoria').style.display = 'block';
    initWizardAsesoria();
  } else {
    // Flujo normal del cotizador mensual
  }
}
```

### UX / UI
- Usar el mismo sistema de steps visual del cotizador actual (`.hs`, `.hs-line`)
- Los cards de selección deben tener el mismo estilo `.r-card` del cotizador actual
- La floating bar de total se muestra desde AF-3 en adelante
- En AF-3, el panel de "precio estimado" aparece en tiempo real conforme el usuario responde
- Usar `calcTotal()` expuesta globalmente para actualizar la barra flotante en cada cambio

### Notas para Fernando
- Los precios son **referenciales**. Se mostrarán en la cotización formal con la leyenda: "Precios sujetos a confirmación según complejidad del caso."
- La asesoría `puntual` no incluye follow-up. Si el cliente necesita aclarar algo, se cotiza como otra asesoría puntual o se upsell a mensual.
- La `regularización fiscal` tiene un precio estimado máximo de $6,000 MXN. Casos más complejos se discuten personalmente.
- La `defensa fiscal` puede requerir representación legal (despacho jurídico). El precio de la asesoría NO incluye honorarios del abogado, solo la asesoría técnica-contable.

### Compatibilidad
- El PDF generado usa la misma función `generatePDF()` con un objeto `afNormalized` que mapea al formato esperado:
  ```javascript
  afNormalized = {
    regime: { name: 'Asesoría Fiscal', icon: '📋' },
    level: { name: nivel_servicio },
    base: precio_base,
    addons: [...addons_items],
    total: total_final,
    folio: folio_asesoria,
    client: {...}
  }
  ```

### Estados de validación
| Campo | Validación | Mensaje |
|---|---|---|
| AF-1 tipo | Requerido | "Selecciona el tipo de asesoría para continuar" |
| AF-2 contribuyente | Requerido | "Indica si eres persona física o moral" |
| AF-3 específico | Depende del tipo | Ver arriba |
| Datos cliente nombre | Requerido | "Ingresa el nombre del cliente" |
| Datos cliente contacto | Al menos uno (tel o email) | "Necesitamos al menos un medio de contacto" |
