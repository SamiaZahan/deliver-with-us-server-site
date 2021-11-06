const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId= require ('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nqgzx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('Database Connect Successfully');
        const database = client.db ('delivery-system');
        const servicesCollection = database.collection('services');
        const orderCollection= database.collection('orders');
        //POST Service API
        app.post('/services', async (req, res)=> {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result)
        });
        //GET SERVICES API
        app.get('/services', async(req,res)=> {
            let cursor = servicesCollection.find({});
            const services= await cursor.toArray();
            res.send(services);
        });
        //GET SINGLE SERVICE
        app.get('/services/:id', async(req,res)=>{
            const id= req.params.id;
            const query = { _id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })
        //Add Orders
        app.post('/orders', async(req,res)=>{
            const order= req.body;
            const result= await orderCollection.insertOne(order);
            res.json(result);
        });
        //GET ORDERS API
        app.get('/orders', async(req,res)=> {
            let cursor = orderCollection.find({});
            const orders= await cursor.toArray();
            res.send(orders);
        });
          //GET SINGLE Order
          app.get('/orders/:id', async(req,res)=>{
            const id= req.params.id;
            const query = { _id: ObjectId(id)};
            const order = await orderCollection.findOne(query);
            res.json(order);
        });
        //DELETE ORDER API
        app.delete('/orders/:id', async (req, res)=>{
            const id= req.params.id;
            const query = {_id : ObjectId(id)};
            const result= await  orderCollection.deleteOne(query);
            res.json(result);
        });
        //UPDATE ORDER STATUS
        app.put('/orders/:id', async (req, res)=>{
            const id= req.params.id;
            const updateOrder= req.body;
            const query = {_id : ObjectId(id)};
            const updateDoc = {
                $set:{
                    status: updateOrder.status
                }
            };

            const result= await  orderCollection.updateOne(query, updateDoc);
            res.json(result);
            
        })        
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req,res) => {
    res.send ('Server Running');
})

app.listen(port, () => {
    console.log('Server running on port', port);
})