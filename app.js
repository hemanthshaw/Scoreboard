const express = require('express')
const app = express();
const request= require('request');
const path=require('path');


app.use(express.static(path.join(__dirname,'public')))
app.set('view engine','ejs');
app.get('/', (req, res) => {
  res.render('Main')
});

app.get('/results',(req,res)=>{
    request('https://cricapi.com/api/matches?apikey=zibgTLCv4UcbU8Da7vHDVkWRwbm2',function(err,response,body){
        if(err)
        throw err;
        if(response.statusCode==200 && body){
            var data= JSON.parse(body)["matches"];
            res.render("score",{data : data});
          }
    });
});



app.get('/results/:id',(req,res)=>{
   request('https://cricapi.com/api/cricketScore?apikey=zibgTLCv4UcbU8Da7vHDVkWRwbm2&unique_id='+req.params.id,(err,response,body)=>{
     if(err)
     throw err;  
     if(response.statusCode==200 && body){
      var data=JSON.parse(body);
      var databody= {data : data , id: req.params.id}; 
      console.log(databody);
      res.render('stats',{databody:databody});
     }
   });
});

app.get('/results/:id/squad',(req,res)=>{
    request('https://cricapi.com/api/fantasySquad?apikey=zibgTLCv4UcbU8Da7vHDVkWRwbm2&unique_id='+req.params.id,(err,response,body)=>{
     if(err)
     throw err;
     if(response.statusCode==200 && body){
      var data=JSON.parse(body)["squad"];
      res.render('squad',{data: data,id:req.params.id});
     }
   });
});

app.get('/results/:id/board',(req,res)=>{
    request('https://cricapi.com/api/fantasySummary?apikey=zibgTLCv4UcbU8Da7vHDVkWRwbm2&unique_id='+req.params.id,(err,response,body)=>{
     if(err)
     throw err;
     if(response.statusCode==200 && body){
      var data=JSON.parse(body);
      var field=data["data"]["fielding"][0];
      var bowl=data["data"]["bowling"];
      var bat=data["data"]["batting"];
      if(data["data"]["bowling"][1])
      var bowl2=data["data"]["bowling"][1].scores;
      if(data["data"]["batting"][1])
      var bat2=data["data"]["batting"][1].scores;
      var score={
          field : field["scores"], 
          bowl :  bowl[0].scores,
          bat : bat[0].scores,
          field2 : data["data"]["fielding"][1], 
          bowl2 :  bowl2,
          bat2 : bat2,
      };
      res.render('board',{score : score});
     }
   });
});

app.get('/calender',(req,res)=>{
   request('https://cricapi.com/api/matchCalendar?apikey=zibgTLCv4UcbU8Da7vHDVkWRwbm2',(err,response,body)=>
   {
     if(err)
     throw err;
     
     if(response.statusCode==200 && body)
     {
       var data=JSON.parse(body);
       res.render('calender',{data:data["data"]});
     }
   });
});

app.get('/results/:id/squad/:pid',(req,res)=>{
  request('https://cricapi.com/api/playerStats?apikey=zibgTLCv4UcbU8Da7vHDVkWRwbm2&pid='+req.params.pid,(err,response,body)=>{
   if(err)
   throw err;
   if(response.statusCode==200 && body){
     var data=JSON.parse(body);
     console.log(data);
     res.render('player',{data : data});
   }
 });
});

app.get('/test',(req,res)=>{
  res.render('test');
})
app.listen(3000 || process.env.PORT, () => {
  console.log('Example app listening');
});