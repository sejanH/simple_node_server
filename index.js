'use strict';
require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;// Check the number of available CPU.
//create clusters
const os = require("os");
const cluster = require('cluster');
const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Parent ${process.pid} is running on ${port}`);
    // Fork workers.
    if (process.env.NODE_ENV === 'production') {
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
    } else {
        cluster.fork();
    }
    // This event is firs when worker died
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork();
    });
}
else {
    // For Worker
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    app.listen(port, err => {
        err ?
            console.log("Error in server setup") :
            console.log(`Child ${process.pid} started`);
    });
}
app.get('/', (req, res) => {
    res.send('I am just a server for api data.')
});