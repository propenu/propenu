import express from 'express';


const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Payment Service is running" });
});

app.listen(4002, () => {
  console.log('Payment service is running on port 4002');
});