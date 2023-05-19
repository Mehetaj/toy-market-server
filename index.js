const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;


// MiddleWare
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://toyMarketplace:axUVTCNxShzeYpzO@cluster0.4bdkenh.mongodb.net/?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4bdkenh.mongodb.net/?retryWrites=true&w=majority`;

const imgs = require('./img.json')

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

    const toysCollection = client.db("toysCollection").collection("toys")
    // console.log(toysCollection);

    app.get('/imgs', (req, res) => {
      res.send(imgs)
    })


    app.get('/sportstoys', async (req, res) => {
      const q = req.body;
      const toys = toysCollection.find();
      const result = await toys.toArray();
      res.send(result)
    })


    // app.get('/sportstoys', async (req, res) => {
    //   const q = req.body;
    //   const toys = toysCollection.find();
    //   const result = await toys.toArray();
    //   res.send(result)
    // })

    // app.post('/sportstoys', async (req, res) => {
    //   const toys = req.body;
    //   const result = await toysCollection.insertOne(data)
    //   res.send(result)
    // })

    app.post('/sportstoys', async (req, res) => {
      const toy = req.body;
      const result = await toysCollection.insertOne(toy);
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