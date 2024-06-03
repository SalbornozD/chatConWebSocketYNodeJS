import express from 'express';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js'
import __dirname from './utils.js';
import {Server} from 'socket.io';
import path from 'path'

//Configuracion del servidor.
const app = express();
const httpServer = app.listen(8080, () => {
    console.log("Servidor escuchando en el puerto 8080");
})

// Configuracion de las urls, para enviar JSON 
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', viewsRouter);

// Configuracion para la carpeta public, y poder usar archivos estaticos.
app.use('/static', express.static(path.join(__dirname, 'public')));

// Configuracion de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

const io = new Server(httpServer)
const mensajes = [
    {
        user: "Servidor",
        mensaje: "Bienvenido al chat"
    }
]

io.on('connection', socket=>{
    
    socket.on('message', data => {
        const nuevoMensaje = {user: data[0], mensaje: data[1]}
        mensajes.push(nuevoMensaje);
        io.emit('mensajes', mensajes);
    });

    socket.on('userValid', data => {
        socket.emit('mensajes', mensajes);
        socket.broadcast.emit('newUser', data);

    });


});



