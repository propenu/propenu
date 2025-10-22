import  express  from "express";


const app = express();

app.get("/", (req, res) => {
res.json({ message: "Property Service is running" });
})

app.listen(4003, () => {
        console.log('property service is running on port 4003');
})