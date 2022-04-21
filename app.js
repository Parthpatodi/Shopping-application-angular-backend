const express = require("express");
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const port = process.env.PORT || 3000;
const adminRouter = require('./routes/admin.route');
const subcategoryRouter = require('./routes/subcategory.route');
const productRouter = require('./routes/product.routes');
const cartRouter = require('./routes/cart.routes');
const wishRouter = require('./routes/wishlist.route');
const userRouter = require("./routes/user.route");
const orderRouter = require("./routes/order.route");

mongoose.connect("mongodb+srv://parthpatodi:Parth123@mongo-test.ni0an.mongodb.net/Shopping-application?retryWrites=true&w=majority").then((result) => {
    console.log("<---------Database Connected---------->");
}).catch((err) => {
    console.log("<---------Database Not Connected---------->");
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use('/product', productRouter);
app.use('/order', orderRouter);
app.use('/admin', adminRouter);
app.use('/subcategory', subcategoryRouter);
app.use("/cart", cartRouter);
app.use("/wishList", wishRouter);
app.use("/user", userRouter);
app.use("/", (request, response) => {
    response.send("Herllo in Vivah ....welcome in an Attire collection");
});

app.listen(port, () => {
    console.log("<------------Server Started at port no.----------->" + port)
});