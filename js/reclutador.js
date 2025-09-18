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