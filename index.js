import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const token = "";
const app = express();
const port = 3000;
const api = axios.create({ baseURL: "https://api.openuv.io", headers: {"x-access-token": token} });

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) =>{
    res.render("index.ejs");
})

app.post("/submit", async (req, res) =>{
    let content = "";
    const lat = req.body["latitude"];
    const long = req.body["longitude"];
    if(lat > 90 || lat < -90 || long > 180 || long < -180){
      res.render("index.ejs", {content: "<h2>Latitude must be between -90 and 90, and longitude must be between -180 and 180.<h2>"});
    }else{
      try {
        const response = await api.get("/api/v1/uv?lat=" + lat +"&lng=" + long);
        const result = response.data.result
        console.log(result);
        if(result.uv > 3){
          content = "<h2>Its gonna be sunny! Put on some suncreen! The UV is " + Math.floor(result.uv) + "</h2><img src='92431-line-lotion-drawing-yellow-sunscreen-download-hd-png.png' alt='Sunscreen bottle'>"
        } else{
          content = "<h2>Its not too sunny, you're okay not putting on sunscreen. The UV is " + Math.floor(result.uv) + "</h2><img src='fluffly-cloud.png' alt='Fluffy cloud'>";
        }
        res.render("index.ejs", {content: content});
      }catch (error){
        console.error("Failed!", error.message);
        res.render("index.ejs", {content: error.message})
      }
    }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});