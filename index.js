const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fgaci.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json())
app.use(cors());
const port = 5000


const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("Ema-Ecommerce-Store").collection("products");
  // console.log('database connected')
  app.post('/addProduct', (req, res) => {
    const products = req.body;
    productsCollection.insertOne(products)
    .then(result=> {
      console.log(result);
      res.send(result.insertedCount)
    })
  })

  app.get('/products', (req, res) => {
    productsCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({key: {$in: productKeys}})
    .toArray((err, docs) =>{
      res.send(docs);
    })
  })

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})