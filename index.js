const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ou5pzbq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const productsCollection = client.db('SHOP').collection('products')

        // get all the products
        app.get('/products', async (req, res) => {
            const result = await productsCollection.find().toArray();
            res.send(result);
        })

        //get specific product
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id
            const result = await productsCollection.findOne({ _id: ObjectId(id) })
            res.send(result);
        })

        //post a product
        app.post('/product', async(req,res)=>{
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            res.send(result);
        })

        //delete a product
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const result = await productsCollection.deleteOne({_id: ObjectId(id)});
            res.send(result);
        })
    } finally {
        // await client.close()
    }
}
run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send('SERVER IS RUNNING')
})
app.listen(5000, () => {
    console.log('Listening to port 5000');
})