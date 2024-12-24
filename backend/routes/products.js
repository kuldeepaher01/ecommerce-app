const express = require("express");
const router = express.Router();
const cors = require("cors");
require("dotenv").config();
const Airtable = require("airtable");

router.use(cors());

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

router.get("/", async (req, res) => {
  try {
    console.log("[GET]: /api/products called");
    const records = await base("Products").select().all();
    const products = records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));
    res.json(products);
  } catch (error) {
    console.log("[ERROR]: GET /api/products failed", error);
    res.status(500).json({ error: "Failed to fetch products" + error });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("[POST]: /api/products called");
    const { name, description, price, imageUrl } = req.body;
    const record = await base("Products").create({
      name,
      description,
      price: parseFloat(price),
      imageUrl,
    });
    res.json({ id: record.id, ...record.fields });
  } catch (error) {
    console.log("[ERROR]: POST /api/products failed", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    console.log("[PUT]: /api/products/:id called");
    const { id } = req.params;
    const { name, description, price, imageUrl } = req.body;
    const record = await base("Products").update(id, {
      name,
      description,
      price: parseFloat(price),
      imageUrl,
    });
    res.json({ id: record.id, ...record.fields });
  } catch (error) {
    console.log("[ERROR]: PUT /api/products/:id failed", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    console.log("[DELETE]: /api/products/:id called");
    const { id } = req.params;
    await base("Products").destroy(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("[ERROR]: DELETE /api/products/:id failed", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
