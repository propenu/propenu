import  express  from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import propertyRoute from "./routes/propertyRoute";
import  mediaRoutes from "./routes/mediaRoute"

dotenv.config();
const app = express();
app.use(express.json());

const port = process.env.PORT ?? 4003;


async function start() {
    try {
        await connectDB();

        app.get("/", (req, res) => {
           res.json({ message: "User Service is running" });
        });

        app.use('/property', propertyRoute);

        app.use("/api/media", mediaRoutes);

        
        app.listen(port, () => {
            console.log(`property service is running on port ${port}`); 
        });
    } catch (err) {
        console.error('Failed to start server', err);
        process.exit(1);
    }
}

start();

