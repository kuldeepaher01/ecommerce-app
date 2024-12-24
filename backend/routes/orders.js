const express = require("express");
const router = express.Router();
const cors = require("cors");
require("dotenv").config();
const Airtable = require("airtable");

router.use(cors());

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

router.post("/", async (req, res) => {
  try {
    console.log("[POST]: /api/orders called");
    const {
      productId,
      buyerName,
      buyerEmail,
      quantity,
      buyerAddress,
      buyerCell,
    } = req.body;
    const record = await base("Orders").create({
      Product: [productId],
      buyerName,
      buyerEmail,
      buyerAddress,
      buyerCell,
      quantity: parseInt(quantity),
      status: "pending",
    });
    res.json({ id: record.id, ...record.fields });
  } catch (error) {
    console.log("[ERROR]: POST /api/orders failed", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

router.get("/", async (req, res) => {
  try {
    console.log("[GET]: /api/orders called");
    console.log("Query Params:", req.query);

    const { orderId, buyerEmail } = req.query;

    if (!orderId && !buyerEmail) {
      return res
        .status(400)
        .json({ error: "Provide either orderId or buyerEmail" });
    }

    let orders = [];

    if (orderId) {
      try {
        const record = await base("Orders").find(orderId);
        orders = [
          {
            id: record.id,
            ...record.fields,
          },
        ];
      } catch (error) {
        if (error.message === "NOT_FOUND") {
          return res.status(404).json({ error: "Order not found" });
        }
        throw error;
      }
    } else if (buyerEmail) {
      const records = await base("Orders")
        .select({
          filterByFormula: `{buyerEmail} = "${buyerEmail}"`,
        })
        .all();

      if (!records.length) {
        return res.status(404).json({ error: "Order not found" });
      }

      orders = records.map((record) => ({
        id: record.id,
        ...record.fields,
      }));
    }

    // console.log("Fetched Orders:", orders);

    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        if (order.Product && order.Product.length > 0) {
          const productId = order.Product[0];
          const productRecord = await base("Products").find(productId);
          return {
            ...order,
            Product: {
              id: productRecord.id,
              ...productRecord.fields,
            },
          };
        }
        return order;
      })
    );

    // console.log("Populated Orders:", populatedOrders);
    res.json(populatedOrders);
  } catch (error) {
    console.log("[ERROR]: GET /api/orders failed", error);
    res.status(500).json({ error: "Failed to fetch order: " + error });
  }
});

// router.delete("api/orders/:id", async (req, res) => {
//   try {
//     console.log("[DELETE]: /api/orders/:id called");
//     const { id } = req.params;
//     await base("Orders").destroy(id);
//     res.json({ message: "Order deleted successfully" });
//   } catch (error) {
//     console.log("[ERROR]: DELETE /api/orders/:id failed", error);
//     res.status(500).json({ error: "Failed to delete order" });
//   }
// });

router.put("/:id", async (req, res) => {
  try {
    // update the status to cancelled
    console.log("[PUT]: /api/orders/:id called");
    const { id } = req.params;
    const { status } = req.body;
    const record = await base("Orders").update(id, {
      status,
    });
    res.json({ id: record.id, ...record.fields });
  } catch (error) {
    console.log("[ERROR]: PUT /api/orders/:id failed", error);
    res.status(500).json({ error: "Failed to update order" });
  }
});
module.exports = router;
