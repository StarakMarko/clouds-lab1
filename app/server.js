const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('node:path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

const requiredEnv = (name) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'root',
    password: requiredEnv('DB_PASSWORD'),
    database: process.env.DB_NAME || 'nodemysql'
});

db.connect(err => {
    if (err) {
        console.error('error', err);
    } else {
        console.log('ok');
    }
});


app.get('/', (req, res) => {
    res.send('ok');
});

app.get('/parks', (req, res) => {
    let { search = '', sortBy = '', sortDesc = 'false' } = req.query;

    let q = "SELECT * FROM parks";
    const values = [];

    if (search) {
        q += " WHERE name LIKE ?";
        values.push(`%${search}%`);
    }

    if (sortBy) {
        const order = sortDesc === 'true' ? 'DESC' : 'ASC';
        if (['price', 'length_of_bicycle_path', 'name'].includes(sortBy)) {
            q += ` ORDER BY ${sortBy} ${order}`;
        }
    }

    db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);

        const totalLength = data.reduce((sum, park) => sum + parseFloat(park.length_of_bicycle_path || 0), 0);

        return res.json({ parks: data, totalLength });
    });
});


app.post('/parks', (req, res) => {
    const { name, address, length_of_bicycle_path, price } = req.body;
    const q = "INSERT INTO parks (`name`, `address`, `length_of_bicycle_path`, `price`) VALUES (?, ?, ?, ?)";
    const values = [name, address, length_of_bicycle_path, price];

    db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "add new park", id: data.insertId });
    });
});

app.put('/parks/:id', (req, res) => {
    const parkId = req.params.id;
    const { name, address, length_of_bicycle_path, price } = req.body;

    const q = `
        UPDATE parks 
        SET name = ?, address = ?, length_of_bicycle_path = ?, price = ? 
        WHERE id = ?
    `;
    const values = [name, address, length_of_bicycle_path, price, parkId];

    db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "park eddited" });
    });
});

app.delete('/parks/:id', (req, res) => {
    const parkId = req.params.id;
    const q = "DELETE FROM parks WHERE id = ?";
    db.query(q, [parkId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "park deleted" });
    });
});

app.listen(8000, () => console.log(`Server is running on 8000`));
