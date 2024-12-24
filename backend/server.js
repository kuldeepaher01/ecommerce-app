const express = require("express");
const cors = require("cors");

const apiProducts = require("./routes/products");
const apiOrders = require("./routes/orders");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/products", apiProducts);
app.use("/api/orders", apiOrders);

// ///////////////////////////////////////////////////////////////Order Routes//////////////////////////////////////////////////

// ///////////////////////////////////////////////////////////////App//////////////////////////////////////////////////

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
