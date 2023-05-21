const express = require('express');
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gmvhoig.mongodb.net/?retryWrites=true&w=majority`;


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
        // await client.connect();

        const toyCollection = client.db('toyMaker').collection('toy')


        app.get('/toy/k/:text', async (req, res) => {
            const text = req.params.text;
            const query = { sub_category: text }
            const data = toyCollection.find(query)
            const result = await data.toArray()
            res.send(result);
        })
        app.get('/toy/g/:email', async (req, res) => {
            console.log(req.params.ememailail)
            const result = await toyCollection.find({ postedBy: req.params.email }).toArray();
            res.send(result)
        })
        app.get('/toy/g/:email/:text', async (req, res) => {
            if (req.params.text == "accending") {
                const result = await toyCollection.find().sort({ price: 1 }).toArray();
                console.log(result);
                return res.send(result)
            }
            if (req.params.text == "decending") {
                const result = await toyCollection.find().sort({ price: -1 }).toArray();
                console.log(result);
                return res.send(result)
            }
            const result = await toyCollection.find({}).toArray();
            res.send(result)
        })
        app.get('/toy', async (req, res) => {

            const result = await toyCollection.find().toArray();
            res.send(result)
        })
        // app.get('/toy', async (req, res) => {

        //     const cursor = toyCollection.find().sort({price: -1})
        //     const result = await cursor.toArray();
        //     res.send(result)
        // })

        app.get('/toy/h/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const data = { _id: new ObjectId(id) }
            const result = await toyCollection.findOne(data);
            res.send(result)
        })

        app.post('/toy', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await toyCollection.insertOne(user);
            res.send(result)
        })

        app.patch('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updated = req.body;
            const updatedToy = {
                $set: {
                    name: updated.name,
                    catagory: updated.catagory,
                    rating: updated.rating,
                    sub_catagory: updated.sub_catagory,
                    img: updated.img,
                    price: updated.price,
                    seller_name: updated.seller_name,
                    quantity:updated.quantity
                }
            }
            const result = await toyCollection.updateOne(filter, updatedToy);
            res.send(result)
        })

        app.delete('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query);
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


app.get('/', (req, res) => {
    res.send("Toy making server is running")
})

app.listen(port, () => {
    console.log(`server is runnign on ${port}`)
})