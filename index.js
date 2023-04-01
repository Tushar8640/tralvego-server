const express = require("express");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const { MongoClient } = require("mongodb");
const app = express();
const port = process.env.PORT || 8000;

// middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vqk54.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("Assignment11");
    const tripsCollection = database.collection("trip");
    const ordersCollection = database.collection("orders");
    // const registerCollection = database.collection("allregister");

    // GET ALL EVENT TRIPS API
    app.get("/alltrips", async (req, res) => {
      const result = tripsCollection.find({});
      const trips = await result.toArray();
      res.send(trips);
      // console.log("hit the url",trips);
    });

    // Post event
    app.post("/addevent", async (req, res) => {
      const result = await tripsCollection.insertOne(req.body);
      console.log(result);
    });

    // GET SINGLE TRIP API
    app.get("/singleitem/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await tripsCollection.findOne(query);
      res.send(result);
      console.log(result);
    });

    //  Post Place Orders
    app.post("/placeorder", async (req, res) => {
      const result = await ordersCollection.insertOne(req.body);
      console.log(result);
    });

    // Get all orders
    app.get("/allorders", async (req, res) => {
      const result = ordersCollection.find({});
      const allorders = await result.toArray();
      res.send(allorders);
      console.log(allorders);
    });

    // Get my orders
    app.get("/myorders/:id", async (req, res) => {
      const email = req.params.id;
      console.log(email);
      const result = ordersCollection.find({ email: email });
      const myorders = await result.toArray();
      res.send(myorders);
      console.log(myorders);
    });

    // Delete event api
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.send(result);
      console.log(result);
    });

    // Delete myorder api
    app.delete("/deletemyorder/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.send(result);
      console.log(result);
    });

    // update status
    app.put("/approve/:id", (req, res) => {
      const id = req.params.id;
      const updatedStatus = "approved";

      const query = { _id: ObjectId(id) };

      ordersCollection
        .updateOne(query, {
          $set: {
            status: updatedStatus,
          },
        })
        .then((result) => res.send(result));
      console.log("hitted id", id);
    });
    console.log("database connected");
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello From assignment 11!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
