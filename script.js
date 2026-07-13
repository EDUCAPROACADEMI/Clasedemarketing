let indice = 0;
let puntos = 0;

const menu = document.getElementById("menu");
const aprendizaje = document.getElementById("aprendizaje");
const juego = document.getElementById("juego");
const final = document.getElementById("final");

const tema = document.getElementById("tema");
const pregunta = document.getElementById("pregunta");
const opciones = document.getElementById("opciones");
const respuesta = document.getElementById("respuesta");
const siguiente = document.getElementById("siguiente");
const progreso = document.getElementById("progreso");
const resultadoFinal = document.getElementById("resultadoFinal");

function mostrarAprender() {
    menu.classList.add("oculto");
    aprendizaje.classList.remove("oculto");
}

function volverMenu() {
    aprendizaje.classList.add("oculto");
    menu.classList.remove("oculto");
}

function iniciarJuego() {
    menu.classList.add("oculto");
    aprendizaje.classList.add("oculto");
    juego.classList.remove("oculto");

    indice = 0;
    puntos = 0;

    mostrarPregunta();
}

function mostrarPregunta() {

    respuesta.style.display = "none";
    siguiente.style.display = "none";

    const p = preguntas[indice];

    tema.innerHTML = "📚 " + p.tema;
    pregunta.innerHTML =
        (indice + 1) +
        " / " +
        preguntas.length +
        "<br><br>" +
        p.pregunta;

    opciones.innerHTML = "";

    progreso.style.width =
        ((indice) / preguntas.length) * 100 + "%";

    p.opciones.forEach((texto, i) => {

        const div = document.createElement("div");

        div.className = "opcion";

        div.innerHTML = texto;

        div.onclick = () => responder(i, div);

        opciones.appendChild(div);

    });

}

function responder(opcion, elemento) {

    const p = preguntas[indice];

    const lista = document.querySelectorAll(".opcion");

    lista.forEach(o => o.onclick = null);

    if (opcion === p.correcta) {

        elemento.classList.add("correcta");

        puntos++;

        respuesta.style.background = "#d4edda";

        respuesta.innerHTML =
        "<h3>✅ ¡Correcto!</h3>" +
        "<br>" +
        "<b>🇪🇸 Español</b><br>" +
        p.explicacionES +
        "<br><br>" +
        "<b>🇺🇸 English</b><br>" +
        p.explicacionEN;

    } else {

        elemento.classList.add("incorrecta");

        lista[p.correcta].classList.add("correcta");

        respuesta.style.background = "#f8d7da";

        respuesta.innerHTML =
        "<h3>❌ Incorrecto</h3>" +
        "<br>" +
        "<b>Respuesta correcta:</b><br><br>" +
        p.opciones[p.correcta] +
        "<br><br>" +
        "<b>🇪🇸 Español</b><br>" +
        p.explicacionES +
        "<br><br>" +
        "<b>🇺🇸 English</b><br>" +
        p.explicacionEN;

    }

    respuesta.style.display = "block";

    siguiente.style.display = "inline-block";

}

function siguientePregunta() {

    indice++;

    progreso.style.width =
    (indice / preguntas.length) * 100 + "%";

    if (indice >= preguntas.length) {

        terminarJuego();

        return;

    }

    mostrarPregunta();

}

function terminarJuego() {

    juego.classList.add("oculto");

    final.classList.remove("oculto");

    let porcentaje =
        Math.round((puntos / preguntas.length) * 100);

    let mensaje = "";

    if (porcentaje == 100) {

        mensaje = "🏆 ¡Perfecto!";

    } else if (porcentaje >= 90) {

        mensaje = "⭐⭐⭐⭐⭐ Excelente";

    } else if (porcentaje >= 75) {

        mensaje = "⭐⭐⭐⭐ Muy bien";

    } else if (porcentaje >= 60) {

        mensaje = "⭐⭐⭐ Bien";

    } else if (porcentaje >= 40) {

        mensaje = "⭐⭐ Debes practicar más";

    } else {

        mensaje = "⭐ Sigue estudiando";

    }

    resultadoFinal.innerHTML =
    `
    <h2>${mensaje}</h2>

    <br>

    <h3>Puntaje</h3>

    <h1>${puntos} / ${preguntas.length}</h1>

    <h2>${porcentaje}%</h2>
    `;

}