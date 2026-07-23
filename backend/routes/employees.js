const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET /employees
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM employees ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database Error" });
    }
});

// POST /employees
router.post("/", async (req, res) => {
    const { name, age, department } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO employees (name, age, department)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [name, age, department]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database Error" });
    }
});


module.exports = router;
