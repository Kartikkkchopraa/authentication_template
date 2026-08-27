import pg from "pg";
import config from "./config.js";

const {Pool} = pg;

const pool = new Pool({
    connectionString: config.DATABASE_URL
});


async function connectDB(){
    try{
        await pool.query("SELECT 1");
        console.log("connected to Database");
    } catch(error){
        console.log("database connection fail ", error);

    }
}

export {pool} ;
export default connectDB;