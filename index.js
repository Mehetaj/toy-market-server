const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;


// MiddleWare
app.use(cors());
app.use(express.json());
require("dotenv").config();



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4bdkenh.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    // const imgCollection = client.db('imgColllection').collection('img')
    // console.log(imgCollection);


    const toysCollection = client.db("toysCollection").collection("toys");
    const postedCollection = client.db("postedCollection").collection("posts")
    // console.log(toysCollection);



    app.get('/posts', async (req, res) => {
      const toys = postedCollection.find();
      const result = await toys.toArray();
      res.send(result)
    })


    app.get('/sportstoys', async (req, res) => {
      const toys = toysCollection.find();
      const result = await toys.toArray();
      res.send(result)
    })

    app.get('/posts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await postedCollection.findOne(query);
      res.send(result)
    })

    app.post('/posts', async (req, res) => {
      const toy = req.body;
      const result = await postedCollection.insertOne(toy);
      res.send(result)
    })


    app.put('/posts/:id', async (req, res) => {
      const id = req.params.id;
      const toy = req.body;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateUser = {
        $set: {
          price: toy?.price,
          quantity: toy?.quantity,
          description: toy?.description
        }
      }
      const result = await postedCollection.updateOne(filter,updateUser,option);
      res.send(result)
    })



    app.delete('/posts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await postedCollection.deleteOne(query);
      res.send(result)
    })

    app.get('/sportstoys/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const toy = await toysCollection.findOne(filter)
      res.send(toy)
    })






    ////////////////////////////////////////////
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Toys Marketplace server is buying')
})


app.listen(port, () => {
  console.log('Server is running on port', port);
})