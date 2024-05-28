const express = require('express');
const { results: users } = require('./data/agentes.js');
const app = express();
const jwt = require("jsonwebtoken");

app.listen(3000, console.log("Server ON!"));

app.use(express.json());
app.use(express.static("public"));

const secretKey = "Mi Llave Ultra Secreta";

app.get('/token', (req, res) => {
    const { token } = req.query;

    jwt.verify(token, secretKey, (err, data) => {
        res.send( err ? 'Token invalido' : data );
    });
});
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTY0MTAyMDgsImRhdGEiOnsiZW1haWwiOiJ3aG9AZmJpLmNvbSIsInBhc3N3b3JkIjoibWUifSwiaWF0IjoxNzE2NDEwMDg4fQ.4RIn5bxPemDE2SuNz0JPuThtcqPNUstMhLOCtK_8Xno

app.post('/SignIn', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: 2 * 60 });
        res.json({ email: user.email, token });
    } else {
        res.status(401).send('Credenciales Inválidas');
    }
});

app.get('/restricted', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Token inválido');
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send('Token inválido');
        }
        res.send(`Bienvenido, Agente Especial ${decoded.email} Misión Cumplida`);
    });
});
