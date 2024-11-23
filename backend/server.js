import express  from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import connectCloudinary from "./config/cloudinary.js"
import 'dotenv/config'


//app config
const app= express()
const port = process.env.PORT || 4000;

//middleware
app.use(express.json())
app.use(cors())

//DB Connection
connectDB();
connectCloudinary();

//Api Endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

//Home
app.get("/",(req,res)=>{
      res.send("API Working");
})

app.listen(port,()=>{
    console.log(`Server started on PORT ${port}`);
})