var morgan = require("morgan");
var mongoose = require("mongoose");
var express = require("express");
var path = require("path");
var Libs = require("./madlibs");
var User = require("./users");
var jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
var config = require("./config"); // get our config file
mongoose.connect(config.database, {
  useMongoClient: true
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
//var stories = require("./server.js");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.set("superSecret", config.secret); // secret variable
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
app.use(express.static("public"));
app.use(bodyParser.json());
var apiRoutes = express.Router();
//EVERYTHING ABOVE THIS LINE IS CONFIGURING. THE FILE EVERTHING BELOW THIS LINE IS ACTUAL CODE
app.get("/setup", function(req, res) {
  // create a sample user
  var nick = new User({
    name: "rau",
    password: "gabe",
    admin: true
  });

  // save the sample user
  nick.save(function(err) {
    if (err) throw err;

    console.log("User saved successfully");
    res.json({ success: true });
  });
});

app.post("/authenticate", function(req, res) {
  // find the user
  User.findOne(
    {
      name: req.body.name
    },
    function(err, user) {
      if (err) throw err;

      if (!user) {
        res.json({
          success: false,
          message: "Authentication failed. User not found."
        });
      } else if (user) {
        // check if password matches
        if (user.password != req.body.password) {
          res.json({
            success: false,
            message: "Authentication failed. Wrong password."
          });
        } else {
          // if user is found and password is right
          // create a token with only our given payload
          // we don't want to pass in the entire user since that has the password
          const payload = {
            admin: user.admin
          };
          var token = jwt.sign(payload, app.get("superSecret"), {
            expiresIn: 1440 * 60 // expires in 24 hours
          });

          // return the information including token as JSON
          res.json({
            success: true,
            message: "Enjoy your token!",
            token: token
          });
        }
      }
    }
  );
});

app.get("/", function(req, res) {
  console.log("A dark horse appears and then he eats you", __dirname);
  res.sendFile(path.join(__dirname, "server.html"));
  res.send("Hello! The API is at http://localhost:" + port + "/api");
});

apiRoutes.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  console.log("RUNNING ,", req);
  var token = req.body.token || req.headers["x-access-token"];
  console.log("token ,", token);
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get("superSecret"), function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: "Failed to authenticate token."
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: "No token provided."
    });
  }
});

apiRoutes.get("/", function(req, res) {
  res.json({ message: "Welcome to the coolest API on earth!" });
});
apiRoutes.get("/users", function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

// route to show a random message (GET http://localhost:8080/api/)

// route to return all users (GET http://localhost:8080/api/users)

// apply the routes to our application with the prefix /api
app.use("/api", apiRoutes);
// THE CODE ABOVE THIS LINE IS PART OF NODE AUTHENTACATION. THE CODE BELOW IS PART OF THE MADLIBS
app.put("/edit", function(req, res) {
  Libs.update({ _id: req.body._id }, { text: req.body.text }, function(
    err,
    result
  ) {
    res.json(result);
  });
});
/*you will need the id and the text that you want to change here is a example
{
	"_id" : "59dd4caf2192c820e7d96cec",
	"text": "project deactivated"
}
*/
app.post("/new", function(req, res) {
  let libs = new Libs({ text: req.body.text });
  libs.save(function(err, result) {
    res.json(result);
  });
});
/* you do not need to know the id for this one but you still need the text here is an example
{
	"text": "project rereactivated"
}
*/

app.delete("/delete", function(req, res) {
  Libs.remove({ _id: req.body._id }, function(err, result) {
    res.json(result);
  });
});
/* same as the 'post' you dop not need a text just a id. here is a example
{
	"_id" : "59dd4caf2192c820e7d96cec"
}
*/
console.log("Magic happens at http://localhost:" + port);
app.listen(port);
