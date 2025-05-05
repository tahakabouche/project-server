const express = require("express");
const logger = require("./middleware/logger.js");
const connectDB = require("./config/db.js");
const errorHandler = require("./middleware/errorhandler.js");
const cookieParser = require("cookie-parser");
const fileUpload = require('express-fileupload');
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const path = require('path');
const cors = require('cors');

//Route files
const { auth, users, products, cart, orders, shipping } = require("./routes");

//connect to db
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(logger);
app.use(mongoSanitize());

app.use(express.static(path.join(__dirname, 'public')));


// adds security headers
app.use(helmet());
// prevent xss attacks
app.use(xss());
// file upload
app.use(fileUpload());
//routers
app.use("/api/v1/products", products);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/cart", cart);
app.use("/api/v1/orders", orders);
app.use("/api/v1/shipping", shipping);

//error handler
app.use(errorHandler);

const server = app.listen(process.env.PORT);
