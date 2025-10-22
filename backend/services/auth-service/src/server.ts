import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.json({ message: 'Auth Service is running' });
})

app.listen(4001, () => {
    console.log('auth service is running on port 4001');
})