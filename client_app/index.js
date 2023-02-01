const express = require("express");
const app = express();
const PORT = process.env.PORT || 4002;
app.use(express.json());
app.listen(PORT, () => console.log("Server running at port " + PORT));
const amqp = require("amqplib");
var channel, connection;
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('../commands.db');

connectQueue()  // call the connect function
 
//fonction pour se connecter à la queur test-queue sur rabbitmq
async function connectQueue() {
    try {        
        connection = await amqp.connect("amqp://localhost:5672");
        channel    = await connection.createChannel()
        
        await channel.assertQueue("test-queue")
        
        channel.consume("test-queue",  function (data){            
            content = JSON.parse(data.content.toString())
            vals = ['commande traitée', content.id]
            db.run("update commands set command = ? where id = ?", vals, function(err){
                if(err){
                    console.log(err.message)
                }else{
                    channel.ack(data);
                    console.log("commande traitée")     
                }
            })   
        })    
    } catch (error) {
        console.log(error);
    }
}