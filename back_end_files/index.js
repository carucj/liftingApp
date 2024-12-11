import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv'
import router from "./route.js";
import cors from "cors";
import 'longjohn';

const app = express();
dotenv.config();

// app.use(cors());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use((req, res, next) => {
    console.log(`request log: ${req.method} ${req.url}`);
    next();
});

//log request body
// app.use('', (req, res, next) => {
//     console.log('req.body:', req.body);
//     next();
// });

app.use('', router);

const port = 3000
const hostname = 'localhost';

app.listen(port, hostname, () => {
    console.log('Node.js listening on ' + port);
})

