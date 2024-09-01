import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

const app = express();
const port = 3000;

function loadEnv() {
    dotenv.config();
}
loadEnv();
//console.log(process.env)

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
console.log(clientID);
console.log(clientSecret);


app.get("/", async (req,res) => {
    try {
        res.render("index.ejs");
    } catch (error) {
        console.error("Failed to make request:", error.message);
    }
})

app.get("/callback", async (req,res) => {
    let response;

    try {
        //console.log(req.url);
        const data = {
            'client_id' : clientID,
            'client_secret' : clientSecret,
            'redirect_uri' : "http://localhost:3000/callback",
            'code' : req.query.code,
            'grant_type' : "authorization_code"
        }
        
        //console.log(data);
        response = await axios.post("https://oauth2.googleapis.com/token",
            new URLSearchParams(data).toString(), 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        console.log("jwt format : " + response.data.id_token);
        let user_id_token = jwt.decode(response.data.id_token);
        console.log(user_id_token);
        let user_email = user_id_token.email;

            if(response.status === 200){
                //res.status(200);
                res.render("dashboard.ejs",{name:user_email});
                
            }else{
                res.status(500);
            }
    } catch (error) {
        console.error("Failed to make request:", error.message);
    }
    
})

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});