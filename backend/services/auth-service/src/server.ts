import express from 'express';
import dotenv from 'dotenv';

dotenv.config();


const app = express();
const PORT = process.env.PORT ?? 4001;


app.get('/api/auth', (req, res) => {
    res.json({ message: 'Auth Service is running' });
})

app.listen(PORT, () => {
    console.log(`auth service is running on port ${PORT}`);
})