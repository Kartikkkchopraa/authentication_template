import app from "./src/app.js";
import config from "./src/config/config.js"
import connectDB from "./src/config/database.js"

connectDB();

app.listen(config.PORT,()=>{
    console.log(`server is running on http://localhost:${config.PORT}`);
})