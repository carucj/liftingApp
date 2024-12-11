import express from "express"
import { getData, createData } from "./controller.js";


const router = express.Router();

try {
    router
        .get("/data", getData)
        .post("/data", createData)
} catch (error) {
    console.log(error);
}


export default router;