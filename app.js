// require installed node packages
const express = require("express");
const https = require("https");
const { parse } = require("url");
const app = express();

// Created a static folder called public
// so server can use the static image and css files 
app.use(express.static("public"));

//parser activated to grab data from sign up form
app.use(express.urlencoded({ extended: true }));


//Set up the "GET" route for the sign-up page
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html")
});

// Set Up Mailchimp

// mailchimp.setConfig({
//     apiKey: "";
//     server: "";
// });

// Once sign in button is pressed execute this ->
app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [{
                email_address: email,
                status: "subscribed",
                
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }]
        
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/50eb3e746b";

    const options = {
        method: "POST",
        headers: {
            authorization: "oyabun: e986fdad6871c0209995f21cdb774695-us21"
        }
    };

    const request = https.request(url, options, function (response) {
        
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })

    })

    request.write(jsonData);
    request.end();

});


// adding another post request for failed sign up attempt to reroute to sign up form
app.post("/failure", function (req, res) {
    res.redirect("/")
})

//use express to listen on 3000 and log when it's working
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is up and running on port 3000.");
});
