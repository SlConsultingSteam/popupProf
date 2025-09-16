const API_BASE = "https://api-postgre-ee5da0d4a499.herokuapp.com";
// --- Lógica de colores para campos de fechas ---
function aplicarLogicaColoresFechas(clone) {
  // --- Colores automáticos para fecha_asignacion_supervisora ---
  const gestoraInp = clone.querySelector('[data-field="fecha_asignacion_gestora"]');
  const supervisoraInp = clone.querySelector('[data-field="fecha_asignacion_supervisora"]');

  function actualizarColorSupervisora() {
    if (!gestoraInp || !supervisoraInp) return;
    const fechaGestora = gestoraInp.value;
    const fechaSupervisora = supervisoraInp.value;
    if (!fechaGestora || !fechaSupervisora) {
      supervisoraInp.style.backgroundColor = '';
      return;
    }
    const dGestora = new Date(fechaGestora);
    const dSupervisora = new Date(fechaSupervisora);
    const msPorDia = 24 * 60 * 60 * 1000;
    const diffDias = Math.floor((dSupervisora - dGestora) / msPorDia);
    if (diffDias < 0) {
      supervisoraInp.style.backgroundColor = '#9b9b9b';
    } else if (diffDias > 2) {
      supervisoraInp.style.backgroundColor = '#ff4d4d';
    } else {
      supervisoraInp.style.backgroundColor = '';
    }
  }
  if (gestoraInp && supervisoraInp) {
    gestoraInp.addEventListener('change', actualizarColorSupervisora);
    supervisoraInp.addEventListener('change', actualizarColorSupervisora);
    setTimeout(actualizarColorSupervisora, 0);
  }

  // --- Colores automáticos para fecha_realizacion_profesional ---
  const realizacionInp = clone.querySelector('[data-field="fecha_realizacion_profesional"]');
  function actualizarColorRealizacion() {
    if (!realizacionInp || !supervisoraInp) return;
    const fechaRealizacion = realizacionInp.value;
    const fechaSupervisora = supervisoraInp.value;
    if (!fechaRealizacion || !fechaSupervisora) {
      realizacionInp.style.backgroundColor = '';
      return;
    }
    const dRealizacion = new Date(fechaRealizacion);
    const dSupervisora = new Date(fechaSupervisora);
    const msPorDia = 24 * 60 * 60 * 1000;
    const diffDias = Math.floor((dRealizacion - dSupervisora) / msPorDia);
    if (diffDias > 2) {
      realizacionInp.style.backgroundColor = '#ff4d4d';
    } else if (diffDias < 0) {
      realizacionInp.style.backgroundColor = '#9b9b9b';
    } else {
      realizacionInp.style.backgroundColor = '';
    }
  }
  if (realizacionInp && supervisoraInp) {
    realizacionInp.addEventListener('change', actualizarColorRealizacion);
    supervisoraInp.addEventListener('change', actualizarColorRealizacion);
    setTimeout(actualizarColorRealizacion, 0);
  }

  // --- Colores automáticos para fecha_ideal_min ---
  const idealMinInp = clone.querySelector('[data-field="fecha_ideal_min"]');
  function actualizarColorIdealMin() {
    if (!idealMinInp || !realizacionInp) return;
    const fechaIdealMin = idealMinInp.value;
    const fechaRealizacion = realizacionInp.value;
    if (!fechaIdealMin || !fechaRealizacion) {
      idealMinInp.style.backgroundColor = '';
      return;
    }
    const dIdealMin = new Date(fechaIdealMin);
    const dRealizacion = new Date(fechaRealizacion);
    if (dIdealMin.getTime() < dRealizacion.getTime()) {
      idealMinInp.style.backgroundColor = '#9b9b9b';
    } else {
      idealMinInp.style.backgroundColor = '';
    }
  }
  if (idealMinInp && realizacionInp) {
    idealMinInp.addEventListener('change', actualizarColorIdealMin);
    realizacionInp.addEventListener('change', actualizarColorIdealMin);
    setTimeout(actualizarColorIdealMin, 0);
  }

  // --- Colores automáticos para fecha_ideal_max ---
  const idealMaxInp = clone.querySelector('[data-field="fecha_ideal_max"]');
  function actualizarColorIdealMax() {
    if (!idealMaxInp || !idealMinInp) return;
    const fechaIdealMax = idealMaxInp.value;
    const fechaIdealMin = idealMinInp.value;
    if (!fechaIdealMax || !fechaIdealMin) {
      idealMaxInp.style.backgroundColor = '';
      return;
    }
    const dIdealMax = new Date(fechaIdealMax);
    const dIdealMin = new Date(fechaIdealMin);
    const msPorDia = 24 * 60 * 60 * 1000;
    const diffDias = Math.floor((dIdealMax - dIdealMin) / msPorDia);
    if (diffDias > 2) {
      idealMaxInp.style.backgroundColor = '#ff4d4d';
    } else {
      idealMaxInp.style.backgroundColor = '';
    }
  }
  if (idealMaxInp && idealMinInp) {
    idealMaxInp.addEventListener('change', actualizarColorIdealMax);
    idealMinInp.addEventListener('change', actualizarColorIdealMax);
    setTimeout(actualizarColorIdealMax, 0);
  }

  // --- Colores automáticos para fecha_real respecto a fecha_ideal_max ---
  const realInp = clone.querySelector('[data-field="fecha_real"]');
  function actualizarColorFechaReal() {
    if (!realInp || !idealMaxInp || !idealMinInp) return;
    const fechaReal = realInp.value;
    const fechaIdealMax = idealMaxInp.value;
    const fechaIdealMin = idealMinInp.value;
    if (!fechaReal || !fechaIdealMax || !fechaIdealMin) {
      realInp.style.backgroundColor = '';
      return;
    }
    const dReal = new Date(fechaReal);
    const dIdealMax = new Date(fechaIdealMax);
    const dIdealMin = new Date(fechaIdealMin);
    if (dReal.getTime() > dIdealMax.getTime()) {
      realInp.style.backgroundColor = '#ff4d4d';
    } else if (dReal.getTime() < dIdealMin.getTime()) {
      realInp.style.backgroundColor = '#9b9b9b';
    } else {
      realInp.style.backgroundColor = '';
    }
  }
  if (realInp && idealMaxInp && idealMinInp) {
    realInp.addEventListener('change', actualizarColorFechaReal);
    idealMaxInp.addEventListener('change', actualizarColorFechaReal);
    idealMinInp.addEventListener('change', actualizarColorFechaReal);
    setTimeout(actualizarColorFechaReal, 0);
  }

  // --- Colores automáticos para fecha_ideal_inicio_muestra respecto a fecha_recibo ---
  const idealInicioInp = clone.querySelector('[data-field="fecha_ideal_inicio_muestra"]');
  const reciboInp2 = clone.querySelector('[data-field="fecha_recibo"]');
  function actualizarColorIdealInicio() {
    if (!idealInicioInp || !reciboInp2) return;
    const fechaIdealInicio = idealInicioInp.value;
    const fechaRecibo = reciboInp2.value;
    if (!fechaIdealInicio || !fechaRecibo) {
      idealInicioInp.style.backgroundColor = '';
      return;
    }
    const dIdealInicio = new Date(fechaIdealInicio);
    const dRecibo = new Date(fechaRecibo);
    const msPorDia = 24 * 60 * 60 * 1000;
    const diffDias = Math.floor((dIdealInicio - dRecibo) / msPorDia);
    if (dIdealInicio.getTime() < dRecibo.getTime()) {
      idealInicioInp.style.backgroundColor = '#9b9b9b';
    } else if (diffDias > 1) {
      idealInicioInp.style.backgroundColor = '#ff4d4d';
    } else {
      idealInicioInp.style.backgroundColor = '';
    }
  }
  if (idealInicioInp && reciboInp2) {
    idealInicioInp.addEventListener('change', actualizarColorIdealInicio);
    reciboInp2.addEventListener('change', actualizarColorIdealInicio);
    setTimeout(actualizarColorIdealInicio, 0);
  }

  // --- Colores automáticos para fecha_recibo respecto a fecha_entrega_producto ---
  const entregaInp = clone.querySelector('[data-field="fecha_entrega_producto"]');
  const reciboInp = clone.querySelector('[data-field="fecha_recibo"]');
  function actualizarColorRecibo() {
    if (!entregaInp || !reciboInp) return;
    const fechaEntrega = entregaInp.value;
    const fechaRecibo = reciboInp.value;
    if (!fechaEntrega || !fechaRecibo) {
      reciboInp.style.backgroundColor = '';
      return;
    }
    const dEntrega = new Date(fechaEntrega);
    const dRecibo = new Date(fechaRecibo);
    const msPorDia = 24 * 60 * 60 * 1000;
    const diffDias = Math.floor((dRecibo - dEntrega) / msPorDia);
    if (diffDias > 2) {
      reciboInp.style.backgroundColor = '#ff4d4d';
    } else {
      reciboInp.style.backgroundColor = '';
    }
  }
  if (entregaInp && reciboInp) {
    entregaInp.addEventListener('change', actualizarColorRecibo);
    reciboInp.addEventListener('change', actualizarColorRecibo);
    setTimeout(actualizarColorRecibo, 0);
  }

  // --- Colores automáticos para fecha_inicio_muestra respecto a fecha_ideal_inicio_muestra ---
  const inicioMuestraInp = clone.querySelector('[data-field="fecha_inicio_muestra"]');
  const idealInicioInp2 = clone.querySelector('[data-field="fecha_ideal_inicio_muestra"]');
  function actualizarColorInicioMuestra() {
    if (!inicioMuestraInp || !idealInicioInp2) return;
    const fechaInicioMuestra = inicioMuestraInp.value;
    const fechaIdealInicioMuestra = idealInicioInp2.value;
    if (!fechaInicioMuestra || !fechaIdealInicioMuestra) {
      inicioMuestraInp.style.backgroundColor = '';
      return;
    }
    const dInicioMuestra = new Date(fechaInicioMuestra);
    const dIdealInicioMuestra = new Date(fechaIdealInicioMuestra);
    if (dInicioMuestra.getTime() < dIdealInicioMuestra.getTime()) {
      inicioMuestraInp.style.backgroundColor = '#9b9b9b';
    } else if (dInicioMuestra.getTime() > dIdealInicioMuestra.getTime()) {
      inicioMuestraInp.style.backgroundColor = '#ff4d4d';
    } else {
      inicioMuestraInp.style.backgroundColor = '';
    }
  }
  if (inicioMuestraInp && idealInicioInp2) {
    inicioMuestraInp.addEventListener('change', actualizarColorInicioMuestra);
    idealInicioInp2.addEventListener('change', actualizarColorInicioMuestra);
    setTimeout(actualizarColorInicioMuestra, 0);
  }

  // --- Colores automáticos para fecha_seguimiento_real_uso respecto a fecha_ideal_seguimiento_uso ---
  const seguimientoRealUsoInp = clone.querySelector('[data-field="fecha_seguimiento_real_uso"]');
  const idealSeguimientoUsoInp = clone.querySelector('[data-field="fecha_ideal_seguimiento_uso"]');
  function actualizarColorSeguimientoRealUso() {
    if (!seguimientoRealUsoInp || !idealSeguimientoUsoInp) return;
    const fechaReal = seguimientoRealUsoInp.value;
    const fechaIdeal = idealSeguimientoUsoInp.value;
    if (!fechaReal || !fechaIdeal) {
      seguimientoRealUsoInp.style.backgroundColor = '';
      return;
    }
    const dReal = new Date(fechaReal);
    const dIdeal = new Date(fechaIdeal);
    if (dReal.getTime() < dIdeal.getTime()) {
      seguimientoRealUsoInp.style.backgroundColor = '#9b9b9b';
    } else if (dReal.getTime() > dIdeal.getTime()) {
      seguimientoRealUsoInp.style.backgroundColor = '#ff4d4d';
    } else {
      seguimientoRealUsoInp.style.backgroundColor = '';
    }
  }
  if (seguimientoRealUsoInp && idealSeguimientoUsoInp) {
    seguimientoRealUsoInp.addEventListener('change', actualizarColorSeguimientoRealUso);
    idealSeguimientoUsoInp.addEventListener('change', actualizarColorSeguimientoRealUso);
    setTimeout(actualizarColorSeguimientoRealUso, 0);
  }

  // --- Colores automáticos para fecha_real_evaluacion_monadica respecto a fecha_ideal_inicio_muestra ---
  const realMonadicaInp = clone.querySelector('[data-field="fecha_real_evaluacion_monadica"]');
  const idealInicioMonadicaInp = clone.querySelector('[data-field="fecha_ideal_inicio_muestra"]');
  function actualizarColorRealMonadica() {
    if (!realMonadicaInp || !idealInicioMonadicaInp) return;
    const fechaReal = realMonadicaInp.value;
    const fechaIdeal = idealInicioMonadicaInp.value;
    if (!fechaReal || !fechaIdeal) {
      realMonadicaInp.style.backgroundColor = '';
      return;
    }
    const dReal = new Date(fechaReal);
    const dIdeal = new Date(fechaIdeal);
    if (dReal.getTime() < dIdeal.getTime()) {
      realMonadicaInp.style.backgroundColor = '#9b9b9b';
    } else if (dReal.getTime() > dIdeal.getTime()) {
      realMonadicaInp.style.backgroundColor = '#ff4d4d';
    } else {
      realMonadicaInp.style.backgroundColor = '';
    }
  }
  if (realMonadicaInp && idealInicioMonadicaInp) {
    realMonadicaInp.addEventListener('change', actualizarColorRealMonadica);
    idealInicioMonadicaInp.addEventListener('change', actualizarColorRealMonadica);
    setTimeout(actualizarColorRealMonadica, 0);
  }

  // --- Colores automáticos para fecha_entrevista_final respecto a fecha_ideal_max_final y fecha_ideal_min_final ---
  const entrevistaFinalInp = clone.querySelector('[data-field="fecha_entrevista_final"]');
  const idealMaxFinalInp = clone.querySelector('[data-field="fecha_ideal_max_final"]');
  const idealMinFinalInp = clone.querySelector('[data-field="fecha_ideal_min_final"]');
  function actualizarColorEntrevistaFinal() {
    if (!entrevistaFinalInp || !idealMaxFinalInp || !idealMinFinalInp) return;
    const fechaFinal = entrevistaFinalInp.value;
    const fechaIdealMax = idealMaxFinalInp.value;
    const fechaIdealMin = idealMinFinalInp.value;
    if (!fechaFinal || !fechaIdealMax || !fechaIdealMin) {
      entrevistaFinalInp.style.backgroundColor = '';
      return;
    }
    const dFinal = new Date(fechaFinal);
    const dIdealMax = new Date(fechaIdealMax);
    const dIdealMin = new Date(fechaIdealMin);
    if (dFinal.getTime() > dIdealMax.getTime()) {
      entrevistaFinalInp.style.backgroundColor = '#ff4d4d';
    } else if (dFinal.getTime() < dIdealMin.getTime()) {
      entrevistaFinalInp.style.backgroundColor = '#9b9b9b';
    } else {
      entrevistaFinalInp.style.backgroundColor = '';
    }
  }
  if (entrevistaFinalInp && idealMaxFinalInp && idealMinFinalInp) {
    entrevistaFinalInp.addEventListener('change', actualizarColorEntrevistaFinal);
    idealMaxFinalInp.addEventListener('change', actualizarColorEntrevistaFinal);
    idealMinFinalInp.addEventListener('change', actualizarColorEntrevistaFinal);
    setTimeout(actualizarColorEntrevistaFinal, 0);
  }

  // --- Colores automáticos para fecha_real_restitucion respecto a fecha_ideal_maxima_restitucion ---
  const realRestitucionInp = clone.querySelector('[data-field="fecha_real_restitucion"]');
  const idealMaxRestitucionInp = clone.querySelector('[data-field="fecha_ideal_maxima_restitucion"]');
  function actualizarColorRealRestitucion() {
    if (!realRestitucionInp || !idealMaxRestitucionInp) return;
    const fechaReal = realRestitucionInp.value;
    const fechaIdealMax = idealMaxRestitucionInp.value;
    if (!fechaReal || !fechaIdealMax) {
      realRestitucionInp.style.backgroundColor = '';
      return;
    }
    const dReal = new Date(fechaReal);
    const dIdealMax = new Date(fechaIdealMax);
    if (dReal.getTime() < dIdealMax.getTime()) {
      realRestitucionInp.style.backgroundColor = '#9b9b9b';
    } else if (dReal.getTime() > dIdealMax.getTime()) {
      realRestitucionInp.style.backgroundColor = '#ff4d4d';
    } else {
      realRestitucionInp.style.backgroundColor = '';
    }
  }
  if (realRestitucionInp && idealMaxRestitucionInp) {
    realRestitucionInp.addEventListener('change', actualizarColorRealRestitucion);
    idealMaxRestitucionInp.addEventListener('change', actualizarColorRealRestitucion);
    setTimeout(actualizarColorRealRestitucion, 0);
  }

  // --- Colores automáticos para fecha_envio_real_admin respecto a fecha_ideal_envio_admin ---
  const envioRealAdminInp = clone.querySelector('[data-field="fecha_envio_real_admin"]');
  const idealEnvioAdminInp = clone.querySelector('[data-field="fecha_ideal_envio_admin"]');
  function actualizarColorEnvioRealAdmin() {
    if (!envioRealAdminInp || !idealEnvioAdminInp) return;
    const fechaReal = envioRealAdminInp.value;
    const fechaIdeal = idealEnvioAdminInp.value;
    if (!fechaReal || !fechaIdeal) {
      envioRealAdminInp.style.backgroundColor = '';
      return;
    }
    const dReal = new Date(fechaReal);
    const dIdeal = new Date(fechaIdeal);
    if (dReal.getTime() < dIdeal.getTime()) {
      envioRealAdminInp.style.backgroundColor = '#9b9b9b';
    } else if (dReal.getTime() > dIdeal.getTime()) {
      envioRealAdminInp.style.backgroundColor = '#ff4d4d';
    } else {
      envioRealAdminInp.style.backgroundColor = '';
    }
  }
  if (envioRealAdminInp && idealEnvioAdminInp) {
    envioRealAdminInp.addEventListener('change', actualizarColorEnvioRealAdmin);
    idealEnvioAdminInp.addEventListener('change', actualizarColorEnvioRealAdmin);
    setTimeout(actualizarColorEnvioRealAdmin, 0);
  }

  // --- Colores automáticos para fecha_real_entrega_bono respecto a fecha_ideal_maxima_entrega_bono ---
  const realEntregaBonoInp = clone.querySelector('[data-field="fecha_real_entrega_bono"]');
  const idealMaxEntregaBonoInp = clone.querySelector('[data-field="fecha_ideal_maxima_entrega_bono"]');
  function actualizarColorRealEntregaBono() {
    if (!realEntregaBonoInp || !idealMaxEntregaBonoInp) return;
    const fechaReal = realEntregaBonoInp.value;
    const fechaIdealMax = idealMaxEntregaBonoInp.value;
    if (!fechaReal || !fechaIdealMax) {
      realEntregaBonoInp.style.backgroundColor = '';
      return;
    }
    const dReal = new Date(fechaReal);
    const dIdealMax = new Date(fechaIdealMax);
    if (dReal.getTime() < dIdealMax.getTime()) {
      realEntregaBonoInp.style.backgroundColor = '#9b9b9b';
    } else if (dReal.getTime() > dIdealMax.getTime()) {
      realEntregaBonoInp.style.backgroundColor = '#ff4d4d';
    } else {
      realEntregaBonoInp.style.backgroundColor = '';
    }
  }
  if (realEntregaBonoInp && idealMaxEntregaBonoInp) {
    realEntregaBonoInp.addEventListener('change', actualizarColorRealEntregaBono);
    idealMaxEntregaBonoInp.addEventListener('change', actualizarColorRealEntregaBono);
    setTimeout(actualizarColorRealEntregaBono, 0);
  }
}

// Cambia a true si tu endpoint real es plural: /bdproyectos/{id}
const BD_PROYECTO_PLURAL = false; // pon true si tu ruta correcta es /bdproyectos/{id}

// Caches
const cacheReclutamientos = new Map();
const cacheBdProyectos    = new Map();
const cacheParticipantes  = new Map();
const cacheHijos          = new Map(); // hijos (BDHijos)
const cacheProyectos      = new Map(); // proyectos (catálogo principal)
const reclIndex = new Map();

function norm(obj, keys, fallback = "-") {
  if (!obj) return fallback;
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, k) &&
        obj[k] !== undefined && obj[k] !== null && obj[k] !== "") {
      return obj[k];
    }
  }
  return fallback;
}

function escapeHTML(str) {
  return String(str ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;");
}

async function fetchJSON(url, token, label) {
  try {
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (resp.status === 401) {
      sessionStorage.clear();
      window.location.href = "login.html";
      return null;
    }
    if (!resp.ok) {
      console.error(`[${label}] ${resp.status} -> ${await resp.text()}`);
      return null;
    }
    return await resp.json();
  } catch (e) {
    console.error(`[${label}] Network error`, e);
    return null;
  }
}

async function getReclutamientos(idProfesional, token) {
  const key = `prof_${idProfesional}`;
  if (cacheReclutamientos.has(key)) return cacheReclutamientos.get(key);
  const data = await fetchJSON(`${API_BASE}/reclutamientos/profesional/${idProfesional}`, token, "reclutamientos");
  cacheReclutamientos.set(key, Array.isArray(data) ? data : []);
  return cacheReclutamientos.get(key);
}

// Reclutamiento individual (para PUT completo)
async function getReclutamientoById(id, token) {
  // Buscar primero en cacheReclutamientos
  for (const arr of cacheReclutamientos.values()) {
    if (Array.isArray(arr)) {
      const found = arr.find(r => String(r.id) === String(id));
      if (found) return found;
    }
  }
  // Fallback a endpoint directo si existe
  return await fetchJSON(`${API_BASE}/reclutamientos/${id}`, token, `reclutamiento(${id})`);
}

async function getBdProyecto(id, token) {
  if (!id) return null;
  if (cacheBdProyectos.has(id)) return cacheBdProyectos.get(id);
  const path = BD_PROYECTO_PLURAL ? "bdproyectos" : "bdproyecto";
  const data = await fetchJSON(`${API_BASE}/${path}/${id}`, token, `bdproyecto(${id})`);
  if (data) cacheBdProyectos.set(id, data);
  return data;
}

async function getParticipante(id, token) {
  if (!id) return null;
  if (cacheParticipantes.has(id)) return cacheParticipantes.get(id);
  const data = await fetchJSON(`${API_BASE}/participantes/${id}`, token, `participante(${id})`);
  if (data) cacheParticipantes.set(id, data);
  return data;
}

// 4. Hijo por id (ruta: /hijos/{id})
async function getHijo(id, token) {
  if (!id) return null;
  if (cacheHijos.has(id)) return cacheHijos.get(id);
  const data = await fetchJSON(`${API_BASE}/hijos/${id}`, token, `hijo(${id})`);
  if (data) cacheHijos.set(id, data);
  return data;
}

// 5. Proyecto por id (ruta: /proyectos/{id})
async function getProyecto(id, token) {
  if (!id) return null;
  if (cacheProyectos.has(id)) return cacheProyectos.get(id);
  const data = await fetchJSON(`${API_BASE}/proyectos/${id}`, token, `proyecto(${id})`);
  if (data) cacheProyectos.set(id, data);
  return data;
}

// ---------- Mapeos para el modal ----------
const fieldMapping = {
  origen: ["origen_dato"],
  nombre_apellido: ["nombre_participante"],
  // Asegurar que cargue documento del PARTICIPANTE, contemplando variantes comunes
  cedula: ["documento","cedula","cedula_participante","num_documento"],
  nacionalidad: ["nacionalidad"],
  edad: ["edad"],
  direccion: ["direccion"],
  barrio: ["barrio"],
  // Fecha de nacimiento del PARTICIPANTE (no la del bebé)
  // Incluye variantes posibles del backend; evitamos "nacimiento" genérico para no traer la del bebé
  fecha_nacimiento: ["fecha_nacimiento","fechaNacimiento","fecha_nac","f_nacimiento","fnacimiento"],
  nse: ["nse"],
  correo: ["correo_electronico"],
  telefono1: ["telefono_1"],
  telefono2: ["telefono_2"],
  telefono3: ["telefono_3"],
  bebe_nombre: ["nombre_hijo"],
  // quitar 'fecha_nacimiento' para no tomar la del participante como la del bebé
  bebe_nacimiento: ["bebe_nacimiento","fecha_nacimiento_bebe","nacimiento"],
  bebe_edad_meses: ["bebe_edad_meses"], // si viene en días (valor grande) se convierte a meses visualmente
  bebe_edad_primer: ["p4"], // si viene en días (valor grande) se convierte a meses visualmente
  bebe_sexo: ["sexo","sexo_bebe"],
  crema_marca: ["p23"],
  crema_frecuencia: ["p25"],
  otra_crema_si_no: ["p8"],
  otra_crema_marca: ["p9"],
  otra_crema_marca_referencia: ["p10"],
  otra_crema_razones: ["p11"],
  // profesional eliminado del formulario
  otra_crema_frecuencia: ["p12"],
  // cambios_panal_dia eliminado del formulario
  fecha_asignacion_gestora: ["fecha_asignacion_gestora","fecha_asignacion_g"],
  fecha_asignacion_supervisora: ["fecha_asignacion_supervisora","fecha_asignacion_s"],
  fecha_realizacion_profesional: ["fecha_realizacion_profesional","fecha_realizacion_p"],
  estado_encuadre: ["estado_encuadre","estado"],
  tiempo_estatus_encuadre: ["tiempo_estatus_encuadre","tiempo_encuadre"],
  // permitir que si el input usa 'tiempo_encuadre' directamente también funcione
  tiempo_encuadre: ["tiempo_encuadre","tiempo_estatus_encuadre"],
  fecha_ideal_min: ["fecha_ideal_min"],
  fecha_ideal_max: ["fecha_ideal_max"],
  fecha_real: ["fecha_real","fecha_e_inicial"],
  hora: ["hora"],
  link_entrevista: ["link_entrevista","link"],
  efectividad: ["efectividad"],
  tiempo_entrevista_inicial: ["tiempo_entrevista_inicial","tiempo_e_inicial"],
  calificacion_tiro_blanco: ["calificacion_tiro_blanco"],
  fecha_entrega_producto: ["fecha_entrega_producto","fecha_despacho","fecha_despacho_0"],
  fecha_recibo: ["fecha_recibo"],
  tiempo_estatus_recibo: ["tiempo_estatus_recibo","tiempo_recibo"],
  // confirmacion_verbal se mapea a consentimiento (bool en backend)
  confirmacion_verbal: ["confirmacion_verbal","consentimiento"],
  fecha_ideal_inicio_muestra: ["fecha_ideal_inicio_muestra"],
  fecha_inicio_muestra: ["fecha_inicio_muestras","fecha_inicio_muestra_0"],
  fecha_ideal_seguimiento_uso: ["fecha_ideal_seguimiento_uso"],
  fecha_seguimiento_real_uso: ["fecha_seguimiento_real_uso","fecha_seg_muestras","fecha_seg_muestras_0"],
  fecha_ideal_evaluacion_monadica: ["fecha_ideal_evaluacion_monadica"],
  fecha_real_evaluacion_monadica: ["fecha_monadica","fecha_real_evaluacion_monadica"],
  tiempo_evaluacion_monadica: ["tiempo_monadica_muestras","tiempo_monadica_muestras_0"],
  irritacion_bebe_primer_producto: ["irritacion_bebe_primer_producto","irritaciones","irritaciones_0"],
  fecha_ideal_min_final: ["fecha_ideal_min_final"],
  fecha_ideal_max_final: ["fecha_ideal_max_final"],
  fecha_entrevista_final: ["fecha_entrevista_final","fecha_final"],
  hora_final: ["hora_final"],
  status_efectividad_final: ["efectividad_final"],
  modalidad_entrevista_final: ["modalidad_entrevista_final","modalidad_entrevista"],
  tiempo_entrevista_final: ["tiempo_entrevista_final","tiempo_final"],
  calificacion_tiro_blanco_final: ["calificacion_tiro_blanco_final"],
  fecha_ideal_maxima_restitucion: ["fecha_ideal_maxima_restitucion"],
  restitucion_entregables: ["restitucion_entregables","entregables"],
  fecha_real_restitucion: ["fecha_real_restitucion","fecha_restitucion"],
  fecha_ideal_envio_admin: ["fecha_ideal_envio_admin"],
  fecha_envio_real_admin: ["fecha_envio_real_admin","fecha_envio_admin"],
  fecha_ideal_maxima_entrega_bono: ["fecha_ideal_maxima_entrega_bono"],
  fecha_real_entrega_bono: ["fecha_real_entrega_bono","fechas_bono","fechas_bono_0"],
  observaciones_bono: ["observaciones"]
};

// Override de nombres al guardar
const saveNameOverride = {
  nombre_apellido: "nombre_participante",
  fecha_nacimiento: "fecha_nacimiento",
  cedula: "documento",
  nacionalidad: "nacionalidad",
  direccion: "direccion",
  barrio: "barrio",
  nse: "nse",
  correo: "correo_electronico",
  telefono1: "telefono_1",
  telefono2: "telefono_2",
  telefono3: "telefono_3",
  origen: "origen_dato",
  // BDHijos
  bebe_nombre: "nombre_hijo",
  bebe_nacimiento: "fecha_nacimiento",
  bebe_sexo: "sexo",
  bebe_edad_primer: "p4",
  crema_marca: "p23",
  crema_frecuencia: "p25",
  otra_crema_si_no: "p8",
  otra_crema_marca: "p9",
  otra_crema_marca_referencia: "p10",
  otra_crema_razones: "p11",
  otra_crema_frecuencia: "p12",
  // FIX: enviar observaciones_bono como 'observaciones' (reclutamiento)
  observaciones_bono: "observaciones",
  // FIX: typo común en el UI
  estado_esncudre: "estado"
};

function resolveValue(key, combined) {
  const list = fieldMapping[key] || [key];
  for (const candidate of list) {
    if (candidate in combined && combined[candidate] !== null && combined[candidate] !== "") {
      return Array.isArray(combined[candidate]) ? combined[candidate][0] : combined[candidate];
    }
  }
  return "";
}

async function cargarReclutamientos() {
  const token = sessionStorage.getItem("token");
  const idProfesional = sessionStorage.getItem("id_usuario");
  const tbody = document.getElementById("users-body");
  if (!token || !idProfesional || !tbody) return;

  tbody.innerHTML = `<tr><td colspan="8">Cargando...</td></tr>`;

  // Limpiar caches para evitar datos cruzados/obsoletos
  cacheReclutamientos.clear();
  cacheBdProyectos.clear();
  cacheParticipantes.clear();
  cacheHijos.clear();
  cacheProyectos.clear();

  const reclutamientos = await getReclutamientos(idProfesional, token);
  if (!Array.isArray(reclutamientos) || reclutamientos.length === 0) {
  tbody.innerHTML = `<tr><td colspan="8">Sin registros</td></tr>`;
    return;
  }

  const bdIds = [...new Set(reclutamientos.map(r => r.id_bdproyecto).filter(Boolean))];
  await Promise.all(bdIds.map(id => getBdProyecto(id, token)));

  const participanteIds = new Set();
  const hijoIds = new Set();
  const proyectoIds = new Set();
  for (const id of bdIds) {
    const bd = cacheBdProyectos.get(id);
    if (!bd) continue;
    const pid = bd.id_participante || bd.idParticipante || bd.participante_id || bd.id_participante_fk || bd.id_part;
    if (pid) participanteIds.add(pid);
    const hid = bd.id_hijo || bd.idHijo || bd.id_hijo_fk || bd.id_bdhijo;
    if (hid) hijoIds.add(hid);
    // Detectar id de proyecto: priorizar id_proyecto; si 'proyecto' es numérico, usarlo
    let projId = bd.id_proyecto || bd.idProyecto;
    if (!projId && bd.proyecto && /^\d+$/.test(String(bd.proyecto))) {
      projId = Number(bd.proyecto);
    }
    if (projId) proyectoIds.add(Number(projId));
  }
  await Promise.all([...participanteIds].map(pid => getParticipante(pid, token)));
  await Promise.all([...hijoIds].map(hid => getHijo(hid, token)));
  await Promise.all([...proyectoIds].map(pid => getProyecto(pid, token)));

  reclIndex.clear();

  const rowsHTML = reclutamientos.map((r, idx) => {
    const bd = cacheBdProyectos.get(r.id_bdproyecto);
    const pid = bd && (bd.id_participante || bd.idParticipante || bd.participante_id || bd.id_participante_fk || bd.id_part);
    const part = pid ? cacheParticipantes.get(pid) : null;

    // Buscar hijo asociado al bd
    let hijo = null;
    let proyectoObj = null;
    if (bd) {
      const hid = bd.id_hijo || bd.idHijo || bd.id_hijo_fk || bd.id_bdhijo;
      if (hid) hijo = cacheHijos.get(hid);
      let projId = bd.id_proyecto || bd.idProyecto;
      if (!projId && bd.proyecto && /^\d+$/.test(String(bd.proyecto))) projId = Number(bd.proyecto);
      if (projId) proyectoObj = cacheProyectos.get(Number(projId));
    }

  const rowKey = `${String(r.id)}|${String(r.id_bdproyecto ?? '')}|${String(pid ?? '')}|${idx}`;
  reclIndex.set(rowKey, { reclutamiento: r, bdProyecto: bd, participante: part, hijo, proyecto: proyectoObj });

    const nombre = norm(part, ["nombre_participante","nombre","nombre_completo","nombre_apellido","participante"]);
    const telefono = norm(part, ["telefono","telefono1","telefono_1","celular","contacto"]);
    // Nombre del proyecto: usar objeto proyecto si existe
    let proyectoNombre = "-";
    if (cacheProyectos.size && bd) {
      let projId = bd.id_proyecto || bd.idProyecto;
      if (!projId && bd.proyecto && /^\d+$/.test(String(bd.proyecto))) projId = Number(bd.proyecto);
      if (projId) {
        const proj = cacheProyectos.get(Number(projId));
        if (proj) {
          proyectoNombre = norm(proj, ["nombre_proyecto","nombre","nombreProyecto"], projId);
        }
      }
    }
    if (proyectoNombre === "-") {
      // fallback texto en bd si no era numérico y parece ya un nombre
      if (bd && bd.proyecto && !/^\d+$/.test(String(bd.proyecto))) proyectoNombre = bd.proyecto;
      else proyectoNombre = norm(bd, ["proyecto","id_bdproyecto","id"], r.id_bdproyecto);
    }
    const ciudad = norm(part, ["ciudad","municipio","localidad"]);
    function okBool(val){ return val === true || val === 'true' || val === 'OK'; }
    const encuadre = okBool(r.estado) ? 'OK' : '-';
    const inicial = okBool(r.efectividad) ? 'OK' : '-';
    // antes: cálculo de `monadica` basado en tiempo/Duration (provoca OK cuando tiempo = 00:00:00)
    // ahora: marcar OK solo si hay fecha real de evaluación monádica válida
    let monadica = "-";
    // posible origen de la fecha monádica: campo array `fecha_monadica` o campo simple `fecha_real_evaluacion_monadica`
    const fechaMonadicaRaw = Array.isArray(r.fecha_monadica) ? r.fecha_monadica[0] : (r.fecha_real_evaluacion_monadica || r.fecha_monadica);
    if (fechaMonadicaRaw) {
      const s = String(fechaMonadicaRaw).trim();
      // excluir fechas inválidas/placeholder comunes: vacío, "0001-01-01", "1970-01-01" o valores no útiles
      if (s && !s.startsWith("0001") && !s.startsWith("1970") && s !== "0000-00-00") {
        monadica = "OK";
      }
    }
  const finalE = okBool(r.efectividad_final != null ? r.efectividad_final : r.status_efectividad_final) ? 'OK' : '-';

  return `<tr class="recl-row" data-recl-key="${escapeHTML(rowKey)}">
      <td>${escapeHTML(nombre)}</td>
      <td>${escapeHTML(telefono)}</td>
  <td>${escapeHTML(proyectoNombre)}</td>
      <td>${escapeHTML(ciudad)}</td>
  <td>${escapeHTML(encuadre)}</td>
  <td>${escapeHTML(inicial)}</td>
  <td>${escapeHTML(monadica)}</td>
  <td>${escapeHTML(finalE)}</td>
    </tr>`;
  }).join("");

  tbody.innerHTML = rowsHTML;

  tbody.querySelectorAll(".recl-row").forEach(tr => {
    tr.addEventListener("click", () => {
      const key = tr.getAttribute("data-recl-key");
      openReclutamientoModal(key);
    });
  });

  const filtro = document.getElementById("filter-nombre");
  if (filtro && !filtro.dataset.bound) {
    filtro.dataset.bound = "1";
    filtro.addEventListener("input", () => {
      const val = filtro.value.toLowerCase();
      tbody.querySelectorAll("tr").forEach(tr => {
        tr.style.display = tr.textContent.toLowerCase().includes(val) ? "" : "none";
      });
    });
  }
}

let modalInstance = null;
let modalState = {
  reclutamientoId: null,
  bdProyectoId: null,
  participanteId: null,
  originalValues: {}
};

// Offset horario (en horas) para ajustar times que vienen en GMT-5 y se muestran 5h antes
// Si ves que ahora se suman horas incorrectas ajusta este valor.
const TIME_OFFSET_HOURS = 5; // añade 5 horas al mostrar
const INTERVAL_REGEX = /^\d{1,3}:\d{2}(:\d{2})?$/; // permite horas > 23 si es necesario
const DEBUG_UI = false; // activar panel debug en modal

function applyTimeOffset(dateStr){
  if(!dateStr) return null;
  const d = new Date(dateStr);
  if(isNaN(d.getTime())) return null;
  const shifted = new Date(d.getTime() + TIME_OFFSET_HOURS * 3600000);
  const hh = String(shifted.getHours()).padStart(2,'0');
  const mm = String(shifted.getMinutes()).padStart(2,'0');
  return `${hh}:${mm}`;
}

function normalizeInterval(val){
  if(val == null) return "";
  // Si viene como objeto {Duration, Valid}
  if (typeof val === 'object' && val !== null && 'Duration' in val) {
    const ns = Number(val.Duration);
    if(!isNaN(ns) && ns > 0) {
      const totalSeconds = Math.floor(ns / 1e9);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600)/60);
      const seconds = totalSeconds % 60;
  // Siempre devolver con segundos para consistencia: HH:MM:SS
  return `${String(hours)}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
    }
    return "";
  }
  let s = String(val).trim();
  if(s === "") return "";
  // Si viene como 'HH:MM:SS.sss' cortar
  const frac = s.indexOf('.')>0 ? s.split('.')[0] : s;
  // Si viene como solo números (ej 1305) interpretarlo como 13:05
  if(/^[0-9]{3,4}$/.test(frac)) {
    const raw = frac.padStart(4,'0');
    s = raw.slice(0,raw.length-2)+":"+raw.slice(-2);
  } else {
    s = frac;
  }
  // Asegurar formato HH:MM o HH:MM:SS
  const parts = s.split(':');
  if(parts.length === 2){
    const [h,m] = parts;
    // devolver con segundos 00
    return `${String(Number(h))}:${m.padStart(2,'0')}:00`;
  } else if(parts.length === 3){
    const [h,m,sec] = parts;
    return `${String(Number(h))}:${m.padStart(2,'0')}:${sec.padStart(2,'0')}`;
  }
  return s; // fallback
}

async function openReclutamientoModal(reclKey) {
  let triple = reclIndex.get(reclKey);
  if (!triple) {
    // Fallback: reconstruir usando IDs del key
    try {
      const [ridStr, bdidStr, pidStr] = String(reclKey).split('|');
      const token = sessionStorage.getItem('token');
      const rid = ridStr ? Number(ridStr) : null;
      const bdid = bdidStr ? Number(bdidStr) : null;
      const pid = pidStr ? Number(pidStr) : null;
      const reclutamiento = rid ? (await getReclutamientoById(rid, token)) : null;
      const bdProyecto = bdid ? (await getBdProyecto(bdid, token)) : null;
      const participante = pid ? (await getParticipante(pid, token)) : null;
      let hijo = null;
      if (bdProyecto) {
        const hid = bdProyecto.id_hijo || bdProyecto.idHijo || bdProyecto.id_hijo_fk || bdProyecto.id_bdhijo;
        hijo = hid ? (await getHijo(hid, token)) : null;
      }
      triple = { reclutamiento, bdProyecto, participante, hijo, proyecto: null };
    } catch (err) {
      console.warn('No data para reclutamiento (fallback)', reclKey, err);
      return;
    }
  }
  const { reclutamiento, bdProyecto, participante, hijo } = triple;
  modalState.reclutamientoId = reclutamiento.id;
  modalState.bdProyectoId = bdProyecto ? (bdProyecto.id_bdproyecto || bdProyecto.id) : null;
  modalState.participanteId = participante ? (participante.id || participante.id_participante || participante.idParticipante) : null;
  // Guardar hijoId para PUT de BDHijos
  modalState.hijoId = null;
  if (bdProyecto) {
    const hid = bdProyecto.id_hijo || bdProyecto.idHijo || bdProyecto.id_hijo_fk || bdProyecto.id_bdhijo;
    if (hid) modalState.hijoId = hid;
  }

  const template = document.getElementById("popupFormTemplate");
  if (!template) return;

  const clone = template.cloneNode(true);
  clone.id = "popupDynamicForm";
  clone.style.display = "";

  const modalBody = document.getElementById("modalBodyContent");
  modalBody.innerHTML = "";
  modalBody.appendChild(clone);
  // Aplica la lógica de colores para los campos de fechas
  aplicarLogicaColoresFechas(clone);

  const combined = {};
  // Merge bdProyecto primero para que reclutamiento tenga prioridad en campos duplicados (ej. observaciones)
  if (bdProyecto) Object.assign(combined, bdProyecto);
  Object.assign(combined, reclutamiento);
  if (participante) Object.assign(combined, participante); // prioridad a datos del participante
  if (hijo) {
    const hijoCopy = { ...hijo };
    // Claves posibles del PARTICIPANTE en el objeto combinado
    const participantBirthKeys = ["fecha_nacimiento","fechaNacimiento","fecha_nac","f_nacimiento","fnacimiento"];
    const participantDocKeys   = ["documento","cedula","cedula_participante","num_documento"];

    // Fecha de nacimiento: si el hijo la trae y el combinado ya tiene alguna del PARTICIPANTE, renombrar a *_bebe
    if (hijoCopy.fecha_nacimiento) {
      const participantBirthKey = participantBirthKeys.find(k => combined[k] != null && combined[k] !== "");
      if (participantBirthKey) {
        const participantBirthVal = combined[participantBirthKey];
        if (participantBirthVal !== hijoCopy.fecha_nacimiento) {
          hijoCopy.fecha_nacimiento_bebe = hijoCopy.fecha_nacimiento;
          delete hijoCopy.fecha_nacimiento;
        }
      }
    }

    // Documento: si el hijo lo trae y el combinado ya tiene alguno del PARTICIPANTE, renombrar a *_bebe
    if (hijoCopy.documento) {
      const participantDocKey = participantDocKeys.find(k => combined[k] != null && combined[k] !== "");
      if (participantDocKey) {
        const participantDocVal = combined[participantDocKey];
        if (participantDocVal !== hijoCopy.documento) {
          hijoCopy.documento_bebe = hijoCopy.documento;
          delete hijoCopy.documento;
        }
      }
    }
    if (hijoCopy.cedula) {
      const participantDocKey = participantDocKeys.find(k => combined[k] != null && combined[k] !== "");
      if (participantDocKey) {
        const participantDocVal = combined[participantDocKey];
        if (participantDocVal !== hijoCopy.cedula) {
          hijoCopy.cedula_bebe = hijoCopy.cedula;
          delete hijoCopy.cedula;
        }
      }
    }

    Object.assign(combined, hijoCopy); // ahora no sobreescribe la info del participante
  }

  // Derivar calificaciones desde arreglo tiro_blanco (si backend solo retorna lista)
  if (Array.isArray(combined.tiro_blanco)) {
    if (combined.tiro_blanco[0] != null && combined.calificacion_tiro_blanco == null) {
      combined.calificacion_tiro_blanco = combined.tiro_blanco[0];
    }
    if (combined.tiro_blanco[1] != null && combined.calificacion_tiro_blanco_final == null) {
      combined.calificacion_tiro_blanco_final = combined.tiro_blanco[1];
    }
  }

  console.log("[COMBINED]", combined);

  // DEBUG panel con IDs y URLs de la API
  if (DEBUG_UI) {
    const modalBody = document.getElementById("modalBodyContent");
    const pathBD = BD_PROYECTO_PLURAL ? "bdproyectos" : "bdproyecto";
    const rid = reclutamiento?.id ?? '';
    const bdid = (bdProyecto && (bdProyecto.id_bdproyecto || bdProyecto.id)) || '';
    const pid = (participante && (participante.id || participante.id_participante || participante.idParticipante)) || '';
    const hid = (bdProyecto && (bdProyecto.id_hijo || bdProyecto.idHijo || bdProyecto.id_hijo_fk || bdProyecto.id_bdhijo)) || '';
    let projId = bdProyecto ? (bdProyecto.id_proyecto || bdProyecto.idProyecto) : '';
    if (!projId && bdProyecto && bdProyecto.proyecto && /^\d+$/.test(String(bdProyecto.proyecto))) projId = Number(bdProyecto.proyecto);
    const debugBox = document.createElement('div');
    debugBox.className = 'alert alert-secondary py-2 px-3 mb-2';
    debugBox.style.fontSize = '12px';
    debugBox.innerHTML = `
      <div><strong>DEBUG</strong></div>
      <div>reclutamientoId: ${escapeHTML(rid)}</div>
      <div>bdProyectoId: ${escapeHTML(bdid)}</div>
      <div>participanteId: ${escapeHTML(pid)}</div>
      <div>hijoId: ${escapeHTML(hid)}</div>
      <div>proyectoId: ${escapeHTML(projId ?? '')}</div>
      <hr class="my-1" />
      <div>GET URLs:</div>
      <div>${escapeHTML(`${API_BASE}/reclutamientos/${rid}`)}</div>
      <div>${escapeHTML(`${API_BASE}/${pathBD}/${bdid}`)}</div>
      <div>${escapeHTML(`${API_BASE}/participantes/${pid}`)}</div>
      <div>${escapeHTML(`${API_BASE}/hijos/${hid}`)}</div>
      <div>${escapeHTML(`${API_BASE}/proyectos/${projId ?? ''}`)}</div>
      <hr class="my-1" />
  <div>PUT URLs:</div>
      <div>${escapeHTML(`${API_BASE}/reclutamientos/${rid}`)}</div>
      <div>${escapeHTML(`${API_BASE}/participantes/${pid}`)}</div>
      <div>${escapeHTML(`${API_BASE}/${pathBD}/${bdid}`)}</div>
  <div>${escapeHTML(`${API_BASE}/hijos/${hid}`)}</div>
    `;
    // Insertar arriba del formulario
    const formNode = document.getElementById('popupDynamicForm');
    if (formNode && formNode.parentNode === modalBody) {
      modalBody.insertBefore(debugBox, formNode);
    } else {
      modalBody.prepend(debugBox);
    }
  }

  // Calcular edad solo del PARTICIPANTE
  // Buscar fecha de nacimiento en varias variantes y con fallback al objeto participante
  (function computeEdadParticipante(){
    const birthKeys = ["fecha_nacimiento","fechaNacimiento","fecha_nac","f_nacimiento","fnacimiento"]; // no incluir la del bebé
    let birthDateStr = null;
    for (const k of birthKeys) {
      if (combined[k]) { birthDateStr = combined[k]; break; }
    }
    if (!birthDateStr && participante) {
      // fallback directo al objeto participante si por alguna razón no quedó en combined
      birthDateStr = participante.fecha_nacimiento || participante.fechaNacimiento || participante.fecha_nac || participante.f_nacimiento || participante.fnacimiento || null;
    }

    // Solo computar si no hay una edad válida ya presente
    const existingAgeNum = Number(combined.edad);
    const hasValidAge = Number.isFinite(existingAgeNum) && existingAgeNum > 0 && existingAgeNum < 130;
    if (birthDateStr && !hasValidAge) {
      const d = new Date(birthDateStr);
      if (!isNaN(d.getTime())) {
        const today = new Date();
        let age = today.getFullYear() - d.getFullYear();
        const m = today.getMonth() - d.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
        if (age >= 0 && age < 130) combined.edad = String(age);
      }
    }
  })();

  // Calcular meses del BEBÉ a partir de bebe_nacimiento/fecha_nacimiento_bebe/nacimiento
  (function computeBebeMeses(){
    const bebeDob = combined.bebe_nacimiento || combined.fecha_nacimiento_bebe || combined.nacimiento;
    if (!bebeDob) return;
    const d = new Date(bebeDob);
    if (isNaN(d.getTime())) return;
    const today = new Date();
    let months = (today.getFullYear() - d.getFullYear()) * 12 + (today.getMonth() - d.getMonth());
    if (today.getDate() < d.getDate()) months -= 1;
    if (months < 0) months = 0;
    // Solo establecer si no viene ya uno válido
    if (!combined.bebe_edad_meses || combined.bebe_edad_meses === '' || Number.isNaN(Number(combined.bebe_edad_meses))) {
      combined.bebe_edad_meses = String(months);
    }
  })();

  // Derivar hora y hora_final desde fechas si faltan
  function extractTime(str){
    if(!str) return null;
    // Intentar parse ISO y aplicar offset
    const d = new Date(str);
    if(!isNaN(d.getTime())) {
      const shifted = new Date(d.getTime() + TIME_OFFSET_HOURS * 3600000);
      const hh = String(shifted.getHours()).padStart(2,'0');
      const mm = String(shifted.getMinutes()).padStart(2,'0');
      return `${hh}:${mm}`;
    }
    // Fallback simple buscar HH:MM
    const m = str.match(/(\d{2}:\d{2})/);
    return m ? m[1] : null;
  }
  if(!combined.hora && combined.fecha_e_inicial){
    const t = extractTime(combined.fecha_e_inicial);
    if(t) combined.hora = t;
  }
  if(!combined.hora_final && combined.fecha_final){
    const t2 = extractTime(combined.fecha_final);
    if(t2) combined.hora_final = t2;
  }

  // Derivar fechas de entrega y recibo desde fecha_despacho[0] y [1]
  if (Array.isArray(combined.fecha_despacho)) {
    if (!combined.fecha_entrega_producto && combined.fecha_despacho[0]) {
      combined.fecha_entrega_producto = combined.fecha_despacho[0];
    }
    if (!combined.fecha_recibo && combined.fecha_despacho[1]) {
      combined.fecha_recibo = combined.fecha_despacho[1];
    }
  }

  // ---------------- Cálculo automático de fechas ideales ----------------
  // Regla solicitada:
  // fecha_ideal_min = fecha_realizacion_profesional + 1 día
  // fecha_ideal_max = fecha_realizacion_profesional + 3 días
  function addDays(dateStr, days){
    if(!dateStr) return null;
    const d = new Date(dateStr);
    if(isNaN(d.getTime())) return null;
    d.setDate(d.getDate() + days);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${yyyy}-${mm}-${dd}`;
  }
  const baseRealizacion = combined.fecha_realizacion_profesional || combined.fecha_realizacion_p;
  if (baseRealizacion) {
    if(!combined.fecha_ideal_min || combined.fecha_ideal_min === '') {
      const calcMin = addDays(baseRealizacion, 2);
      if(calcMin) combined.fecha_ideal_min = calcMin;
    }
    if(!combined.fecha_ideal_max || combined.fecha_ideal_max === '') {
      const calcMax = addDays(baseRealizacion, 4);
      if(calcMax) combined.fecha_ideal_max = calcMax;
    }
  }

  const baseRealizacion2 = Array.isArray(combined.fecha_despacho) ? combined.fecha_despacho[1] : null;
  if (baseRealizacion2) {
    if(!combined.fecha_ideal_inicio_muestra || combined.fecha_ideal_inicio_muestra === '') {
      const calcMin = addDays(baseRealizacion2, 2);
      if(calcMin) combined.fecha_ideal_inicio_muestra = calcMin;
    }
    if(!combined.fecha_ideal_seguimiento_uso || combined.fecha_ideal_seguimiento_uso === '') {
      const calcMin = addDays(baseRealizacion2, 5);
      if(calcMin) combined.fecha_ideal_seguimiento_uso = calcMin;
    }
  }

  const baseRealizacion3 = Array.isArray(combined.fecha_inicio_muestras) ? combined.fecha_inicio_muestras[0] : null;
  if (baseRealizacion3) {
    if(!combined.fecha_ideal_evaluacion_monadica || combined.fecha_ideal_evaluacion_monadica === '') {
      const calcMin = addDays(baseRealizacion3, 8);
      if(calcMin) combined.fecha_ideal_evaluacion_monadica = calcMin;
    }
  }

  const baseRealizacion4 = combined.fecha_monadica;
  if (baseRealizacion4) {
    if(!combined.fecha_ideal_min_final || combined.fecha_ideal_min_final === '') {
      const calcMin = addDays(baseRealizacion4, 2);
      if(calcMin) combined.fecha_ideal_min_final = calcMin;
    }
    if(!combined.fecha_ideal_max_final || combined.fecha_ideal_max_final === '') {
      const calcMax = addDays(baseRealizacion4, 4);
      if(calcMax) combined.fecha_ideal_max_final = calcMax;
    }
  }

  const baseRealizacion5 = combined.fecha_final;
  if (baseRealizacion5) {
    if(!combined.fecha_ideal_maxima_restitucion || combined.fecha_ideal_maxima_restitucion === '') {
      const calcMin = addDays(baseRealizacion5, 4);
      if(calcMin) combined.fecha_ideal_maxima_restitucion = calcMin;
    }
    if(!combined.fecha_ideal_envio_admin || combined.fecha_ideal_envio_admin === '') {
      const calcMin = addDays(baseRealizacion5, 3);
      if(calcMin) combined.fecha_ideal_envio_admin = calcMin;
    }
  }

  const baseRealizacion6 = combined.fecha_envio_admin;
  if (baseRealizacion6) {
    if(!combined.fecha_ideal_maxima_entrega_bono || combined.fecha_ideal_maxima_entrega_bono === '') {
      const calcMin = addDays(baseRealizacion6, 4);
      if(calcMin) combined.fecha_ideal_maxima_entrega_bono = calcMin;
    }
  }
  // ----------------------------------------------------------------------

  modalState.originalValues = {};
  clone.querySelectorAll("[data-field]").forEach(input => {
    const key = input.getAttribute("data-field");
    let val = resolveValue(key, combined);
    // Fallback explícito para cedula y fecha_nacimiento desde el PARTICIPANTE
    if ((key === 'cedula' || key === 'fecha_nacimiento') && (!val || val === '')) {
      if (key === 'cedula' && participante) {
        val = participante.documento || participante.cedula || participante.cedula_participante || participante.num_documento || '';
      } else if (key === 'fecha_nacimiento' && participante) {
        val = participante.fecha_nacimiento || participante.fechaNacimiento || participante.fecha_nac || participante.f_nacimiento || participante.fnacimiento || '';
      }
    }
    // Conversión específica para bebe_edad_meses: si es número grande (días) -> meses
    if (key === 'bebe_edad_meses') {
      const num = Number(val);
      if (!isNaN(num) && num > 24) { // umbral: >24 días probablemente no son meses todavía
        const months = Math.floor(num / 30); // aproximación
        val = String(months);
      }
    }
    // Normalizar intervalos para campos tiempo_*
    if (key.startsWith('tiempo_')) {
      val = normalizeInterval(val);
    }
    // Ajustes de tipo date/time (si backend devuelve '2025-09-05T00:00:00Z')
    // Selects booleanos
    if (['estado_encuadre','efectividad','status_efectividad_final','confirmacion_verbal'].includes(key)) {
      if (key === 'estado_encuadre') {
        if (val === 'OK' || val === true || val === 'true') input.value = 'true';
        else if (val === '' || val == null) input.value = '';
        else input.value = 'false';
      } else if (key === 'confirmacion_verbal') {
        // consentimiento boolean backend -> mostrar como 'true'/'false'
        if (val === true || val === 'true') input.value = 'true';
        else if (val === false || val === 'false') input.value = 'false';
        else input.value = '';
      } else {
        if (val === true || val === 'true') input.value = 'true';
        else if (val === false || val === 'false') input.value = 'false';
        else input.value = '';
      }
      modalState.originalValues[key] = input.value;
      return;
    }
    if (input.type === "date" && val && val.length >= 10) {
      input.value = val.substring(0,10);
    } else if (input.type === "time" && val) {
      input.value = val.substring(0,5);
    } else {
      input.value = val;
    }
    modalState.originalValues[key] = input.value;
  });

  // Guardar como valores originales los autocalculados para que no se marquen como cambios inmediatamente
  ["fecha_ideal_min","fecha_ideal_max"].forEach(k => {
    const inp = clone.querySelector(`[data-field="${k}"]`);
    if (inp && modalState.originalValues[k] === undefined) {
      modalState.originalValues[k] = inp.value;
    }
  });

  // Listener: si cambia la fecha_realizacion_profesional recalcular ideales (solo si usuario no los modificó luego)
  const realizInp = clone.querySelector('[data-field="fecha_realizacion_profesional"]');
  if (realizInp) {
    realizInp.addEventListener('change', () => {
      const base = realizInp.value;
      if(!base) return;
      const minInp = clone.querySelector('[data-field="fecha_ideal_min"]');
      const maxInp = clone.querySelector('[data-field="fecha_ideal_max"]');
      if(minInp) {
        const oldAuto = modalState.originalValues['fecha_ideal_min'];
        if(minInp.value === oldAuto || !minInp.value) {
          const newMin = addDays(base,2);
          if(newMin) minInp.value = newMin;
        }
      }
      if(maxInp) {
        const oldAuto = modalState.originalValues['fecha_ideal_max'];
        if(maxInp.value === oldAuto || !maxInp.value) {
          const newMax = addDays(base,4);
          if(newMax) maxInp.value = newMax;
        }
      }
    });
  }

  // Validación en vivo de intervalos
  clone.querySelectorAll('[data-field^="tiempo_"]').forEach(inp => {
    inp.addEventListener('blur', () => {
      const v = inp.value.trim();
      if(v && !INTERVAL_REGEX.test(v)) {
        inp.classList.add('is-invalid');
      } else {
        inp.classList.remove('is-invalid');
      }
    });
  });

  clone.addEventListener("submit", handleModalSave);

  const modalEl = document.getElementById("infoModal");
  if (!modalInstance) {
    modalInstance = new bootstrap.Modal(modalEl, { backdrop: 'static' });
  }
  modalInstance.show();
}

async function handleModalSave(e) {
  e.preventDefault();
  const form = e.target;
  const token = sessionStorage.getItem("token");
  if (!token) return;

  const changed = {};
  form.querySelectorAll("[data-field]").forEach(inp => {
    const key = inp.getAttribute("data-field");
  // Saltar campos derivados que no deben guardarse directamente
  if (key === 'bebe_edad_meses') return;
  if (modalState.originalValues[key] !== inp.value) {
      const backendKey = saveNameOverride[key] || key;
      changed[backendKey] = inp.value;
    }
  });

  if (Object.keys(changed).length === 0) {
    console.log("Sin cambios");
    modalInstance.hide();
    return;
  }

  const participanteKeys = new Set([
    "nombre_participante","telefono_1","telefono_2","telefono_3","correo_electronico","barrio","direccion",
    "ciudad","nacionalidad","edad","documento", "sexo", "ciudad", "nse", "tipo_vivienda", "origen_dato",
    "fecha_registro", "fecha_nacimiento"
  ]);
  const hijoKeys = new Set([
    // Campos de BDHijos según API
    "nombre_hijo","nombre","sexo","tipo_documento","fecha_nacimiento","documento","id_participante"
  ]);
  const bdProyectoKeys = new Set([
    "id_hijo", "id_bdproyecto", "id_participante", "id_proyecto", "estado_participante",
    "p1","p2","p3","p4","p5","p6","p7","p8","p9","p10","p11","p12","p13","p14",
    "p15","p16","p17","p18","p19","p20","p21","p22","p23","p24","p25","p26","p27",
    "p28","p29","p30","p31","p32","p33","p34","p35","p36","p37","p38","p39","p40",
    "p41","p42","p43","p44","p45","p46","p47","p48","p49","p50","p51","p52","p53",
  "p54","p55","p56","p57","p58","p59","p60","p61", "documentos", "observaciones", 
    "observaciones_supervisora", "observaciones_docu", "contacto", "conclusion_1",
    "conclusion_2", "conclusion_3"
  ]);
  const reclutamientoKeys = new Set([
    "fecha_asignacion_gestora","fecha_asignacion_supervisora","fecha_realizacion_profesional",
    "estado_encuadre","tiempo_estatus_encuadre","fecha_ideal_min","fecha_ideal_max",
    "fecha_real","hora","efectividad","tiempo_entrevista_inicial",
    "calificacion_tiro_blanco","fecha_entrega_producto","fecha_recibo",
    "tiempo_estatus_recibo","confirmacion_verbal","fecha_ideal_inicio_muestra",
  "fecha_inicio_muestra","fecha_inicio_muestras","fecha_ideal_seguimiento_uso","fecha_seguimiento_real_uso","fecha_seg_muestras",
    "fecha_ideal_evaluacion_monadica","fecha_real_evaluacion_monadica",
  "tiempo_evaluacion_monadica","tiempo_monadica_muestras","irritacion_bebe_primer_producto",
    "fecha_ideal_min_final","fecha_ideal_max_final","fecha_entrevista_final",
  "hora_final","status_efectividad_final","modalidad_entrevista_final","modalidad_entrevista",
  "tiempo_entrevista_final","tiempo_final","calificacion_tiro_blanco_final",
    "fecha_ideal_maxima_restitucion","restitucion_entregables","fecha_real_restitucion",
    "fecha_ideal_envio_admin","fecha_envio_real_admin",
  "fecha_ideal_maxima_entrega_bono","fecha_real_entrega_bono",
  // aquí guardamos el texto
  "observaciones",
  // Añadidos backend para evitar warnings tras alias
  "fecha_e_inicial","fecha_realizacion_p","fecha_monadica","tiempo_e_inicial","tiempo_final",
  // FIX: aceptar 'estado' directamente
  "estado"
]);

  const payloadParticipante = {};
  const payloadBdHijo = {};
  const payloadBdProyecto = {};
  const payloadReclutamientoPartial = {};

  Object.entries(changed).forEach(([origKey, val]) => {
    let k = origKey;
  // No normalizar 'estado_encuadre' a boolean: se enviará como string en el PUT
  if (['efectividad','status_efectividad_final','confirmacion_verbal'].includes(k)) {
      if (val === 'true') val = true; else if (val === 'false') val = false; else val = null;
    }

    // Alias UI -> backend
  if (k === 'link_entrevista') k = 'link';
  if (k === 'estado_esncudre') k = 'estado'; // corregir typo del UI
  if (k === 'estado_encuadre') k = 'estado';
    // NUEVOS ALIAS para que las fechas se guarden correctamente
  if (k === 'fecha_real') k = 'fecha_e_inicial';
    if (k === 'fecha_realizacion_profesional') k = 'fecha_realizacion_p';
    if (k === 'fecha_entrevista_final') k = 'fecha_final';
    // Observaciones del bono pertenecen al RECLUTAMIENTO, no a bdProyecto
    if (k === 'observaciones_bono') {
      // Alias a 'observaciones' pero se enviará en el payload de reclutamiento
      k = 'observaciones';
    }
    if (k === 'fecha_real_evaluacion_monadica') k = 'fecha_monadica'; // <--- NUEVO ALIAS
  if (k === 'fecha_inicio_muestra') k = 'fecha_inicio_muestras';
  if (k === 'fecha_seguimiento_real_uso') k = 'fecha_seg_muestras';
  if (k === 'tiempo_entrevista_inicial') k = 'tiempo_e_inicial';
  if (k === 'tiempo_entrevista_final') k = 'tiempo_final';
  if (k === 'tiempo_evaluacion_monadica') k = 'tiempo_monadica_muestras';

    // Normalizar intervalos
    if (k.startsWith('tiempo_') && k !== 'tiempo_estatus_recibo') { // tiempo_estatus_recibo se procesa después como tiempo_recibo
      const norm = normalizeInterval(val);
      if (norm && INTERVAL_REGEX.test(norm)) {
        val = norm;
      } else {
        console.warn("Intervalo inválido ignorado:", k, val);
        return;
      }
    }

  if (participanteKeys.has(k)) {
      payloadParticipante[k] = val;
    } else if (hijoKeys.has(k)) {
      payloadBdHijo[k] = val;
    } else if (k === 'observaciones' && origKey === 'observaciones_bono') {
      // Forzar que 'observaciones' provenientes de observaciones_bono vayan a reclutamiento
      payloadReclutamientoPartial[k] = val;
    } else if (bdProyectoKeys.has(k)) {
      payloadBdProyecto[k] = val;
  } else if (reclutamientoKeys.has(k) || ['link','fecha_monadica','fecha_final','fecha_inicio_muestras','fecha_seg_muestras','tiempo_e_inicial','tiempo_final','tiempo_monadica_muestras'].includes(k)) {
      payloadReclutamientoPartial[k] = val;
    } else {
      console.warn("Campo sin destino:", origKey, "->", k);
    }
  });

  const requests = [];

  // Para participante: construir payload completo
if (modalState.participanteId && Object.keys(payloadParticipante).length) {
  const originalParticipante = await getParticipante(modalState.participanteId, token) || {};
  
  // Lista de campos posibles del participante (basado en tu API)
  const fullPayloadParticipante = {
    id_participante: originalParticipante.id_participante ?? null,
    nombre_participante: originalParticipante.nombre_participante ?? null,
    telefono_1: originalParticipante.telefono_1 ?? null,
    telefono_2: originalParticipante.telefono_2 ?? null,
    telefono_3: originalParticipante.telefono_3 ?? null,
    correo_electronico: originalParticipante.correo_electronico ?? null,
    barrio: originalParticipante.barrio ?? null,
    direccion: originalParticipante.direccion ?? null,
    ciudad: originalParticipante.ciudad ?? null,
    nacionalidad: originalParticipante.nacionalidad ?? null,
    fecha_nacimiento: originalParticipante.fecha_nacimiento ?? null,
    tipo_vivienda: originalParticipante.tipo_vivienda ?? null,
    fecha_registro: originalParticipante.fecha_registro ?? null,
    sexo: originalParticipante.sexo ?? null,
    origen_dato: originalParticipante.origen_dato ?? null,
    nse: originalParticipante.nse ?? null,
    // Agrega cualquier otro campo que tu API espere
  };

  // Sobrescribir con cambios
  Object.assign(fullPayloadParticipante, payloadParticipante);

  console.log('[PUT participante payload]', fullPayloadParticipante);
  requests.push(fetch(`${API_BASE}/participantes/${modalState.participanteId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(fullPayloadParticipante)
  }).then(r => ({ target: "participante", r })));
}

// Para bdhijo: construir payload completo
if (modalState.hijoId && Object.keys(payloadBdHijo).length) {
  const originalHijo = await getHijo(modalState.hijoId, token) || {};
  const fullPayloadHijo = {
    id: originalHijo.id ?? modalState.hijoId,
    nombre_hijo: originalHijo.nombre_hijo ?? originalHijo.nombre ?? null,
    fecha_nacimiento: originalHijo.fecha_nacimiento ?? null,
    sexo: originalHijo.sexo ?? null,
    tipo_documento: originalHijo.tipo_documento ?? null,
    documento: originalHijo.documento ?? null,
    id_participante: originalHijo.id_participante ?? (modalState.participanteId || null),
  };
  // Resolver alias hacia campos backend esperados
  if (payloadBdHijo.nombre) { payloadBdHijo.nombre_hijo = payloadBdHijo.nombre; delete payloadBdHijo.nombre; }

  Object.assign(fullPayloadHijo, payloadBdHijo);

  console.log('[PUT bdhijo payload]', fullPayloadHijo);
  requests.push(fetch(`${API_BASE}/hijos/${modalState.hijoId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(fullPayloadHijo)
  }).then(r => ({ target: "bdhijo", r })));
}

// Para bdproyecto: incluir TODOS los campos para mantener estado completo
if (modalState.bdProyectoId && Object.keys(payloadBdProyecto).length) {
  const originalBdProyecto = await getBdProyecto(modalState.bdProyectoId, token) || {};
  
  const fullPayloadBdProyecto = {
    id_bdproyecto: originalBdProyecto.id_bdproyecto ?? null,
    id_participante: originalBdProyecto.id_participante ?? null,
    id_proyecto: originalBdProyecto.id_proyecto ?? null,
    id_hijo: (originalBdProyecto.id_hijo != null) ? parseInt(originalBdProyecto.id_hijo, 10) : null,
    estado_participante: originalBdProyecto.estado_participante ?? null,
    p1: originalBdProyecto.p1 ?? null,
    p2: originalBdProyecto.p2 ?? null,
    p3: originalBdProyecto.p3 ?? null,
    p4: originalBdProyecto.p4 ?? null,
    p5: originalBdProyecto.p5 ?? null,
    p6: originalBdProyecto.p6 ?? null,
    p7: originalBdProyecto.p7 ?? null,
    p8: originalBdProyecto.p8 ?? null,
    p9: originalBdProyecto.p9 ?? null,
    p10: originalBdProyecto.p10 ?? null,
    p11: originalBdProyecto.p11 ?? null,
    p12: originalBdProyecto.p12 ?? null,
    p13: originalBdProyecto.p13 ?? null,
    p14: originalBdProyecto.p14 ?? null,
    p15: originalBdProyecto.p15 ?? null,
    p16: originalBdProyecto.p16 ?? null,
    p17: originalBdProyecto.p17 ?? null,
    p18: originalBdProyecto.p18 ?? null,
    p19: originalBdProyecto.p19 ?? null,
    p20: originalBdProyecto.p20 ?? null,
    p21: originalBdProyecto.p21 ?? null,
    p22: originalBdProyecto.p22 ?? null,
    p23: originalBdProyecto.p23 ?? null,
    p24: originalBdProyecto.p24 ?? null,
    p25: originalBdProyecto.p25 ?? null,
    p26: originalBdProyecto.p26 ?? null,
    p27: originalBdProyecto.p27 ?? null,
    p28: originalBdProyecto.p28 ?? null,
    p29: originalBdProyecto.p29 ?? null,
    p30: originalBdProyecto.p30 ?? null,
    p31: originalBdProyecto.p31 ?? null,
    p32: originalBdProyecto.p32 ?? null,
    p33: originalBdProyecto.p33 ?? null,
    p34: originalBdProyecto.p34 ?? null,
    p35: originalBdProyecto.p35 ?? null,
    p36: originalBdProyecto.p36 ?? null,
    p37: originalBdProyecto.p37 ?? null,
    p38: originalBdProyecto.p38 ?? null,
    p39: originalBdProyecto.p39 ?? null,
    p40: originalBdProyecto.p40 ?? null,
    p41: originalBdProyecto.p41 ?? null,
    p42: originalBdProyecto.p42 ?? null,
    p43: originalBdProyecto.p43 ?? null,
    p44: originalBdProyecto.p44 ?? null,
    p45: originalBdProyecto.p45 ?? null,
    p46: originalBdProyecto.p46 ?? null,
    p47: originalBdProyecto.p47 ?? null,
    p48: originalBdProyecto.p48 ?? null,
    p49: originalBdProyecto.p49 ?? null,
    p50: originalBdProyecto.p50 ?? null,
    p51: originalBdProyecto.p51 ?? null,
    p52: originalBdProyecto.p52 ?? null,
    p53: originalBdProyecto.p53 ?? null,
    p54: originalBdProyecto.p54 ?? null,
    p55: originalBdProyecto.p55 ?? null,
    p56: originalBdProyecto.p56 ?? null,
    p57: originalBdProyecto.p57 ?? null,
    p58: originalBdProyecto.p58 ?? null,
    p59: originalBdProyecto.p59 ?? null,
    p60: originalBdProyecto.p60 ?? null,
    p61: originalBdProyecto.p61 ?? null,
    documentos: originalBdProyecto.documentos ?? null,
    observaciones: originalBdProyecto.observaciones ?? null,
    observaciones_supervisora: originalBdProyecto.observaciones_supervisora ?? null,
    observaciones_docu: originalBdProyecto.observaciones_docu ?? null,
    contacto: originalBdProyecto.contacto ?? null,
    conclusion_1: originalBdProyecto.conclusion_1 ?? null,
    conclusion_2: originalBdProyecto.conclusion_2 ?? null,
    conclusion_3: originalBdProyecto.conclusion_3 ?? null,
  };

  Object.assign(fullPayloadBdProyecto, payloadBdProyecto);

  // Normalizar id_hijo para que sea compatible con sql.NullInt64 en el backend
  // (backend parece esperar objeto {Int64: number, Valid: true} o null)
  if (fullPayloadBdProyecto.hasOwnProperty('id_hijo')) {
    const v = fullPayloadBdProyecto.id_hijo;
    if (v === null || v === '' || v === undefined) {
      fullPayloadBdProyecto.id_hijo = null;
    } else {
      const n = Number(v);
      if (!Number.isNaN(n)) {
        fullPayloadBdProyecto.id_hijo = { Int64: Math.trunc(n), Valid: true };
      } else {
        // valor no convertible -> enviar null para evitar 400
        fullPayloadBdProyecto.id_hijo = null;
      }
    }
  } else {
    // asegurar que siempre se envíe explicitamente null si no existe
    fullPayloadBdProyecto.id_hijo = fullPayloadBdProyecto.id_hijo ?? null;
  }

  console.log('[PUT bdproyecto payload]', fullPayloadBdProyecto);
  const path = BD_PROYECTO_PLURAL ? "bdproyectos" : "bdproyecto";
  requests.push(fetch(`${API_BASE}/${path}/${modalState.bdProyectoId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(fullPayloadBdProyecto)
  }).then(r => ({ target: "bdproyecto", r })));
}

// Para reclutamiento: payload parcial (solo campos modificados)
if (modalState.reclutamientoId && Object.keys(payloadReclutamientoPartial).length) {
    // Construir payload completo requerido por UpdateReclutamiento
    const original = await getReclutamientoById(modalState.reclutamientoId, token) || {};

    // Mapeo UI -> backend (ya son iguales en la mayoría de casos)
    const fullPayload = {
      // Campos obligatorios según UPDATE
      id_bdproyecto: original.id_bdproyecto ?? null,
      id_profesional: original.id_profesional ?? null,
      orden_uso: original.orden_uso ?? [],
      fecha_asignacion_g: original.fecha_asignacion_g ?? null,
      fecha_asignacion_s: original.fecha_asignacion_s ?? null,
      fecha_realizacion_p: original.fecha_realizacion_p ?? null,
      fecha_e_inicial: original.fecha_e_inicial ?? null,
      tiempo_e_inicial: original.tiempo_e_inicial ?? null,
      tiempo_recibo: original.tiempo_recibo ?? null,
      estado: original.estado ?? null,
      link: original.link ?? null,
      fecha_despacho: original.fecha_despacho ?? [],
      fecha_recibe: original.fecha_recibe ?? null,
      fecha_inicio_muestras: original.fecha_inicio_muestras ?? [],
      fecha_seg_muestras: original.fecha_seg_muestras ?? [],
      fecha_monadica: original.fecha_monadica ?? [],
      irritaciones: original.irritaciones ?? [],
      fecha_final: original.fecha_final ?? null,
      tiempo_encuadre: original.tiempo_encuadre ?? null,
      tiempo_monadica_muestras: original.tiempo_monadica_muestras ?? [],
      tiempo_final: original.tiempo_final ?? null,
      ganador: original.ganador ?? null,
      fecha_restitucion: original.fecha_restitucion ?? null,
      fecha_envio_admin: original.fecha_envio_admin ?? null,
      fechas_bono: original.fechas_bono ?? [],
      observaciones: original.observaciones ?? null,
      entregables: original.entregables ?? [],
    efectividad: original.efectividad ?? null,
    efectividad_final: original.efectividad_final ?? null,
    tiro_blanco: original.tiro_blanco ?? [],
      modalidad_entrevista: original.modalidad_entrevista ?? null,
      consentimiento: original.consentimiento ?? null,
      observaciones_entregables: original.observaciones_entregables ?? null,
      fecha_codificacion: original.fecha_codificacion ?? null,
      descarte: original.descarte ?? null,
    };

    // Sobrescribir con cambios UI (traducciones específicas si aplica)
    for (const [kOrig,vRaw] of Object.entries(payloadReclutamientoPartial)) {
      const k = (kOrig === 'estado_encuadre') ? 'estado' : kOrig;
      let v = vRaw;
      if (k === 'link_entrevista') { // asegurar alias si entró así
        fullPayload.link = v;
        continue;
      }
      if (k === 'status_efectividad_final') { // mapear a efectividad_final
        fullPayload.efectividad_final = (v === true || v === 'true');
        continue;
      }
      if (kOrig === 'confirmacion_verbal') { // mapear a consentimiento bool
        fullPayload.consentimiento = (v === true || v === 'true');
        continue;
      }
      if (kOrig === 'irritacion_bebe_primer_producto') { // mapear a irritaciones[0] booleana
        const boolVal = (typeof v === 'string') ? /^(si|sí|true|1)$/i.test(v) : !!v;
        const arrIrr = Array.isArray(fullPayload.irritaciones) ? fullPayload.irritaciones.slice() : [];
        arrIrr[0] = boolVal;
        fullPayload.irritaciones = arrIrr;
        continue;
      }
      if (kOrig === 'tiempo_estatus_recibo') { // alias a tiempo_recibo
        if (typeof v === 'string' && INTERVAL_REGEX.test(v)) {
          const parts = v.split(':').map(Number);
          let totalSeconds = 0;
          if (parts.length === 2) totalSeconds = parts[0]*3600 + parts[1]*60;
          else if (parts.length === 3) totalSeconds = parts[0]*3600 + parts[1]*60 + parts[2];
          fullPayload.tiempo_recibo = { Duration: totalSeconds * 1e9, Valid: true };
        }
        continue;
      }
      if (kOrig === 'modalidad_entrevista_final') { // alias a modalidad_entrevista backend
        fullPayload.modalidad_entrevista = v;
        continue;
      }
      if (k === 'fecha_real_evaluacion_monadica') { // mapear a array fecha_monadica
        const dateOnly = (typeof v === 'string') ? v.substring(0,10) : v;
        const arr = Array.isArray(fullPayload.fecha_monadica) ? fullPayload.fecha_monadica.slice() : [];
        arr[0] = dateOnly;
        fullPayload.fecha_monadica = arr;
        continue;
      }
      if(k.startsWith('tiempo_') && typeof v === 'string' && INTERVAL_REGEX.test(v)) {
        const parts = v.split(':').map(Number);
        let totalSeconds = 0;
        if (parts.length === 2) totalSeconds = parts[0]*3600 + parts[1]*60;
        else if (parts.length === 3) totalSeconds = parts[0]*3600 + parts[1]*60 + parts[2];
        const ns = totalSeconds * 1e9;
        fullPayload[k] = { Duration: ns, Valid: true };
      } else if (k === 'fecha_entrevista_final') {
        fullPayload.fecha_final = v;
      } else if (k === 'modalidad_entrevista_final') {
        fullPayload.modalidad_entrevista = v;
      } else if (k === 'observaciones') {
        fullPayload.observaciones = v;
        continue;
      } else if (k === 'estado') {
        // Enviar como string ('true'|'false'|'')
        const s = String(v).trim().toLowerCase();
        if (s === 'true' || s === 'ok' || s === 'si' || s === 'sí' || s === '1') fullPayload.estado = 'true';
        else if (s === 'false' || s === 'no' || s === '0') fullPayload.estado = 'false';
        else fullPayload.estado = '';
        continue;
      } else if (k === 'link') {                      // <--- asegura guardar en 'link'
        fullPayload.link = v;
      } else {
        fullPayload[k] = v;
      }
    }

    // Mapear fecha_entrega_producto y fecha_recibo a array fecha_despacho (posiciones 0 y 1)
    if ('fecha_entrega_producto' in payloadReclutamientoPartial || 'fecha_recibo' in payloadReclutamientoPartial) {
      const origArr = Array.isArray(original.fecha_despacho) ? [...original.fecha_despacho] : [];
      if ('fecha_entrega_producto' in payloadReclutamientoPartial) {
        origArr[0] = payloadReclutamientoPartial.fecha_entrega_producto || null;
      }
      if ('fecha_recibo' in payloadReclutamientoPartial) {
        origArr[1] = payloadReclutamientoPartial.fecha_recibo || null;
      }
      // Limpiar trailing undefined
      fullPayload.fecha_despacho = origArr.filter((v,i) => v || i < 2);
      delete fullPayload.fecha_entrega_producto;
      delete fullPayload.fecha_recibo;
    }

    // Mapear fecha_inicio_muestra (UI) a fecha_inicio_muestras[0]
    if ('fecha_inicio_muestras' in payloadReclutamientoPartial) {
      const origArr = Array.isArray(original.fecha_inicio_muestras) ? [...original.fecha_inicio_muestras] : [];
      origArr[0] = payloadReclutamientoPartial['fecha_inicio_muestras'] || null;
      fullPayload.fecha_inicio_muestras = origArr;
    }

    // Mapear fecha_seguimiento_real_uso (UI) a fecha_seg_muestras[0]
    if ('fecha_seg_muestras' in payloadReclutamientoPartial) {
      const origSeg = Array.isArray(original.fecha_seg_muestras) ? [...original.fecha_seg_muestras] : [];
      origSeg[0] = payloadReclutamientoPartial['fecha_seg_muestras'] || null;
      fullPayload.fecha_seg_muestras = origSeg;
    }

    // --- Normalizar fechas: Backend espera timestamps con hora (ej: 2006-01-02T15:04:05Z) ---
    // Reglas:
    // 1. Campos con hora separada (fecha_e_inicial + hora) y (fecha_final + hora_final) se combinan.
    // 2. Si solo hay fecha sin 'T', se le agrega 'T00:00:00Z'.
    // 3. Arrays se normalizan igual elemento a elemento.

    // function ensureDateTime(val){
    //   if(!val) return val;
    //   if(typeof val !== 'string') return val;
    //   if(val.includes('T')) return val; // ya tiene hora
    //   return `${val}T00:00:00Z`;
    // }

    // Combinar fecha_e_inicial con hora
    function extractHour(dt){
      if(!dt || typeof dt !== 'string') return null;
      const m = dt.match(/T(\d{2}:\d{2})/);
      return m ? m[1] : null;
    }
    const uiHora = payloadReclutamientoPartial.hora; // puede existir si usuario cambió
    if (fullPayload.fecha_e_inicial) {
      let datePart = fullPayload.fecha_e_inicial.split('T')[0];
      let existingHour = extractHour(fullPayload.fecha_e_inicial);
      let hourPart = uiHora || existingHour || '00:00';
      if (hourPart.length === 5) hourPart = hourPart + ':00';
      fullPayload.fecha_e_inicial = `${datePart}T${hourPart}Z`;
    }

    // Combinar fecha_final con hora_final (solo si fecha_final existe)
    const uiHoraFinal = payloadReclutamientoPartial.hora_final;
    if (fullPayload.fecha_final) {
      let datePart = fullPayload.fecha_final.split('T')[0];
      let existingHourF = extractHour(fullPayload.fecha_final);
      let hourPart = uiHoraFinal || existingHourF || '00:00';
      if (hourPart.length === 5) hourPart = hourPart + ':00';
      fullPayload.fecha_final = `${datePart}T${hourPart}Z`;
    }

    // Otros campos fecha_* si vienen sin hora añadir midnight UTC
    // const dateTimeFields = [
    //   'fecha_asignacion_g','fecha_asignacion_s','fecha_realizacion_p','fecha_recibe',
    //   'fecha_restitucion','fecha_envio_admin','fecha_codificacion'
    // ];
    // dateTimeFields.forEach(f => { if(fullPayload[f]) fullPayload[f] = ensureDateTime(fullPayload[f]); });

    // function normalizeArrayDates(arr){
    //   if(!Array.isArray(arr)) return arr;
    //   return arr.map(v => ensureDateTime(v));
    // }
    // if (Array.isArray(fullPayload.fecha_despacho)) fullPayload.fecha_despacho = normalizeArrayDates(fullPayload.fecha_despacho);
    // if (Array.isArray(fullPayload.fecha_inicio_muestras)) fullPayload.fecha_inicio_muestras = normalizeArrayDates(fullPayload.fecha_inicio_muestras);
    // if (Array.isArray(fullPayload.fecha_seg_muestras)) fullPayload.fecha_seg_muestras = normalizeArrayDates(fullPayload.fecha_seg_muestras);
    // if (Array.isArray(fullPayload.fechas_bono)) fullPayload.fechas_bono = normalizeArrayDates(fullPayload.fechas_bono);

    // Truncar a solo fecha TODOS los demás campos (backend los quiere YYYY-MM-DD)
    function toDateOnly(v){
      if(typeof v === 'string') return v.substring(0,10);
      return v;
    }
    const dateOnlyFields = [
      'fecha_asignacion_g','fecha_asignacion_s','fecha_realizacion_p','fecha_recibe',
      'fecha_restitucion','fecha_envio_admin','fecha_codificacion'
    ];
    dateOnlyFields.forEach(f => { if(fullPayload[f]) fullPayload[f] = toDateOnly(fullPayload[f]); });
  ['fecha_despacho','fecha_inicio_muestras','fecha_seg_muestras','fechas_bono','fecha_monadica'].forEach(arrF => {
      if(Array.isArray(fullPayload[arrF])) {
        fullPayload[arrF] = fullPayload[arrF].map(x => x ? toDateOnly(x) : x);
      }
    });

    // Asegurar que fecha_monadica sea SIEMPRE lista
    if (fullPayload.fecha_monadica && !Array.isArray(fullPayload.fecha_monadica)) {
      const v = fullPayload.fecha_monadica;
      fullPayload.fecha_monadica = [toDateOnly(v)];
    }

    // Remover campos UI hora sueltos
    delete fullPayload.hora;
    delete fullPayload.hora_final;
  delete fullPayload.modalidad_entrevista_final; // no lo espera backend

    // Construir tiro_blanco a partir de calificaciones si cambiaron
    if ('calificacion_tiro_blanco' in payloadReclutamientoPartial || 'calificacion_tiro_blanco_final' in payloadReclutamientoPartial) {
      const arrOrig = Array.isArray(original.tiro_blanco) ? [...original.tiro_blanco] : (Array.isArray(fullPayload.tiro_blanco)? [...fullPayload.tiro_blanco]:[]);
      if ('calificacion_tiro_blanco' in payloadReclutamientoPartial) {
        const v = parseInt(payloadReclutamientoPartial.calificacion_tiro_blanco,10);
        if(!isNaN(v)) arrOrig[0] = v; else arrOrig[0] = null;
      }
      if ('calificacion_tiro_blanco_final' in payloadReclutamientoPartial) {
        const v2 = parseInt(payloadReclutamientoPartial.calificacion_tiro_blanco_final,10);
        if(!isNaN(v2)) arrOrig[1] = v2; else arrOrig[1] = null;
      }
      // Limpiar nulls al final pero mantener posiciones si segunda existe
      const cleaned = [];
      if (arrOrig[0] != null) cleaned[0] = arrOrig[0];
      if (arrOrig[1] != null) cleaned[1] = arrOrig[1];
      fullPayload.tiro_blanco = cleaned;
      delete fullPayload.calificacion_tiro_blanco;
      delete fullPayload.calificacion_tiro_blanco_final;
    }

    console.log('[PUT reclutamiento payload]', JSON.parse(JSON.stringify(fullPayload)));

    requests.push(fetch(`${API_BASE}/reclutamientos/${modalState.reclutamientoId}`, {
      method:"PUT",
      headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},
      body:JSON.stringify(fullPayload)
    }).then(r => ({target:"reclutamiento", r, debugPayload: fullPayload})));
  }

  const results = await Promise.all(requests);
  let fail = false;
  for (const {target, r} of results) {
    if (!r.ok) {
      fail = true;
      console.error(`Error guardando ${target}`, r.status, await r.text());
    }
  }
  if (!fail) {
    cacheReclutamientos.clear();
    await cargarReclutamientos();
    modalInstance.hide();
    // Añadir alerta aquí
    Swal.fire({
        icon: 'success',
        title: '¡Guardado exitoso!',
        text: 'Los datos han sido guardados correctamente.',
        confirmButtonColor: '#9b51e0'
    });
} else {
    alert("Algunos cambios fallaron (ver consola).");
}
}

document.addEventListener("DOMContentLoaded", cargarReclutamientos);
window.openReclutamientoModal = openReclutamientoModal;
