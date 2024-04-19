const express = require('express');
const morgan = require('morgan');
const usersRouter = require('./Routes/userRoutes');
const productRouter = require('./Routes/productRoutes');
const mongoose = require('mongoose');
const cartRouter = require('./Routes/cartRoutes');
const favoritesRouter = require('./Routes/favoritesRoutes');
const orderRouter = require('./Routes/orderRoutes');
const app = express();

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('connected'))
  .catch((err) => console.log(err));

//*middleware* --------------------------------

app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
console.log(process.env.NODE_ENV);
app.use(express.static(`${__dirname}/public`));
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/favorites', favoritesRouter);
app.use('/api/v1/order', orderRouter);


module.exports = app;
