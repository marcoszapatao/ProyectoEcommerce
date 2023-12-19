import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser'
import config from './config/config.js';
import __dirname from './utils.js';
//import ProductManager from './dao/fileSystem/ProductManager.js'; 
//import CartManager from './dao/fileSystem/CartManager.js'; 
import productsDao from './dao/productsDao.js';
import cartsDao from './dao/cartsDao.js';
import productRoutes from './routes/products.router.js';
import cartRoutes from './routes/carts.router.js';
import sessionRouter from './routes/session.router.js';
import userRouter from './routes/user.router.js';
import {Server} from 'socket.io';
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import ProductRepository from './services/products.repository.js';

//Server
const app = express();
const PORT = config.PORT
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
//Instancias
//const productManager = new ProductManager('Products.json');
//const cartManager = new CartManager('Carts.json');
// const productsDao = new ProductsDao();
// const cartsDao = new CartsDao();

//Routes
//app.use('/products', productRoutes);
//app.use('/carts', cartRoutes);
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
//Pagina de Inicio
app.get('/', (req, res) => {
    res.redirect('/session/login'); 
});

//Socket
const UserService = new ProductRepository(new productsDao())
const io = new Server(server);
io.on('connection', socket => {
    console.log('Cliente conectado');
    socket.on('disconnect', () => {
        console.log('Un usuario se desconectó');
    });
    
    socket.on('add-product', async data => {
        try{
            console.log(data);
            //const newProduct = productManager.addProduct(data);
            const newProduct = await UserService.addProduct(data);
            io.emit('product-added', newProduct);
        } catch (error) {
            console.error("Error al añadir producto:", error);
        }

    });

    socket.on('delete-product', async productId => {
        //productManager.deleteProduct(productId);
        try{
            await UserService.deleteProduct(productId);
            io.emit('product-deleted', productId);
        }catch(error){
            console.error("Error al eliminar producto:", error);
        }
    });

});

// Conectamos Mongo
mongoose.connect(mongoUrl, { dbName: mongoDBName})
    .then(() => {
        console.log('DB connected! 😎 ')
    })
    .catch(error => {
        console.error('Error connect DB 🚑 ')
    })