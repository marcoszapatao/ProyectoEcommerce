import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser'
import config from './config/config.js';
import __dirname from './utils.js';
import productsDao from './dao/productsDao.js';
import cartsDao from './dao/cartsDao.js';
import productRoutes from './routes/products.router.js';
import cartRoutes from './routes/carts.router.js';
import sessionRouter from './routes/session.router.js';
import userRouter from './routes/user.router.js';
import chatRouter from './routes/chat.router.js';
import ticketRouter from './routes/ticket.router.js';
import {Server} from 'socket.io';
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import ProductRepository from './services/products.repository.js';
import { addLogger } from './utils/logger.js'
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'
import cors from 'cors'



//Server
const app = express();
const PORT = config.PORT || 8080;
const mongoUrl = config.MONGO_URL
const mongoDBName = config.MONGO_DBNAME
const server = app.listen(PORT,()=>console.log(`Running on port (${PORT})🏃 ...`));

//Configuración de Handlebars
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname+'/public'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors());

app.use(addLogger)

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion de Ecommerce',
            description: 'Este proyecto es un ecommerce'
        }
    },
    apis: [`${__dirname}/docs/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

/* Reemplazo por estrategia JWT */
// app.use(session({
//     store: MongoStore.create({
//         mongoUrl,
//         dbName: mongoDBName,
//         ttl: 100
//     }),
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: false
// }))
app.use(session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
app.use(cookieParser())

//Inicializo passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//Routes
app.use('/products', (req, res, next) => {
    req.productsDao = productsDao;
    next();
}, productRoutes);
app.use('/carts', (req, res, next) => {
    req.cartsDao = cartsDao;
    next();
}, cartRoutes);
app.use("/session", sessionRouter)
app.use("/user", userRouter)
app.use("/chat", chatRouter)
app.use("/ticket", ticketRouter)
//Pagina de Inicio
app.get('/', (req, res) => {
    res.redirect('/session/login'); 
});
// Ruta /loggerTest
app.get('/loggerTest', (req, res) => {
    req.logger.debug('Este es un mensaje de debug');
    req.logger.http('Este es un mensaje de http');
    req.logger.info('Este es un mensaje de info');
    req.logger.warning('Este es un mensaje de warning');
    req.logger.error('Este es un mensaje de error');
    req.logger.fatal('Este es un mensaje de fatal');
  
    res.send('Mensajes de log generados en /loggerTest');
  });


//Socket
const ProductService = new ProductRepository(new productsDao())
const io = new Server(server);
const messages = [];
io.on('connection', async socket => {
    console.log('Cliente conectado');
    socket.on('disconnect', () => {
        console.log('Un usuario se desconectó');
    });

    socket.on('add-product', async data => {
        try{
            const newProduct = await ProductService.addProduct(data);
            io.emit('product-added', newProduct);

        } catch (error) {
            console.error("Error al añadir producto:", error);
        }

    });

    socket.on('delete-product', async productId => {
        try{
            await ProductService.deleteProduct(productId);
            io.emit('product-deleted', productId);
        }catch(error){
            console.error("Error al eliminar producto:", error);
        }
    });

    socket.on('message', data => {
        messages.push(data)
        io.emit('messageLogs', messages)
    })

});

// Conectamos Mongo
mongoose.connect(mongoUrl, { dbName: mongoDBName})
    .then(() => {
        console.log('DB connected! 😎 ')
    })
    .catch(error => {
        console.error('Error connect DB 🚑 ')
    })