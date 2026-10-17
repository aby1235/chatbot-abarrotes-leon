
/* =========================================================
   ABARROTES LEÓN - ASISTENTE VIRTUAL
   Respuestas preparadas y contenido multimedia
   ========================================================= */


/* =========================================================
   ELEMENTOS DEL DOM
   ========================================================= */

const chat = document.getElementById("chat");
const entrada = document.getElementById("entrada");
const botonEnviar = document.getElementById("botonEnviar");
const buscarTema = document.getElementById("buscarTema");
const categorias = document.getElementById("categorias");


/* =========================================================
   CATEGORÍAS DISPONIBLES
   ========================================================= */

const informacionTemas = {
    productos: {
        nombre: "Productos",
        icono: "🛍️"
    },

    tienda: {
        nombre: "Información de la tienda",
        icono: "🏪"
    },

    compras: {
        nombre: "Compras y disponibilidad",
        icono: "🧾"
    },

    atencion: {
        nombre: "Atención al cliente",
        icono: "💬"
    }
};


/* =========================================================
   ENVIAR MENSAJE
   ========================================================= */

function enviarMensaje() {
    if (!entrada) return;

    const texto = entrada.value.trim();

    if (texto === "") return;

    agregarMensajeUsuario(texto);
    entrada.value = "";

    mostrarIndicadorEscritura();

    setTimeout(() => {
        quitarIndicadorEscritura();
        procesarPregunta(texto);
    }, 500);
}


/* =========================================================
   CONECTAR BOTÓN DE ENVÍO
   ========================================================= */

if (botonEnviar) {
    botonEnviar.addEventListener("click", enviarMensaje);
}


/* =========================================================
   MENSAJE DEL USUARIO
   ========================================================= */

function agregarMensajeUsuario(texto) {
    const mensaje = document.createElement("div");
    mensaje.className = "mensaje usuario";

    const burbuja = document.createElement("div");
    burbuja.className = "burbuja";
    burbuja.textContent = texto;

    mensaje.appendChild(burbuja);
    chat.appendChild(mensaje);

    desplazarseChat();
}


/* =========================================================
   MENSAJE DEL BOT
   ========================================================= */

function agregarMensajeBot(contenido) {
    const mensaje = document.createElement("div");
    mensaje.className = "mensaje bot";

    mensaje.innerHTML = `
        <div class="avatar">🛒</div>
        <div class="burbuja">${contenido}</div>
    `;

    chat.appendChild(mensaje);
    desplazarseChat();
}


/* =========================================================
   RECONOCIMIENTO DE PREGUNTAS
   ========================================================= */

function procesarPregunta(texto) {
    const pregunta = normalizarTexto(texto);
    let temaEncontrado = null;

    if (!pregunta) return;

    /* SALUDOS */
    const saludos = [
        "hola",
        "buenas",
        "buenos dias",
        "buenas tardes",
        "buenas noches",
        "que tal",
        "holi"
    ];

    if (
        saludos.includes(pregunta) ||
        saludos.some(saludo => pregunta.startsWith(saludo + " "))
    ) {
        respuestaSaludo();
        return;
    }

    /* INFORMACIÓN DE LA TIENDA
       Se evalúa antes que productos para evitar confusiones. */

    const palabrasTienda = [
        "ubicacion",
        "donde estan",
        "donde esta",
        "donde se encuentra",
        "como llego",
        "direccion",
        "horario",
        "a que hora abren",
        "a que hora cierran",
        "cuando abren",
        "cuando cierran",
        "formas de pago",
        "metodos de pago",
        "telefono",
        "contacto",
        "quienes son",
        "historia de la tienda",
        "informacion de la tienda",
        "donde queda"
    ];

    if (contieneAlguna(pregunta, palabrasTienda)) {
        temaEncontrado = "tienda";
    }

    /* COMPRAS, PRECIOS Y DISPONIBILIDAD */

    else if (
        contieneAlguna(pregunta, [
            "precio",
            "precios",
            "cuanto cuesta",
            "cuanto cuestan",
            "cuanto vale",
            "cuanto valen",
            "esta disponible",
            "estan disponibles",
            "tienen existencia",
            "hay existencia",
            "existencias",
            "inventario",
            "hay ",
            "tienen ",
            "venden ",
            "comprar",
            "compra",
            "promocion",
            "promociones",
            "oferta",
            "ofertas",
            "cuanto pago",
            "costo",
            "cuanto sale"
        ])
    ) {
        temaEncontrado = "compras";
    }

    /* PRODUCTOS */

    else if (
        contieneAlguna(pregunta, [
            "producto",
            "productos",
            "que venden",
            "que puedo comprar",
            "que puedo encontrar",
            "que manejan",
            "catalogo",
            "alimentos",
            "bebidas",
            "botanas",
            "dulces",
            "galletas",
            "lacteos",
            "abarrotes",
            "limpieza",
            "higiene",
            "despensa",
            "marcas"
        ])
    ) {
        temaEncontrado = "productos";
    }

    /* ATENCIÓN AL CLIENTE */

    else if (
        contieneAlguna(pregunta, [
            "ayuda",
            "atencion",
            "consulta",
            "duda",
            "reclamo",
            "queja",
            "sugerencia",
            "personal",
            "necesito ayuda",
            "quiero reportar",
            "quiero preguntar",
            "gracias",
            "muchas gracias",
            "adios",
            "hasta luego"
        ])
    ) {
        temaEncontrado = "atencion";
    }

    if (temaEncontrado) {
        respuestaTema(temaEncontrado);
    } else {
        respuestaNoEncontrada();
    }
}


/* =========================================================
   BUSCAR PALABRAS CLAVE
   ========================================================= */

function contieneAlguna(texto, palabras) {
    return palabras.some(palabra => texto.includes(palabra));
}


/* =========================================================
   RESPUESTA A SALUDOS
   ========================================================= */

function respuestaSaludo() {
    agregarMensajeBot(`
        <h3>¡Hola! 👋 Bienvenido a Abarrotes León</h3>
        <p>
            Soy el asistente virtual de la tienda. Puedo orientarte
            sobre nuestros productos, información del negocio,
            compras y atención al cliente.
        </p>
        <p>¿Qué te gustaría consultar?</p>
        <div class="temas-relacionados">
            <p>🛍️ Productos</p>
            <p>🏪 Información de la tienda</p>
            <p>🧾 Compras y disponibilidad</p>
            <p>💬 Atención al cliente</p>
        </div>
    `);
}


/* =========================================================
   MOSTRAR TEMA DESDE LAS CATEGORÍAS
   ========================================================= */

function mostrarTema(clave) {
    if (!informacionTemas[clave]) {
        respuestaNoEncontrada();
        return;
    }

    respuestaTema(clave);
}


/* =========================================================
   RESPUESTA DEL TEMA
   ========================================================= */

function respuestaTema(clave) {
    if (
        typeof contenidos === "undefined" ||
        !contenidos ||
        !contenidos[clave]
    ) {
        respuestaNoEncontrada();
        return;
    }

    const contenido = contenidos[clave];

    const titulo = escapeHTML(
        contenido.titulo || informacionTemas[clave].nombre
    );

    const respuesta = contenido.respuesta || `
        <p>
            Por el momento no hay información registrada en esta
            sección. Intenta consultar otra categoría.
        </p>
    `;

    agregarMensajeBot(`
        <h3>${titulo}</h3>
        ${respuesta}
    `);

    setTimeout(() => {
        mostrarSelectorRecursos(clave);
    }, 300);
}


/* =========================================================
   MOSTRAR SELECTOR DE RECURSOS MULTIMEDIA
   ========================================================= */

function mostrarSelectorRecursos(clave) {
    if (typeof recursos === "undefined" || !recursos) return;

    const listaRecursos = recursos[clave];

    if (!Array.isArray(listaRecursos) || listaRecursos.length === 0) {
        return;
    }

    const tiposDisponibles = [
        {
            tipo: "imagen",
            icono: "🖼️",
            titulo: "Imágenes",
            descripcion: "Fotografías y material visual"
        },
        {
            tipo: "video",
            icono: "🎬",
            titulo: "Videos",
            descripcion: "Contenido audiovisual"
        },
        {
            tipo: "audio",
            icono: "🎧",
            titulo: "Audios",
            descripcion: "Información para escuchar"
        },
        {
            tipo: "pdf",
            icono: "📄",
            titulo: "Documentos PDF",
            descripcion: "Documentos informativos"
        }
    ];

    const tiposConRecursos = tiposDisponibles.filter(opcion =>
        listaRecursos.some(recurso => recurso.tipo === opcion.tipo)
    );

    if (tiposConRecursos.length === 0) return;

    const mensaje = document.createElement("div");
    mensaje.className = "mensaje bot";

    const opcionesHTML = tiposConRecursos.map(opcion => `
        <button
            class="recurso-opcion"
            onclick="filtrarRecursos('${clave}', '${opcion.tipo}')"
        >
            <span class="recurso-opcion-icono">${opcion.icono}</span>
            <span class="recurso-opcion-info">
                <strong>${opcion.titulo}</strong>
                <small>${opcion.descripcion}</small>
            </span>
            <span class="recurso-flecha">→</span>
        </button>
    `).join("");

    mensaje.innerHTML = `
        <div class="avatar">🛒</div>
        <div class="burbuja">
            <div class="selector-recursos">
                <h3>📚 Recursos informativos</h3>
                <p>Selecciona el tipo de recurso que deseas consultar:</p>
                <div class="recursos-opciones">
                    ${opcionesHTML}
                </div>
            </div>
        </div>
    `;

    chat.appendChild(mensaje);
    desplazarseChat();
}


/* =========================================================
   FILTRAR RECURSOS MULTIMEDIA
   ========================================================= */

function filtrarRecursos(clave, tipo) {
    if (typeof recursos === "undefined" || !recursos) return;

    const lista = recursos[clave];

    if (!Array.isArray(lista)) return;

    const encontrados = lista.filter(recurso => recurso.tipo === tipo);

    const mensaje = document.createElement("div");
    mensaje.className = "mensaje bot";

    let contenidoHTML = `
        <div class="avatar">🛒</div>
        <div class="burbuja">
            <div class="recursos-grid">
    `;

    if (encontrados.length === 0) {
        contenidoHTML += `
            <p>No hay recursos disponibles de este tipo.</p>
        `;
    } else {
        encontrados.forEach(recurso => {
            contenidoHTML += crearRecurso(recurso);
        });
    }

    contenidoHTML += `
            </div>
            <button
                class="boton-regresar"
                onclick="mostrarSelectorRecursos('${clave}')"
            >
                ← Regresar a recursos
            </button>
        </div>
    `;

    mensaje.innerHTML = contenidoHTML;
    chat.appendChild(mensaje);
    desplazarseChat();
}
/* =========================================================
   CREAR RECURSOS: SOLO IMÁGENES
   ========================================================= */

function crearRecurso(recurso) {
    if (recurso.tipo !== "imagen") return "";

    const titulo = escapeHTML(
        recurso.titulo || "Recurso informativo"
    );

    const descripcion = escapeHTML(
        recurso.descripcion || ""
    );

    const archivo = escapeAtributo(
        recurso.archivo || ""
    );

    if (!archivo) return "";

    return `
        <div class="recurso-card">
            <h4>${titulo}</h4>
            <p>${descripcion}</p>

            <div class="contenedor-imagen">
                <img
                    src="${archivo}"
                    alt="${titulo}"
                    class="recurso-imagen"
                    loading="lazy"
                    onerror="mostrarErrorImagen(this)"
                >
            </div>
        </div>
    `;
}

/* =========================================================
   ERROR AL CARGAR UNA IMAGEN
   ========================================================= */

function mostrarErrorImagen(imagen) {
    imagen.style.display = "none";

    const contenedor = imagen.parentElement;

    if (contenedor) {
        const aviso = document.createElement("p");
        aviso.className = "error-imagen";
        aviso.textContent =
            "No se pudo cargar la imagen. Verifica la ruta del archivo.";

        contenedor.appendChild(aviso);
    }
}


/* =========================================================
   RESPUESTA CUANDO NO SE RECONOCE LA PREGUNTA
   ========================================================= */

function respuestaNoEncontrada() {
    agregarMensajeBot(`
        <h3>🤔 No encontré una respuesta específica</h3>
        <p>
            Puedes preguntarme sobre los productos, la información
            de la tienda, las compras o la atención al cliente.
        </p>
        <div class="temas-relacionados">
            <p>🛍️ Productos</p>
            <p>🏪 Información de la tienda</p>
            <p>🧾 Compras y disponibilidad</p>
            <p>💬 Atención al cliente</p>
        </div>
        <p>
            Si necesitas conocer un precio, horario o existencia
            específica, esa información debe confirmarse con la tienda.
        </p>
    `);
}


/* =========================================================
   INDICADOR DE ESCRITURA
   ========================================================= */

function mostrarIndicadorEscritura() {
    quitarIndicadorEscritura();

    const indicador = document.createElement("div");
    indicador.id = "indicadorEscritura";
    indicador.className = "mensaje bot";

    indicador.innerHTML = `
        <div class="avatar">🛒</div>
        <div class="burbuja">
            <div class="indicador-escritura">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    chat.appendChild(indicador);
    desplazarseChat();
}


/* =========================================================
   QUITAR INDICADOR
   ========================================================= */

function quitarIndicadorEscritura() {
    const indicador = document.getElementById("indicadorEscritura");

    if (indicador) indicador.remove();
}


/* =========================================================
   BUSCADOR DE CATEGORÍAS
   ========================================================= */

if (buscarTema && categorias) {
    buscarTema.addEventListener("input", function () {
        const texto = normalizarTexto(this.value);
        const botones = categorias.querySelectorAll("button");

        botones.forEach(boton => {
            const nombre = normalizarTexto(boton.textContent);

            boton.style.display =
                texto === "" || nombre.includes(texto)
                    ? "flex"
                    : "none";
        });
    });
}


/* =========================================================
   ENTER PARA ENVIAR
   ========================================================= */

if (entrada) {
    entrada.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter" && !evento.shiftKey) {
            evento.preventDefault();
            enviarMensaje();
        }
    });
}


/* =========================================================
   NORMALIZAR TEXTO
   ========================================================= */

function normalizarTexto(texto) {
    return String(texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}


/* =========================================================
   PROTECCIÓN HTML
   ========================================================= */

function escapeHTML(texto) {
    const div = document.createElement("div");
    div.textContent = String(texto ?? "");
    return div.innerHTML;
}


/* =========================================================
   PROTECCIÓN DE ATRIBUTOS
   ========================================================= */

function escapeAtributo(texto) {
    return String(texto ?? "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}


/* =========================================================
   DESPLAZAMIENTO DEL CHAT
   ========================================================= */

function desplazarseChat() {
    if (!chat) return;

    setTimeout(() => {
        chat.scrollTop = chat.scrollHeight;
    }, 50);
}

    