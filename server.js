// Importaciones
const express = require('express');
const {Server: HttpServer} = require('http');
const {Server: IOServer} = require('socket.io');
const productosRouter = require('./routes/productosRouter');

// importacion e instancia de la clase Chat
const optionsChat = require('./options/sqlite3');
const Chat = require('./js/chat');
const chat = new Chat('mensajes',optionsChat);

// importacion e instancia de la clase Productos
const optProd = require('./options/mariaDB');
const Productos = require('./js/productos');
const productos = new Productos('productos',optProd);

// Inicializar express, http y socket.io
const app = express();
const httpserver = new HttpServer(app);
const io = new IOServer(httpserver);
const port = 8080;

// middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set('view engine','ejs');
app.use(express.static("public"));
app.use('/',productosRouter);

// ruta principal
app.get('/',(req , res) => {
    res.render('pages/index');
});

// sockets
io.on('connection',(socket) => {

    //mensaje de usuario conectado
    console.log('Usuario conectado'); 

    // socket para productos
    socket.on('guardar', data => {
        console.log(data);
        const products = productos.readProducts();
        products.then(historialProductos => {
            io.sockets.emit('historialGuardar',historialProductos);
        });
    });

    const products = productos.readProducts();
    products.then(historialProductos => {
        if(historialProductos !== false){
            socket.emit('historialProductos',historialProductos);
        }else{
            console.log('La tabla no existe');
        }
    });

    //socket para chat
    socket.on('nuevoMensaje',data => {
        chat.newTable();
        chat.addMessage(data);
        const mensajes = chat.readMessages();
        mensajes.then(historialMensajes => {
            io.sockets.emit('historialGlobal',historialMensajes);
        });
    });
    const mensajes = chat.readMessages();
    mensajes.then(historialMensajes => {
        if(historialMensajes !== false){
            socket.emit('historialChat',historialMensajes);
        }else{
            console.log('La tabla no existe');
        }
    });
});

// server listen
httpserver.listen(port, () => {
    console.log(`Servidor corriendo en el puerto: ${port}`);
});