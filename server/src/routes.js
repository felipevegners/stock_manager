import express from "express";
import stockController from "./controllers/stockController.js";

const router = express.Router();
router.get('/stock', (req, res) => {
    res.send('Ok, funcionando!');
});

export default router;