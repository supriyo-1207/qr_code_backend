const dotenv=require('dotenv');
dotenv.config();

module.exports={
    PORT:process.env.PORT,
    MONGO_URI:process.env.MONGO_URI,
    jwt_Secret:process.env.JWT_SECRET,
    GMAIL_PASSWORD:process.env.GMAIL_PASSWORD,
    GMAIL_USER:process.env.GMAIL_USER
   
}