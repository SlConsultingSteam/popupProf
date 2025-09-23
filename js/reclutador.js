
// Base de la API (misma que usa reclutamientos.js)
const API_BASE = "https://api-postgre-ee5da0d4a499.herokuapp.com";

async function postJSON(url, body, label) {
    const token = sessionStorage.getItem('token');
    try {
        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
        if (resp.status === 401) {
            sessionStorage.clear();
            window.location.href = 'login.html';
            return null;
        }
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) {
            console.error(`[${label}] ${resp.status}`, data);
            throw new Error(data?.error || `Error ${resp.status}`);
        }
        return data;
    } catch (e) {
        console.error(`[${label}] Network error`, e);
        throw e;
    }
}

// Helper GET con token y manejo básico de errores
async function getJSON(url, label) {
    const token = sessionStorage.getItem('token');
    try {
        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        if (resp.status === 401) {
            sessionStorage.clear();
            window.location.href = 'login.html';
            return null;
        }
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) {
            console.error(`[${label}] ${resp.status}`, data);
            throw new Error(data?.error || `Error ${resp.status}`);
        }
        return data;
    } catch (e) {
        console.error(`[${label}] Network error`, e);
        throw e;
    }
}

function showAlert(opts) {
    if (typeof Swal !== 'undefined') return Swal.fire(opts);
    alert(opts?.text || opts?.title || 'Aviso');
    return Promise.resolve();
}

// Formatea fecha ISO o YYYY-MM-DD a DD/MM/YYYY
function formatDate(value) {
    if (!value) return '';
    try {
        // Normalizar si viene con tiempo
        const s = String(value).trim();
        const ymd = s.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
        if (ymd) {
            const [y, m, d] = ymd.split('-');
            return `${d}/${m}/${y}`;
        }
        const dt = new Date(s);
        if (!isNaN(dt)) {
            const dd = String(dt.getDate()).padStart(2, '0');
            const mm = String(dt.getMonth() + 1).padStart(2, '0');
            const yy = dt.getFullYear();
            return `${dd}/${mm}/${yy}`;
        }
    } catch { /* noop */ }
    return String(value);
}

// Manejo de envío del formulario Derma Ligh (26)
safeAddListener('form1-form', 'submit', async function (e) {
    e.preventDefault();
    const btn = e.submitter || this.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;

    // Tomar valores del formulario
    const fechaEnvio = (document.getElementById('fechaEnvio')?.value || '').trim();
    const identificacion = (document.getElementById('identificacion')?.value || '').trim();
    const nombre = (document.getElementById('nombre')?.value || '').trim();
    const nacionalidad = (document.getElementById('nacionalidad')?.value || '').trim();
    const fechaNacimiento = (document.getElementById('fechaNacimiento')?.value || '').trim();
    const sexo = (document.getElementById('sexo')?.value || '').trim();
    const direccion = (document.getElementById('direccion')?.value || '').trim();
    const barrio = (document.getElementById('barrio')?.value || '').trim();
    const nse = (document.getElementById('nse')?.value || '').trim();
    const telefono1 = (document.getElementById('telefono1')?.value || '').trim();
    const telefono2 = (document.getElementById('telefono2')?.value || '').trim();
    const fechaNacimientoBebe = (document.getElementById('fechaNacimientoBebe')?.value || '').trim();
    const usuarioCrema = (document.getElementById('usuarioCrema')?.value || '').trim();

    // Guardar JSON localmente (último envío)
    const formJson = {
        proyecto: 'Derma Ligh (26)',
        fecha_envio: fechaEnvio || null,
        documento: identificacion || null,
        nombre_participante: nombre || null,
        nacionalidad: nacionalidad || null,
        sexo: sexo || null,
        direccion: direccion || null,
        barrio: barrio || null,
        nse: nse ? Number(nse) : null,
        telefono_1: telefono1 || null,
        telefono_2: telefono2 || null,
        fecha_nacimiento_bebe: fechaNacimientoBebe || null,
        usuario_crema: usuarioCrema || null
    };
    try { localStorage.setItem('dermaligh26_form_last', JSON.stringify(formJson)); } catch { }

    // Verificar existencia por documento y teléfono 1
    if (!identificacion && !telefono1) {
        await showAlert({ icon: 'warning', title: 'Datos incompletos', text: 'Proporcione documento o teléfono 1 para validar existencia.' });
        if (btn) btn.disabled = false; return;
    }

    // Nota: asumimos que si existe === true -> ya está en base y NO se inserta; si existe === false -> se inserta
    // (el texto original parecía invertido).
    try {
        const existeResp = await postJSON(`${API_BASE}/participantes/existe`, { documento: identificacion, telefono: telefono1 }, 'participantes/existe');
        if (existeResp && existeResp.existe === true) {
            await showAlert({ icon: 'info', title: 'Participante existente', text: 'El participante ya se encuentra en nuestra base de datos.' });
            if (btn) btn.disabled = false; return;
        }
    } catch (e1) {
        await showAlert({ icon: 'error', title: 'Error al validar', text: e1.message || 'No fue posible validar el participante.' });
        if (btn) btn.disabled = false; return;
    }

    // Construir payload de inserción para Participantes (solo campos de la tabla Participantes)
    const payloadInsert = {};
    if (nombre) payloadInsert.nombre_participante = nombre.toUpperCase();
    if (identificacion) payloadInsert.documento = identificacion;
    if (telefono1) payloadInsert.telefono_1 = telefono1.toUpperCase();
    if (telefono2) payloadInsert.telefono_2 = telefono2.toUpperCase();
    if (barrio) payloadInsert.barrio = barrio.toUpperCase();
    if (direccion) payloadInsert.direccion = direccion.toUpperCase();
    if (nacionalidad) payloadInsert.nacionalidad = nacionalidad;
    if (fechaNacimiento) payloadInsert.fecha_nacimiento = fechaNacimiento;
    if (sexo) payloadInsert.sexo = sexo;
    if (nse) payloadInsert.nse = nse;
    if (fechaEnvio) payloadInsert.fecha_registro = fechaEnvio;

    // usar nombre completo del usuario (si existe) como origen_dato, fallback 'RECLUTADORA'
    const origenFromLogin = sessionStorage.getItem('nombre_completo') || '';
    payloadInsert.origen_dato = origenFromLogin.trim() ? origenFromLogin : 'RECLUTADORA';

    try {
        const resp = await postJSON(`${API_BASE}/participantes`, payloadInsert, 'participantes');
        if (!resp || resp.status >= 400) {
            showAlert({ icon: 'error', title: 'Error', text: 'Error al registrar participante' });
            btn.disabled = false;
            return;
        }

        // RESPUESTA ESPERADA: { "mensaje": "...", "id": nuevoID }
        const created = await resp.json?.() || resp; // soporta postJSON que devuelva fetch Response o JSON directamente
        const nuevoID = (created && (created.id ?? created.ID ?? created.Id)) || null;
        if (!nuevoID) {
            showAlert({ icon: 'warning', title: 'Atención', text: 'Participante creado pero no se obtuvo ID' });
            btn.disabled = false;
            return;
        }

        // Construir payload para BDProyectos y enviarlo si el participante se creó correctamente
        try {
            const proyectoSelect = document.getElementById('proyectos');
            const idProyecto = proyectoSelect ? proyectoSelect.value : null;

            const bdProyectoPayload = {
                id_participante: Number(nuevoID),
                id_proyecto: idProyecto ? Number(idProyecto) : null,
                estado_participante: "EN PROCESO"
            };
            // eliminar claves null para payload limpio
            Object.keys(bdProyectoPayload).forEach(k => { if (bdProyectoPayload[k] === null) delete bdProyectoPayload[k]; });

            const respBd = await postJSON(`${API_BASE}/bdproyectos`, bdProyectoPayload, 'bdproyectos');
            if (!respBd || respBd.status >= 400) {
                showAlert({ icon: 'warning', title: 'Aviso', text: 'Participante creado pero no se pudo crear bdproyecto' });
            } else {
                showAlert({ icon: 'success', title: 'Éxito', text: 'Participante y bdProyecto creados correctamente' });
            }
        } catch (err) {
            console.error('Error creando bdproyecto', err);
            showAlert({ icon: 'error', title: 'Error', text: 'Ocurrió un error al crear bdProyecto' });
        }

        // Opcional: limpiar el formulario
        e.target.reset();
    } catch (e2) {
        await showAlert({ icon: 'error', title: 'Error al registrar', text: e2.message || 'No fue posible registrar al participante.' });
    } finally {
        if (btn) btn.disabled = false;
    }
});
// Espera a que el contenido del DOM esté completamente cargado antes de ejecutar el script
document.addEventListener("DOMContentLoaded", function () {
    // Eliminada la función y llamada innecesaria de actualizarOpcionesEstado. El filtro de Estado se actualizará correctamente después de cargar los datos.

    // Selecciona el elemento <select> con id="proyectos"
    const selectProyectos = document.getElementById("proyectos");

    // Mapea value del select a los collapse ids que deben abrirse
    const proyectoPanelMap = {
        // value: [collapseIds...]
        '1': ['collapseTwo', 'collapseOne'] // Derma Ligh (26): mostrar Información (collapseTwo) y Formulario (collapseOne)
        // agrega más mappings si tienes más proyectos
    };

    function setCollapseStateForProject(value) {
        // cerrar todos los panels mapeados primero
        const allPanels = new Set(Object.values(proyectoPanelMap).flat());
        allPanels.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const inst = bootstrap.Collapse.getInstance(el) || new bootstrap.Collapse(el, { toggle: false });
            inst.hide();
        });
        // mostrar solo los mapeados
        const panels = proyectoPanelMap[String(value)] || [];
        panels.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const inst = bootstrap.Collapse.getInstance(el) || new bootstrap.Collapse(el, { toggle: false });
            inst.show();
        });
    }

    // Selecciona todos los botones del acordeón (para expandir/cerrar secciones)
    const accordionButtons = document.querySelectorAll(".accordion-button");

    // Selecciona todos los elementos del acordeón que contienen el contenido
    const accordionItems = document.querySelectorAll(".accordion-collapse");

    // Selecciona todos los formularios de proyectos
    const formularios = document.querySelectorAll(".formulario-proyecto");

    // Selecciona todos los elementos que muestran información adicional de los proyectos
    const infoProyectos = document.querySelectorAll(".info-proyecto");

    /**
     * Habilita o deshabilita los botones del acordeón
     * @param {boolean} enable - Si es true, habilita los botones; si es false, los deshabilita.
     */
    function toggleAccordionButtons(enable) {
        accordionButtons.forEach(button => {
            button.disabled = !enable; // Habilita o deshabilita el botón
            button.classList.toggle("disabled", !enable); // Agrega o quita la clase "disabled"
        });
    }

    /**
     * Cierra todos los acordeones eliminando la clase "show" de sus elementos
     */
    function closeAccordions() {
        accordionItems.forEach(item => {
            item.classList.remove("show"); // Oculta el contenido del acordeón
        });
    }

    // Al cargar la página, deshabilita los botones del acordeón
    toggleAccordionButtons(false);

    // Agrega un evento que se activa cuando cambia la selección en el <select>
    selectProyectos.addEventListener("change", function () {
        const proyectoSeleccionado = this.value; // Obtiene el value seleccionado en el <select>

        if (proyectoSeleccionado) {
            toggleAccordionButtons(true); // Habilita los botones si hay un proyecto seleccionado
        } else {
            toggleAccordionButtons(false); // Deshabilita los botones si no hay selección
            closeAccordions(); // Cierra los acordeones
        }

        // Oculta todos los formularios y la información de proyectos
        formularios.forEach(form => form.style.display = "none");
        infoProyectos.forEach(info => info.style.display = "none");

        // Si hay un proyecto seleccionado, muestra su formulario e info (asume ids 'form<value>' y 'info<value>')
        if (proyectoSeleccionado) {
            const formId = 'form' + proyectoSeleccionado;
            const infoId = 'info' + proyectoSeleccionado;
            const formEl = document.getElementById(formId);
            const infoEl = document.getElementById(infoId);
            if (formEl) formEl.style.display = "block";
            if (infoEl) infoEl.style.display = "block";
            // Abrir collapses mapeados para este proyecto
            setCollapseStateForProject(proyectoSeleccionado);
        }
    });

    // Aplicar estado inicial de collapses según el value preseleccionado
    document.addEventListener('DOMContentLoaded', () => {
        if (selectProyectos) setCollapseStateForProject(selectProyectos.value);
    });

    // Cierra los acordeones al cargar la página
    closeAccordions();
});
// Helper para añadir listeners sólo si el elemento existe
function safeAddListener(id, event, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, handler);
}

// Funcion para controlar el maximo del numero de documento
safeAddListener("inputDoc", "input", function () {
    if (this.value.length > 12) {
        this.value = this.value.slice(0, 12); // Limita a 12 caracteres
    }
});

safeAddListener("inputAge", "input", function () {
    let valor = this.value.replace(/\D/g, ""); // Elimina caracteres no numéricos

    if (valor.length > 3) valor = valor.slice(0, 3); // Limita a 3 caracteres

    let edadMaxima = 122; // Edad máxima permitida en Colombia

    // Permite que el usuario borre el input sin bloquearlo
    if (valor !== "" && parseInt(valor) > edadMaxima) {
        valor = edadMaxima;
    }

    this.value = valor;
});

safeAddListener("nse", "input", function () {
    let valor = parseInt(this.value, 10);

    // Si el número está fuera del rango, lo corrige automáticamente
    if (valor < 1) this.value = 1;
    if (valor > 6) this.value = 6;
});

// Funcion para controlar el maximo del numero telefonico 1
safeAddListener("telefono1", "input", function () {
    if (this.value.length > 10) {
        this.value = this.value.slice(0, 10); // Limita a 10 caracteres
    }
});
// Funcion para controlar el maximo del numero telefonico 2
safeAddListener("telefono2", "input", function () {
    if (this.value.length > 10) {
        this.value = this.value.slice(0, 10); // Limita a 10 caracteres
    }
});

// Para prohibir nuemeros en la zona del dolor
safeAddListener("partedol", "input", function (event) {
    // Elimina cualquier número ingresado
    this.value = this.value.replace(/\d/g, '');
});

// Filtros de estado y buscador para seguimiento
function setupSeguimientoFiltros() {
    const filtroEstado = document.getElementById("estado");
    const buscador = document.getElementById("buscadorSeguimiento");

    // Función para eliminar tildes/acentos
    function quitarTildes(texto) {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function filtrarTabla() {
        const estadoSeleccionado = filtroEstado ? filtroEstado.value.toLowerCase() : "";
        const textoBusqueda = buscador ? quitarTildes(buscador.value.trim().toLowerCase()) : "";

        // Seleccionar filas actuales (excluyendo mensaje de no resultados)
        const filas = document.querySelectorAll("#seguimiento-tbody tr");
        let visibles = 0;
        filas.forEach(fila => {
            if (fila.id === "seguimiento-mensaje-no-resultados") return;
            const estado = (fila.children[3] && fila.children[3].textContent) ? fila.children[3].textContent.trim().toLowerCase() : "";
            const nombre = (fila.children[0] && fila.children[0].textContent) ? quitarTildes(fila.children[0].textContent.trim().toLowerCase()) : "";
            const telefono = (fila.children[1] && fila.children[1].textContent) ? quitarTildes(fila.children[1].textContent.trim().toLowerCase()) : "";

            // Filtro por estado (exacto)
            const coincideEstado = estadoSeleccionado === "" || estado === estadoSeleccionado;
            // Filtro por nombre o teléfono (sin tildes)
            const coincideBusqueda = textoBusqueda === "" || nombre.includes(textoBusqueda) || telefono.includes(textoBusqueda);

            if (coincideEstado && coincideBusqueda) {
                fila.style.display = "";
                visibles++;
            } else {
                fila.style.display = "none";
            }
        });
        const mensaje = document.getElementById("seguimiento-mensaje-no-resultados");
        if (mensaje) {
            mensaje.style.display = visibles === 0 ? "table-row" : "none";
        }
    }

    if (filtroEstado) {
        filtroEstado.removeEventListener("change", filtrarTabla);
        filtroEstado.addEventListener("change", filtrarTabla);
    }
    if (buscador) {
        buscador.removeEventListener("input", filtrarTabla);
        buscador.addEventListener("input", filtrarTabla);
    }
    // Aplicar filtro al cargar datos
    setTimeout(filtrarTabla, 300);
}

document.addEventListener("DOMContentLoaded", setupSeguimientoFiltros);

// Cargar datos de Seguimiento desde la API según el origen (nombre_completo del usuario)
async function loadSeguimiento() {
    const tbody = document.getElementById('seguimiento-tbody');
    if (!tbody) return;

    // Limpia filas existentes y deja el mensaje de no resultados oculto
    tbody.innerHTML = '<tr id="seguimiento-mensaje-no-resultados" style="display:none;"><td colspan="8" class="seguimiento-no-resultados-td">No se encontraron participantes con ese criterio.</td></tr>';

    const origen = (sessionStorage.getItem('nombre_completo') || sessionStorage.getItem('usuario') || 'RECLUTADORA').trim();
    if (!origen) return;

    let participantes = [];
    try {
        const url = `${API_BASE}/participantes/origen/${encodeURIComponent(origen)}`;
        const resp = await getJSON(url, 'participantes/origen');
        console.log('Respuesta completa de la API participantes/origen:', resp);
        if (Array.isArray(resp)) participantes = resp;
        else if (resp) participantes = [resp];
    } catch (e) {
        console.error('Error cargando participantes por origen', e);
        return;
    }

    // Construir filas con datos complementarios (bdproyecto, proyecto y reclutamientos)
    const rows = [];
    const estadosSet = new Set();
    for (const p of participantes) {
        const nombre = p?.nombre_participante || p?.nombre || '';
        const telefono = p?.telefono_1 || p?.telefono1 || '';
        const email = p?.correo_electronico || p?.correo || p?.email || '';
        const fechaRegistro = formatDate(p?.fecha_registro || p?.fechaRegistro || '');
        const idp = p?.id_participante ?? p?.id ?? p?.ID;

        let estado = '';
        let idProyecto = null;
        let nombreProyecto = '';
        let idBdProyecto = null;
        let observaciones = '';

        if (idp != null) {
            try {
                // Nota: El backend expuesto indica /bdproyecto/{id}. Según indicación, {id} es id_participante
                const bd = await getJSON(`${API_BASE}/bdproyectos/participante/${idp}`, 'bdproyecto');
                const bdObj = Array.isArray(bd) ? (bd[0] || null) : bd;
                if (bdObj) {
                    estado = bdObj?.estado_participante || bdObj?.estado || '';
                    idProyecto = bdObj?.id_proyecto ?? bdObj?.proyecto_id ?? null;
                    idBdProyecto = bdObj?.id_bdproyecto ?? bdObj?.id ?? bdObj?.ID ?? null;
                    observaciones = bdObj?.observaciones || '';
                }
            } catch (e) {
                console.warn('Sin BDProyecto para participante', idp, e?.message || e);
            }
        }

        if (estado) estadosSet.add(estado);

        if (idProyecto != null) {
            try {
                const proj = await getJSON(`${API_BASE}/proyectos/${idProyecto}`, 'proyectos/id');
                nombreProyecto = proj?.nombre ?? proj?.nombre_proyecto ?? proj?.Nombre ?? `Proyecto ${idProyecto}`;
            } catch (e) {
                nombreProyecto = `Proyecto ${idProyecto}`;
            }
        }

        let fechaEfectividad = '';
        if (idBdProyecto != null) {
            try {
                const recls = await getJSON(`${API_BASE}/reclutamientos/bdproyecto/${idBdProyecto}`, 'reclutamientos/bdproyecto');
                const arr = Array.isArray(recls) ? recls : (recls ? [recls] : []);
                // Tomar la fecha_asignacion_g más reciente
                let best = null;
                for (const r of arr) {
                    const f = r?.fecha_asignacion_g || r?.fechaAsignacionG || r?.fecha_asignacion || r?.fecha_g;
                    if (!f) continue;
                    if (!best || new Date(f) > new Date(best)) best = f;
                }
                if (best) fechaEfectividad = formatDate(best);
            } catch (e) {
                // sin reclutamientos
            }
        }

        rows.push({ nombre, telefono, email, estado, fechaRegistro, proyecto: nombreProyecto || (idProyecto != null ? `ID ${idProyecto}` : ''), efectividad: '', fechaEfectividad, observaciones });
    }

    // Renderizar filas
    let html = '';
    for (const r of rows) {
        html += `<tr>` +
            `<td>${escapeHtml(r.nombre)}</td>` +
            `<td>${escapeHtml(r.telefono)}</td>` +
            `<td>${escapeHtml(r.email)}</td>` +
            `<td>${escapeHtml(r.estado)}</td>` +
            `<td>${escapeHtml(r.fechaRegistro)}</td>` +
            `<td>${escapeHtml(r.proyecto)}</td>` +
            `<td>${escapeHtml(r.efectividad)}</td>` +
            `<td>${escapeHtml(r.fechaEfectividad)}</td>` +
            `<td><button type="button" class="btn-observacion" data-nombre="${escapeHtml(r.nombre)}" data-observacion="${escapeHtml(r.observaciones || '')}">Ver</button></td>` +
            `</tr>`;
    }
    tbody.insertAdjacentHTML('beforeend', html);

    // Mostrar u ocultar mensaje de no resultados
    const mensaje = document.getElementById('seguimiento-mensaje-no-resultados');
    if (mensaje) mensaje.style.display = rows.length === 0 ? 'table-row' : 'none';

    // Actualizar el filtro de estado directamente desde los datos
    const filtroEstado = document.getElementById('estado');
    if (filtroEstado) {
        filtroEstado.innerHTML = '<option value="">TODOS</option>';
        Array.from(estadosSet).sort().forEach(estado => {
            filtroEstado.innerHTML += `<option value="${estado}">${estado}</option>`;
        });
    }

    // Re-enlazar buscador y filtro tras recarga de la tabla
    if (typeof setupSeguimientoFiltros === 'function') {
        setupSeguimientoFiltros();
    }
}

// Actualiza el selector de Estado basado en las filas actuales del seguimiento
function updateEstadoOptionsFromSeguimiento() {
    // Esta función ya no es necesaria, el filtro se llena directamente desde los datos en loadSeguimiento
    // Se deja vacía para compatibilidad si es llamada en otro lugar
    return;
}

// Escape básico para HTML
function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Disparar la carga de seguimiento al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadSeguimiento()
        .then(() => {
            // Delegación de eventos para los botones de observación
            const tbody = document.getElementById('seguimiento-tbody');
            if (tbody) {
                tbody.addEventListener('click', function (e) {
                    const btn = e.target.closest('.btn-observacion');
                    if (btn) {
                        const nombre = btn.getAttribute('data-nombre') || '';
                        const observacion = btn.getAttribute('data-observacion') || '';
                        // Título del modal
                        const modalTitle = document.getElementById('modalObservacionUnicaLabel');
                        if (modalTitle) modalTitle.textContent = `OBSERVACIÓN DE: ${nombre}`;
                        // Textarea de observación
                        const textarea = document.getElementById('modalObservacionUnicaTextarea');
                        if (textarea) textarea.value = observacion;
                        // Mostrar el modal
                        const modalEl = document.getElementById('modalObservacionUnica');
                        if (!modalEl) {
                            console.error('No se encontró el modalObservacionUnica en el DOM');
                            return;
                        }
                        // Cerrar cualquier modal abierto antes
                        try {
                            const modals = document.querySelectorAll('.modal.show');
                            modals.forEach(m => {
                                const inst = bootstrap.Modal.getInstance(m);
                                if (inst) inst.hide();
                            });
                        } catch (e) { console.warn('Error cerrando modals previos', e); }
                        try {
                            let modal = bootstrap.Modal.getInstance(modalEl);
                            if (!modal) {
                                modal = new bootstrap.Modal(modalEl);
                            }
                            modal.show();
                            setTimeout(() => { modalEl.focus && modalEl.focus(); }, 200);
                            console.log('Modal abierto correctamente');
                        } catch (e) {
                            console.error('Error mostrando el modal:', e);
                        }
                    } else {
                        console.log('No se encontró btn-observacion en el click');
                    }
                });
            } else {
                console.error('No se encontró el tbody de seguimiento');
            }
        })
        .catch(err => console.error('Fallo cargando seguimiento', err));
});

// *------------**************-------------------*
// Funciónes para RN (3)
safeAddListener("inputAgeRn", "input", function () {
    let valor = this.value.replace(/\D/g, ""); // Elimina caracteres no numéricos

    if (valor.length > 3) valor = valor.slice(0, 3); // Limita a 3 caracteres

    let edadMaxima = 122; // Edad máxima permitida en Colombia

    // Permite que el usuario borre el input sin bloquearlo
    if (valor !== "" && parseInt(valor) > edadMaxima) {
        valor = edadMaxima;
    }

    this.value = valor;
});
safeAddListener("inputAgeB", "input", function () {
    let valor = this.value.replace(/\D/g, ""); // Elimina caracteres no numéricos

    if (valor.length > 1) valor = valor.slice(0, 1); // Limita a 3 caracteres

    let edadMaxima = 3; // Edad máxima permitida en Colombia

    // Permite que el usuario borre el input sin bloquearlo
    if (valor !== "" && parseInt(valor) > edadMaxima) {
        valor = edadMaxima;
    }

    this.value = valor;
});
safeAddListener("inputDocRn", "input", function () {
    if (this.value.length > 12) {
        this.value = this.value.slice(0, 12); // Limita a 12 caracteres
    }
});

// *------------**************-------------------*
// Funciónes para T4E0 (46)
safeAddListener("inputAgeT4", "input", function () {
    let valor = this.value.replace(/\D/g, ""); // Elimina caracteres no numéricos

    if (valor.length > 3) valor = valor.slice(0, 3); // Limita a 3 caracteres

    let edadMaxima = 122; // Edad máxima permitida en Colombia

    // Permite que el usuario borre el input sin bloquearlo
    if (valor !== "" && parseInt(valor) > edadMaxima) {
        valor = edadMaxima;
    }

    this.value = valor;
});
safeAddListener("inputDocT4", "input", function () {
    if (this.value.length > 12) {
        this.value = this.value.slice(0, 12); // Limita a 12 caracteres
    }
});

// Validación del peso del bebé
safeAddListener("peso", "input", function () {
    let valor = this.value.replace(/\D/g, ""); // Elimina caracteres no numéricos

    if (valor !== "") {
        let peso = parseInt(valor);

        if (peso < 2) peso = 2;  // Mínimo permitido
        if (peso > 20) peso = 20; // Máximo permitido

        this.value = peso;
    }
});


// Sincronizar scroll horizontal arriba y abajo sin usar un clon de tabla que bloquee eventos
document.addEventListener('DOMContentLoaded', function () {
    var topScroll = document.querySelector('.table-scroll-top');
    var mainScroll = document.querySelectorAll('.table-responsive-seguimiento')[1];
    if (topScroll && mainScroll) {
        var table = mainScroll.querySelector('table');
        if (table) {
            // Crear un div vacío solo para el scroll, igualando el ancho de la tabla
            var scrollSpacer = document.createElement('div');
            function updateSpacerWidth() {
                scrollSpacer.style.width = table.offsetWidth + 'px';
            }
            updateSpacerWidth();
            window.addEventListener('resize', updateSpacerWidth);
            // Si el contenido de la tabla cambia dinámicamente
            var resizeObserver = new (window.ResizeObserver || window.MutationObserver)(function () {
                updateSpacerWidth();
            });
            if (window.ResizeObserver) {
                resizeObserver.observe(table);
            } else {
                resizeObserver.observe(table, { childList: true, subtree: true, attributes: true });
            }
            // Limpiar y agregar el spacer
            topScroll.innerHTML = '';
            topScroll.appendChild(scrollSpacer);
            topScroll.style.height = '18px';
            topScroll.style.position = 'relative';
            topScroll.style.overflowX = 'auto';
            topScroll.style.overflowY = 'hidden';
            // Sincronizar scroll
            topScroll.addEventListener('scroll', function () {
                mainScroll.scrollLeft = topScroll.scrollLeft;
            });
            mainScroll.addEventListener('scroll', function () {
                topScroll.scrollLeft = mainScroll.scrollLeft;
            });
        }
    }
});