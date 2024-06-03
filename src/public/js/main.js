const socket = io();
const form = document.getElementById("form-mensaje-a-enviar");
const historialMensajes = document.getElementById("mensajes");
let user;

Swal.fire({
    tittle:"Identificate",
    input: "text",
    text: "Ingresa el usuario para identificarte en el chat",
    inputValidator: (value) => {
        return !value && 'Necesitas escribir un nombre de usuario para continuar!'
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value
    socket.emit('userValid', user)
})

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const mensaje = data.get("mensaje-a-enviar");
    socket.emit('message', [user, mensaje]);
})

socket.on('mensajes', data => {
    historialMensajes.innerHTML = ""
    data.forEach(mensaje => {
        const nuevoMensaje = document.createElement("li")
        nuevoMensaje.innerText = `${mensaje.user} - ${mensaje.mensaje}`
        historialMensajes.appendChild(nuevoMensaje);
    });
})

socket.on('newUser', data => {
    Swal.fire({
        text: `${data} se conectado`,
        toast: true,
        position: "top-right"
    })
});

