import  express  from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 4003;


app.get("/", (req, res) => {
res.json({ message: "Property Service is running" });
})

app.listen(PORT, () => {
        console.log('property service is running on port 4003');
})