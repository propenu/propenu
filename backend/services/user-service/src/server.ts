import express from 'express';


const app = express();


app.get("/", (req, res) => {
        res.json({ message: "User Service is running" });
});

app.listen(4004, () => {
          console.log('user service is running on port 4004');

})