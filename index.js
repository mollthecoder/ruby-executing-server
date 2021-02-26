const app = require("express")();
const path = require("path")
const fs = require("fs");
const {exec} = require("child_process");
app.use((req, res, next)=>{
  // HTTPS redirect changed from https://stackoverflow.com/questions/7450940/automatic-https-connection-redirect-with-node-js-express
  if(req.secure) {
    next();
  }else{
    res.redirect("https://" + req.headers.host + req.url);
  }
});
app.get("/", (req, res)=>{
  res.sendFile(path.join(__dirname, "public/index.html"));
});
app.get("*", (req, res)=>{
  if(fs.existsSync(path.join("public", req.url))){
    if(path.parse(req.url).ext===".rb"){
      exec("ruby "+path.join("public", req.url), (err, stdout, stderr)=>{
        if(stdout&&!stderr)res.send(stdout);
        if(stderr)res.send("ERROR: "+stderr);
        if(!stderr&&err)res.send("JavaScript command exec error: "+err.message);
      });
    }else{
      res.sendFile(path.join(__dirname, "public", req.url));
    }
  }else{
    res.send("404 - Page not found.");
  }
})
app.listen(8080);