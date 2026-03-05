import mongoose from "mongoose";
const connectToDB=async()=>{
    try{
        const{connection}=await mongoose.connect(
           process.env.MONGO_URI || `mongodb+srv://sg297979_db_user:BaVvnxw97uIuUq8w@cluster0.jaq078p.mongodb.net/` 
        )
       if (connection) {
      console.log(`Connected to MongoDB: ${connection.host}`);
    } 
    }
    catch(err){
        console.log(error);
        process.exit(1);
    }
}
export default connectToDB;