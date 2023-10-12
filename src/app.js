import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import ProductManager from '../src/ProductManager.js'; 
import CartManager from '../src/CartManager.js'; 
import productRoutes from './routes/products.js';
import cartRoutes from './routes/carts.js';
import {Server} from 'socket.io';

//Server
const app = express();
const server = app.listen(8080,()=>console.log('listening on port 8080'));

//Configuración de Handlebars
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname+'/public'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));


//Instancias
const productManager = new ProductManager('Products.json');
const cartManager = new CartManager('Carts.json');

//Routes
app.use('/products', productRoutes);
app.use('/carts', cartRoutes);

//Pagina de Inicio
app.get('/', (req, res) => {
    res.render('index', { title: 'Mi Página de Inicio' }); 
});

//Socket
const io = new Server(server);
io.on('connection', socket => {
    console.log('Cliente conectado');
    socket.on('disconnect', () => {
        console.log('Un usuario se desconectó');
    });
    
    socket.on('add-product', data => {
        console.log(data);
        const newProduct = productManager.addProduct(data);
        io.emit('product-added', newProduct);
    });

    socket.on('delete-product', productId => {
        productManager.deleteProduct(productId);
        io.emit('product-deleted', productId);
    });

});