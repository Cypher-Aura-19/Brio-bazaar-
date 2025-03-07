const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const uploadImage = require("./src/utils/uploadImage");

const mongoose = require('mongoose');
const port = process.env.PORT || 5000;

// Middleware setup
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  

app.use(cors({ 
  origin: 'http://localhost:5173',
  credentials: true,
}));



const authRoutes = require('./src/users/user.route');
const productRoutes = require('./src/products/products.route');
const orderRoutes = require('./src/orders/orders.route');
const reviewRoutes = require('./src/reviews/reviews.router');
const statsRoutes = require('./src/stats/stats.route');

const discountPromotionRouter = require('./src/promotions/discountPromotionRoute');

const sellerRoutes = require('./src/sellers/sellerRoutes');

// Routes setup

app.use("/api/promotions", discountPromotionRouter);

app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/stats', statsRoutes);

app.use('/api/seller', sellerRoutes);

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  app.get('/', (req, res) => {
    res.send('Lebaba Ecommerce Server is Running..!');
  });
}

main().then(() => console.log('Mongodb connected successfully!')).catch(err => console.log(err));

app.post("/uploadImage", (req, res) => {
  const clientTimestamp = req.body.timestamp;
  const serverTimestamp = Date.now();

  // Log the timestamps for debugging
  console.log("Client Timestamp:", clientTimestamp);
  console.log("Server Timestamp:", serverTimestamp);

  // Check if the request is stale (older than 1 hour)
  if (Math.abs(serverTimestamp - clientTimestamp) > 3600000) {
    console.error("Request is stale");
    return res.status(400).send({ message: "Stale request - request is more than 1 hour old." });
  }

  // Proceed with upload
  uploadImage(req.body.image)
    .then((url) => res.send(url))
    .catch((err) => res.status(500).send(err));
});





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});