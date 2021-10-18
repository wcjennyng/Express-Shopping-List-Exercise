//in terminal, $nodemon server.js, to run

const app = require('./app')

app.listen(3000, function(){
    console.log("Server starting on port 3000")
  })