import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose';
import __dirname from './utils.js';
//import ProductManager from './dao/fileSystem/ProductManager.js'; 
//import CartManager from './dao/fileSystem/CartManager.js'; 
import productsDao from './dao/productsDao.js';
import cartsDao from './dao/cartsDao.js';
import productRoutes from './routes/products.router.js';
import cartRoutes from './routes/carts.router.js';
import sessionRouter from './routes/session.router.js';
import {Server} from 'socket.io';


//Server
const app = express();
const mongoUrl = 'mongodb://127.0.0.1:27017/'
const mongoDBName = 'ecommerce'
const server = app.listen(8080,()=>console.log('listening on port 8080'));

//Configuración de Handlebars
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname+'/public'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(session({
    store: MongoStore.create({
        mongoUrl,
        dbName: mongoDBName,
        ttl: 100
    }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))
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
//Pagina de Inicio
app.get('/', (req, res) => {
    //res.render('index', { title: 'Mi Página de Inicio' }); 
    res.redirect('/session/login'); 
});

//Socket
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
            const newProduct = await productsDao.addProduct(data);
            io.emit('product-added', newProduct);
        } catch (error) {
            console.error("Error al añadir producto:", error);
        }

    });

    socket.on('delete-product', async productId => {
        //productManager.deleteProduct(productId);
        try{
            await productsDao.deleteProduct(productId);
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