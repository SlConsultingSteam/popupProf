const API_BASE = "https://api-postgre-ee5da0d4a499.herokuapp.com";

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
  origen: ["origen","origen_dato","fuente_origen"],
  nombre_apellido: ["nombre_participante","nombre","nombre_completo","nombre_apellido","participante"],
  mama: ["mama","madre"],
  cedula: ["cedula","documento","id_documento"],
  nacionalidad: ["nacionalidad","pais_origen"],
  edad: ["edad"],
  direccion: ["direccion","direccion_residencia"],
  barrio: ["barrio"],
  nse: ["nse","estrato","nivel_socioeconomico"],
  correo: ["correo","email","email_principal"],
  telefono1: ["telefono_1","telefono1","telefono","celular","contacto"],
  telefono2: ["telefono_2","telefono2"],
  telefono3: ["telefono_3","telefono3"],
  viaje_2meses: ["viaje_2meses"],
  bebe_nombre: ["bebe_nombre","nombre_hijo","nombre_bebe"],
  bebe_nacimiento: ["bebe_nacimiento","fecha_nacimiento_bebe","fecha_nacimiento","nacimiento"],
  bebe_edad_meses: ["bebe_edad_meses"],
  bebe_dias_meses: ["bebe_dias_meses"],
  bebe_sexo: ["bebe_sexo","sexo_bebe"],
  crema_marca: ["crema_marca"],
  crema_referencia: ["crema_referencia"],
  crema_producto: ["crema_producto"],
  crema_frecuencia: ["crema_frecuencia"],
  otra_crema_si_no: ["otra_crema_si_no"],
  otra_crema_marca: ["otra_crema_marca"],
  otra_crema_marca_referencia: ["otra_crema_marca_referencia"],
  otra_crema_razones: ["otra_crema_razones"],
  profesional: ["profesional"],
  otra_crema_frecuencia: ["otra_crema_frecuencia"],
  cambios_panal_dia: ["cambios_panal_dia"],
  fecha_asignacion_gestora: ["fecha_asignacion_gestora","fecha_asignacion_g"],
  fecha_asignacion_supervisora: ["fecha_asignacion_supervisora","fecha_asignacion_s"],
  fecha_realizacion_profesional: ["fecha_realizacion_profesional","fecha_realizacion_p"],
  estado_encuadre: ["estado_encuadre","estado"],
  tiempo_estatus_encuadre: ["tiempo_estatus_encuadre","tiempo_encuadre"],
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
  confirmacion_verbal: ["confirmacion_verbal"],
  fecha_ideal_inicio_muestra: ["fecha_ideal_inicio_muestra"],
  fecha_inicio_muestra: ["fecha_inicio_muestra","fecha_inicio_muestras","fecha_inicio_muestras_0"],
  fecha_ideal_seguimiento_uso: ["fecha_ideal_seguimiento_uso"],
  fecha_seguimiento_real_uso: ["fecha_seguimiento_real_uso","fecha_seg_muestras","fecha_seg_muestras_0"],
  fecha_ideal_evaluacion_monadica: ["fecha_ideal_evaluacion_monadica"],
  fecha_real_evaluacion_monadica: ["fecha_real_evaluacion_monadica","fecha_final"],
  tiempo_evaluacion_monadica: ["tiempo_evaluacion_monadica","tiempo_monadica_muestras_0"],
  irritacion_bebe_primer_producto: ["irritacion_bebe_primer_producto","irritaciones","irritaciones_0"],
  fecha_ideal_min_final: ["fecha_ideal_min_final"],
  fecha_ideal_max_final: ["fecha_ideal_max_final"],
  fecha_entrevista_final: ["fecha_entrevista_final","fecha_final"],
  hora_final: ["hora_final"],
  status_efectividad_final: ["status_efectividad_final"],
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
  observaciones_bono: ["observaciones_bono","observaciones","observaciones_entreg"]
};

// Override de nombres al guardar
const saveNameOverride = {
  nombre_apellido: "nombre_participante",
  telefono1: "telefono",
  telefono2: "telefono2",
  telefono3: "telefono3"
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

  tbody.innerHTML = `<tr><td colspan="7">Cargando...</td></tr>`;

  const reclutamientos = await getReclutamientos(idProfesional, token);
  if (!Array.isArray(reclutamientos) || reclutamientos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">Sin registros</td></tr>`;
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

  const rowsHTML = reclutamientos.map(r => {
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

    reclIndex.set(r.id, { reclutamiento: r, bdProyecto: bd, participante: part, hijo, proyecto: proyectoObj });

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
    const encuadre = norm(r, ["estado"]);
    const monadica = (r.tiempo_monadica_muestras && r.tiempo_monadica_muestras.length > 0) ? "En proceso" : "-";
    const finalE = r.fecha_final ? "Finalizado" : "-";

    return `<tr class="recl-row" data-id-recl="${escapeHTML(r.id)}">
      <td>${escapeHTML(nombre)}</td>
      <td>${escapeHTML(telefono)}</td>
  <td>${escapeHTML(proyectoNombre)}</td>
      <td>${escapeHTML(ciudad)}</td>
      <td>${escapeHTML(encuadre)}</td>
      <td>${escapeHTML(monadica)}</td>
      <td>${escapeHTML(finalE)}</td>
    </tr>`;
  }).join("");

  tbody.innerHTML = rowsHTML;

  tbody.querySelectorAll(".recl-row").forEach(tr => {
    tr.addEventListener("click", () => {
      const idRecl = tr.getAttribute("data-id-recl");
      openReclutamientoModal(Number(idRecl));
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

function openReclutamientoModal(reclId) {
  const triple = reclIndex.get(reclId);
  if (!triple) {
    console.warn("No data para reclutamiento", reclId);
    return;
  }
  const { reclutamiento, bdProyecto, participante, hijo } = triple;
  modalState.reclutamientoId = reclutamiento.id;
  modalState.bdProyectoId = bdProyecto ? (bdProyecto.id_bdproyecto || bdProyecto.id) : null;
  modalState.participanteId = participante ? (participante.id || participante.id_participante || participante.idParticipante) : null;

  const template = document.getElementById("popupFormTemplate");
  if (!template) return;

  const clone = template.cloneNode(true);
  clone.id = "popupDynamicForm";
  clone.style.display = "";

  const modalBody = document.getElementById("modalBodyContent");
  modalBody.innerHTML = "";
  modalBody.appendChild(clone);

  const combined = {};
  Object.assign(combined, reclutamiento);
  if (bdProyecto) Object.assign(combined, bdProyecto);
  if (participante) Object.assign(combined, participante);
  if (hijo) Object.assign(combined, hijo); // hijo aporta nombre_hijo, fecha_nacimiento, sexo, etc.

  console.log("[COMBINED]", combined);

  modalState.originalValues = {};
  clone.querySelectorAll("[data-field]").forEach(input => {
    const key = input.getAttribute("data-field");
    const val = resolveValue(key, combined);
    // Ajustes de tipo date/time (si backend devuelve '2025-09-05T00:00:00Z')
    if (input.type === "date" && val && val.length >= 10) {
      input.value = val.substring(0,10);
    } else if (input.type === "time" && val) {
      input.value = val.substring(0,5);
    } else {
      input.value = val;
    }
    modalState.originalValues[key] = input.value;
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
    "nombre_participante","telefono","telefono2","telefono3","correo","barrio","direccion",
    "ciudad","nacionalidad","edad","cedula","mama","viaje_2meses","bebe_nombre",
    "bebe_nacimiento","bebe_edad_meses","bebe_dias_meses","bebe_sexo","crema_marca",
    "crema_referencia","crema_producto","crema_frecuencia","otra_crema_si_no",
    "otra_crema_marca","otra_crema_marca_referencia","otra_crema_razones",
    "otra_crema_frecuencia","cambios_panal_dia","origen","nse"
  ]);
  const bdProyectoKeys = new Set([
    "proyecto","profesional","observaciones_bono"
  ]);
  const reclutamientoKeys = new Set([
    "fecha_asignacion_gestora","fecha_asignacion_supervisora","fecha_realizacion_profesional",
    "estado_encuadre","tiempo_estatus_encuadre","fecha_ideal_min","fecha_ideal_max",
    "fecha_real","hora","link_entrevista","efectividad","tiempo_entrevista_inicial",
    "calificacion_tiro_blanco","fecha_entrega_producto","fecha_recibo",
    "tiempo_estatus_recibo","confirmacion_verbal","fecha_ideal_inicio_muestra",
    "fecha_inicio_muestra","fecha_ideal_seguimiento_uso","fecha_seguimiento_real_uso",
    "fecha_ideal_evaluacion_monadica","fecha_real_evaluacion_monadica",
    "tiempo_evaluacion_monadica","irritacion_bebe_primer_producto",
    "fecha_ideal_min_final","fecha_ideal_max_final","fecha_entrevista_final",
    "hora_final","status_efectividad_final","modalidad_entrevista_final",
    "tiempo_entrevista_final","calificacion_tiro_blanco_final",
    "fecha_ideal_maxima_restitucion","restitucion_entregables","fecha_real_restitucion",
    "fecha_ideal_envio_admin","fecha_envio_real_admin",
    "fecha_ideal_maxima_entrega_bono","fecha_real_entrega_bono"
  ]);

  const payloadParticipante = {};
  const payloadBdProyecto = {};
  const payloadReclutamientoPartial = {};

  Object.entries(changed).forEach(([k,v]) => {
    if (participanteKeys.has(k)) payloadParticipante[k] = v;
    else if (bdProyectoKeys.has(k)) payloadBdProyecto[k] = v;
    else if (reclutamientoKeys.has(k)) payloadReclutamientoPartial[k] = v;
    else console.warn("Campo sin destino:", k);
  });

  const requests = [];
  if (modalState.participanteId && Object.keys(payloadParticipante).length) {
    requests.push(fetch(`${API_BASE}/participantes/${modalState.participanteId}`, {
      method:"PUT",
      headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},
      body:JSON.stringify(payloadParticipante)
    }).then(r => ({target:"participante", r})));
  }
  if (modalState.bdProyectoId && Object.keys(payloadBdProyecto).length) {
    const path = BD_PROYECTO_PLURAL ? "bdproyectos" : "bdproyecto";
    requests.push(fetch(`${API_BASE}/${path}/${modalState.bdProyectoId}`, {
      method:"PUT",
      headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},
      body:JSON.stringify(payloadBdProyecto)
    }).then(r => ({target:"bdproyecto", r})));
  }
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
      modalidad_entrevista: original.modalidad_entrevista ?? null,
      observaciones_entregables: original.observaciones_entregables ?? null,
      fecha_codificacion: original.fecha_codificacion ?? null,
      descarte: original.descarte ?? null,
    };

    // Sobrescribir con cambios UI (traducciones específicas si aplica)
    for (const [k,v] of Object.entries(payloadReclutamientoPartial)) {
      // Muchos campos UI ya usan snake_case del back
      fullPayload[k] = v;
      // Casos especiales de alias UI -> backend
      if (k === 'estado_encuadre') fullPayload.estado = v;
      if (k === 'fecha_entrevista_final') fullPayload.fecha_final = v;
      if (k === 'modalidad_entrevista_final') fullPayload.modalidad_entrevista = v;
      if (k === 'observaciones_bono') fullPayload.observaciones = v; // si decides mapearlo así
    }

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
  } else {
    alert("Algunos cambios fallaron (ver consola).");
  }
}

document.addEventListener("DOMContentLoaded", cargarReclutamientos);
window.openReclutamientoModal = openReclutamientoModal;
