require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const MongoClient = require("mongodb").MongoClient;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kqc2p.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(process.env.DB_USER)
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.send("Hello World");
});

client.connect((err) => {
  const collection = client.db("volunteerNetwork").collection("voluntaryWorks");
  const voluntaryEvent = client
    .db("volunteerNetwork")
    .collection("voluntaryEvents");

  app.post("/addVoluntaryWork", (req, res) => {
    const voluntaryWork = req.body;
    collection.insertOne(voluntaryWork).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/regesteredVoluntary", (req, res) => {
    console.log(req.query.email);
    collection
      .find({email: req.query.email})
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
  app.get("/adminPanel", (req, res) => {
    collection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    collection.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {
      res.send(result.deletedCount>0);
    });
  });

  app.post("/addEvent", (req, res) => {
    const event = req.body;
    console.log(event);
    voluntaryEvent.insertOne(event).then((res) => {
      console.log(res);
    });
  });

  app.get("/voluntaryEvents", (req, res) => {
    voluntaryEvent.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

app.listen(process.env.PORT || 5000);
