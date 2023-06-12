const express = require('express');
const path = require('path');
const PORT = 8080;
const cors = require('cors');
const promisePool = require('./dbConnection.js').promisePool
const { body, check, param, validationResult } = require("express-validator");

const app = express();
app.use(cors());
const corsOptions = { origin: ['http://localhost:3000'], optionsSuccessStatus: 200 }
// Middleware...
//app.use(cors())
app.use(express.json());
 app.use(express.urlencoded({extended: true}));

// parses JSON from incoming request
//app.use(express.json());

// Do not edit

const options = {
  lemon: 'yellow',
  lime: 'limegreen',
  tangerine: 'orange',
  grapefruit: 'lightcoral'
};

// Helper function 'getColor'
const getColor = (fruit) => {
  return options[fruit] || 'unknown';
};

app.get('/fruit/:name', (req, res) => {
  const fruitName = req.params.name;
  const color = getColor(fruitName);
  res.send({ fruit: fruitName, color: color });
});



// #1 serve the colors.html page when /colors is visited
// DO NOT USE express.static
app.get('/colors', () => {

      const ABSOLUTE_PATH = path.join(__dirname, '../client/colors.html');
         res.sendFile(ABSOLUTE_PATH);
         res.sendFile(path.join(__dirname, '../client/index.css'));
     })
    
  
// #2 & #4 handle POST requests to /colors

  app.post("/colors", cors(corsOptions), async (req, res) => {
    
    const { make, model, color, price } = req.body;

    const insertCar = await promisePool.query(
      `INSERT INTO car (make, model, price, color) VALUES (?,?,?,?)`,
      [make, model, price, color]
    );
    res.send(insertCar)
  });
  

// #6 serve styles.css - DO NOT use express.static()
app.get('/styles.css', () => {

    const ABSOLUTE_PATH = path.join(__dirname, '../client/styles.css');
       res.sendFile(ABSOLUTE_PATH);
       res.sendFile(path.join(__dirname, '../client/styles.css'));
   })
  

// #5 Update functionality to database
app.put('/colors/:id/:fruit', cors(corsOptions), async (req, res) => {

    const {  color, car_id } = req.body;
    const { result } = await promisePool.query(
      `UPDATE car set  color = ?, where car_id = ?`,
      [ color, car_id]
    );
    res.send(result);
  });
  
// #7 unknown routes - 404 handler
// research what route to serve this for
app.get(
  "/cars/:id",
  cors(corsOptions),
  param("id").isNumeric(),
  async (req, res) => {
    //Validation...
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const carId = req.params["id"];
    const [result] = await promisePool.query(
      `SELECT * FROM car WHERE car_id = ?`,
      [carId]
    );
    result[0]? res.send (result[0]):res.status(404).send({ message: "notfound." });
  }
);


  


// Global error handling middleware
// You can leave this alone
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});
