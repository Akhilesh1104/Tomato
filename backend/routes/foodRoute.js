import express from "express"
import  {addFood,removeFood,listFood} from "../controllers/foodController.js"
import upload from '../middleware/multer.js';

const foodRouter = express.Router();

foodRouter.get("/list",listFood)
foodRouter.post("/add",upload.single("image"),addFood)
foodRouter.post("/remove",removeFood)

export default foodRouter;