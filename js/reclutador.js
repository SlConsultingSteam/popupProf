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

function showAlert(opts) {
    if (typeof Swal !== 'undefined') return Swal.fire(opts);
    alert(opts?.text || opts?.title || 'Aviso');
    return Promise.resolve();
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
    const edad = (document.getElementById('edad')?.value || '').trim();
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
        edad: edad ? Number(edad) : null,
        sexo: sexo || null,
        direccion: direccion || null,
        barrio: barrio || null,
        nse: nse ? Number(nse) : null,
        telefono_1: telefono1 || null,
        telefono_2: telefono2 || null,
        fecha_nacimiento_bebe: fechaNacimientoBebe || null,
        usuario_crema: usuarioCrema || null
    };
    try { localStorage.setItem('dermaligh26_form_last', JSON.stringify(formJson)); } catch {}

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
    if (nombre) payloadInsert.nombre_participante = nombre;
    if (identificacion) payloadInsert.documento = identificacion;
    if (telefono1) payloadInsert.telefono_1 = telefono1;
    if (telefono2) payloadInsert.telefono_2 = telefono2;
    if (barrio) payloadInsert.barrio = barrio;
    if (direccion) payloadInsert.direccion = direccion;
    if (nacionalidad) payloadInsert.nacionalidad = nacionalidad;
    if (edad) payloadInsert.edad = Number(edad);
    if (sexo) payloadInsert.sexo = sexo;
    if (nse) payloadInsert.nse = Number(nse);
    if (fechaEnvio) payloadInsert.fecha_registro = fechaEnvio;
    payloadInsert.origen_dato = 'RECLUTADORA';

    try {
        const insertResp = await postJSON(`${API_BASE}/participantes`, payloadInsert, 'insert participante');
        await showAlert({ icon: 'success', title: 'Registro exitoso', text: `Participante registrado correctamente.` });
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
    // Generar dinámicamente las opciones del filtro Estado
    function actualizarOpcionesEstado() {
        const filtroEstado = document.getElementById("estado");
        const filas = document.querySelectorAll("#seguimiento-tbody tr");
        const estadosSet = new Set();
        filas.forEach(fila => {
            if (fila.id === "seguimiento-mensaje-no-resultados") return;
            const estado = (fila.children[3] && fila.children[3].textContent) ? fila.children[3].textContent.trim() : "";
            if (estado) estadosSet.add(estado);
        });
        filtroEstado.innerHTML = '<option value="">TODOS</option>';
        Array.from(estadosSet).sort().forEach(estado => {
            filtroEstado.innerHTML += `<option value="${estado}">${estado}</option>`;
        });
    }
    actualizarOpcionesEstado();

    // Selecciona el elemento <select> con id="proyectos"
    const selectProyectos = document.getElementById("proyectos");

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
        const proyectoSeleccionado = this.value; // Obtiene el valor seleccionado en el <select>

        if (proyectoSeleccionado) {
            toggleAccordionButtons(true); // Habilita los botones si hay un proyecto seleccionado
        } else {
            toggleAccordionButtons(false); // Deshabilita los botones si no hay selección
            closeAccordions(); // Cierra los acordeones
        }

        // Oculta todos los formularios y la información de proyectos
        formularios.forEach(form => form.style.display = "none");
        infoProyectos.forEach(info => info.style.display = "none");

        // Si hay un proyecto seleccionado, muestra su formulario y su información
        if (proyectoSeleccionado) {
            document.getElementById(proyectoSeleccionado).style.display = "block"; // Muestra el formulario del proyecto seleccionado
            document.getElementById("info" + proyectoSeleccionado.slice(-1)).style.display = "block"; // Muestra la información del proyecto
        }
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
document.addEventListener("DOMContentLoaded", function () {
    const filtroEstado = document.getElementById("estado");
    const buscador = document.getElementById("buscadorSeguimiento");
    const filas = document.querySelectorAll("tbody tr");

    // Función para eliminar tildes/acentos
    function quitarTildes(texto) {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function filtrarTabla() {
        const estadoSeleccionado = filtroEstado ? filtroEstado.value.toLowerCase() : "";
        const textoBusqueda = buscador ? quitarTildes(buscador.value.trim().toLowerCase()) : "";

        let visibles = 0;
        filas.forEach(fila => {
            // Saltar la fila de mensaje
            if (fila.id === "seguimiento-mensaje-no-resultados") return;
            const estado = (fila.children[3] && fila.children[3].textContent) ? fila.children[3].textContent.trim().toLowerCase() : "";
            const nombre = (fila.children[0] && fila.children[0].textContent) ? quitarTildes(fila.children[0].textContent.trim().toLowerCase()) : "";
            const telefono = (fila.children[1] && fila.children[1].textContent) ? quitarTildes(fila.children[1].textContent.trim().toLowerCase()) : "";

            // Filtro por estado
            const coincideEstado = estadoSeleccionado === "" || estado.includes(estadoSeleccionado);
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
        filtroEstado.addEventListener("change", filtrarTabla);
    }
    if (buscador) {
        buscador.addEventListener("input", filtrarTabla);
    }
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