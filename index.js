const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middlewere
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.udxqu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const placeCollection = client.db('placeDB').collection('place')
    const userCollection = client.db('placeDB').collection('user')

    app.get('/user', async(req,res)=>{
        const cursor = userCollection.find();
        const result = await cursor.toArray(cursor)
        res.send(result)
    })

    app.post('/user', async(req,res)=>{
        const user = req.body;
        console.log(user)
        const result = await userCollection.insertOne(user)
        res.send(user)
    })

    app.get('/place', async(req,res)=>{
        const cursor = placeCollection.find();
        const result = await cursor.toArray(cursor);
        res.send(result)
    })

    app.post('/place' ,async(req,res)=>{
        const newPlace = req.body;
        console.log(newPlace)
        const result = await placeCollection.insertOne(newPlace);
        res.send(result)
    })

    app.delete('/place/:id', async(req,res)=>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id)};
        const result = await placeCollection.deleteOne(query);
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('Tourism server is running')
})

app.listen(port, () =>{
    console.log(`Tourism is running on port : ${port}`)
})