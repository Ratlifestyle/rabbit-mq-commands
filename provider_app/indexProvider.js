const express = require("express");
const app = express();
const PORT = process.env.PORT || 4001;app.use(express.json());
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('../commands.db');
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
    if (err) {
      console.error(err.message);
    } else if (!row) {
      console.log("Table 'users' does not exist");
      // create table 'users'
      db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL
    )`, (err)=>{
        if(!err){
            db.run("INSERT INTO users VALUES (1, 'ratata')")
            db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='commands'", (err, row) => {
                if (err) {
                  console.error(err.message);
                } else if (!row) {
                  console.log("Table 'commands' does not exist");
                  // create table 'commands'
                  db.run(`CREATE TABLE commands (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    command TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )`);
                } else {
                  console.log("Table 'commands' exists");
                }
              });
        }
    });
    } else {
      console.log("Table 'users' exists");
    }
  });


  
app.listen(PORT, () => console.log("Server running at port " + PORT));

const amqp = require("amqplib");
const { json } = require("express");
var channel, connection;  //global variables
async function connectQueue() {   
    try {        
        connection = await amqp.connect("amqp://localhost:5672");
        channel = await connection.createChannel()
        
        await channel.assertQueue("test-queue")
        
    } catch (error) {
        console.log(error)
    }
}

connectQueue()
async function sendData (data) {    // send data to queue
    await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));
}

app.get("/send-msg", (req, res) => {
    vals = [1, 'Commande en cours de traitement']
    db.run("insert into commands values(NULL, ?, ?)", vals, function(err){
        if(err){
            console.log(err.message)
        }else{
            // data to be sent
            const data = {
                message: "créer le plat",
                id: this.lastID
            }
            sendData(data);  // pass the data to the function we defined 
            console.log("A message is sent to queue")
            res.send("Message Sent"); //response to the API request
        }
    })
    
})

app.get('/get-state', (req, res) => {
    vals = [1]
    db.get('select command from commands where user_id=?', vals, function(err, row){
        if(err){
            console.log(err.message)
        }else{
            res.send(JSON.stringify(row))
        }
    })
})
