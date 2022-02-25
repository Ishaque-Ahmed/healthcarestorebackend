require('dotenv/config');
const app = require('./app');
const mongoose = require('mongoose');

global.__basedir = __dirname;

const DB = process.env.MONGODB_SERVER.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose.connect(DB)
    .then(() => console.log("CONNECTED TO MONGODB DATABASE"))
    .catch(err => console.error("MONGODB DATABASE CONNECTION FAILED"));

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Online Healthcare Store running on Port ${port}....`);
})