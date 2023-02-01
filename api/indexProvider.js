const express = require("express");
const app = express();
const PORT = process.env.PORT || 4001;app.use(express.json());
const sqlite3 = require('sqlite3').verbose();


//creation de la base de donnees
let db = new sqlite3.Database(process.env.DB_URL);

//on verifie si la base de donnees existe
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
    if (err) {
      console.error(err.message);
    } else if (!row) { // si elle n existe pas on creer la table users et la table commands
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


//creation de la connexion a rabbitmq
const amqp = require("amqplib");
var channel, connection;  //global variables

async function connectQueue() {   
    try {        
        connection = await amqp.connect(process.env.RABBITMQ_URL);
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

app.post("/send-msg", (req, res) => {
    vals = [1, 'Commande en cours de traitement']
    db.run("insert into commands values(NULL, ?, ?)", vals, function(err){
        if(err){
            return res.status(500).json({ error: "Error inserting object into database" });
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

app.get('/get-state/:user_id', (req, res) => {
    val = req.params.user_id
    db.get('select command from commands where user_id=?', val, function(err, row){
        if(err){
            return res.status(500).json({ error: "Error getting the command" });
        }else{
            if(row === undefined){
                return res.status(404).json({ error: "Object not found" });
            }
            res.send(JSON.stringify(row))
        }
    })
})
