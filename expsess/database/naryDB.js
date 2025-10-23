import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: String,
  public_id: String,
});


export default imageSchema;