let express = require("express");
let mongodb = require("mongodb");
let sanitizeHTML = require('sanitize-html');

//we're calling the express package function
let app = express();
let db; 
//evil js script
//<a href="#" onclick='(()=>{alert("Evil JS here")})()'>Click this</a>
let port = process.env.PORT;
if(port == null || port == ""){
    port = 3000;
}
app.use(express.static("public"));

let connectionString = "mongodb+srv://todoAppUse101:P@55xyz)@cluster0-seuxi.mongodb.net/TodoApp?retryWrites=true&w=majority";
mongodb.connect(connectionString,{useNewUrlParser: true}, (err, client)=>{
    // This anonymous function auto runs and mutates the variable "db", upon connection
    db = client.db();//select db
    app.listen(port);// only upon connection should you listen to this port
    console.log(`Listening on port ${port}`);
});

app.use(express.json());//Asynchronous request
app.use(express.urlencoded({extended: false}));

function passwordProtected(req, res, next ){
//lets set options                                    
res.set('WWW-Authenticate', 'Basic realm = "Simple Todo App"')
// console.log(req.headers.authorization)
if(req.headers.authorization == "Basic bmV4dHdlYmI6bmV4dHdlYmJAbWU="){
  next()
} else{
  res.status(401).send("Authentication required");
}
}

app.use(passwordProtected)
//this tells express to add the function as our first arguement in all our routes

app.get("/", passwordProtected, (req, res)=>{
  db.collection("items").find().toArray((err, items)=>{

    res.send(
      `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Simple To-Do App</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
      </head>
      <body>
        <div class="container">
          <h1 class="display-4 text-center py-1">To-Do App</h1>
          
          <div class="jumbotron p-3 shadow-sm">
            <form id="create-form" action="/create-item" method="POST" >
              <div class="d-flex align-items-center">
                <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                <button class="btn btn-primary">Add New Item</button>
              </div>
            </form>
          </div>
          
          <ul id="item-list" class="list-group pb-5">
           
          </ul>
          
        </div>
        <script>
           let items = ${JSON.stringify(items)};
           // JSON.stringify() is like json encode in php
           // JSON.parse() is like json decode in php, but this time it converts the json data to an object
           //JSON.stringify makes the data ready to be sent over a webserver in json/string format
        </script>
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
        <script src="/browser.js"> </script>
      </body>
      </html>`
    );

  });

});

app.post("/create-item", (req, res)=>{
  let safeText = sanitizeHTML(req.body.text, {allowedTags:[], allowedAttributes: {}});
  // remember we said a db can have several collections. so select a connection and insert that js Object.
  db.collection("items").insertOne({text:safeText}, (err, info)=>{
    res.json(info.ops[0]);
    // console.log(res.getHeaders());
    //we're sending an object over the webserver res.json() converts the data to string(json format)
    //res.json() actually has some functionality that is related to JSON objects that we can't access when using res.send() even though Express correctly sets the 'Content-Type' to 'application/json'
    // Namely, it can format the returned JSON data by applying two options: json replacer,json spaces
    //best practice return JSON data using the res.json() method
  //  console.log( res.json(info.ops[0].data));
   //info.ops[0] this represents the document that just got created
   //inside obj info
   //array with name ops
  //first index of the array contains the id,text
  })
  
})
//api-post data response
app.post("/update-item", (req, res)=>{
  let safeText = sanitizeHTML(req.body.text, {allowedTags:[], allowedAttributes: {}});
 db.collection("items").findOneAndUpdate({_id:new mongodb.ObjectID(req.body.id)}, {$set: {text: safeText}} , ()=>{
  res.send("Success");
 })
});

app.post("/delete-item", function(req, res) {
  db.collection("items").deleteOne( {_id:new mongodb.ObjectID(req.body.id)} ,function(){
    res.send("Success");
  });

})