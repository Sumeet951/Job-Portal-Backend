import connectToDB from "./configs/dbConn.js";
import app from "./app.js"
const PORT=process.env.PORT || 4000;
import {v2} from "cloudinary";
v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.listen(PORT,async ()=>{
    await connectToDB();
    console.log(`Server is working on  http://localhost:${PORT}/`);
})
