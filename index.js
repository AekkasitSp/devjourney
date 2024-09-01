import express, { response } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";

const app = express();
const port = 3000;

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
            'client_id' : "785063509436-g8mndonltkiu96389khhslvskfljrsm5.apps.googleusercontent.com",
            'client_secret' : "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",
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
                res.render("mailbox.ejs",{name:user_email});
                
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