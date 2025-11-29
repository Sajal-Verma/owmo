import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

//take url from env
const url = process.env.mongoUrl;


//connect the database to mongodb
const connect = async () => {
    try{
        await mongoose.connect(url);
        console.log("mongo connect perfectly");
    }
    catch{
        console.log("mongo error");
    }
}

export default connect;