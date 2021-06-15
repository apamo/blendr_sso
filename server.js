const express = require('express');
const port = 1234;
const request = require("request");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const https = require('follow-redirects').https;
// const base64url = require('base64url');
var https_exp = require('https');
var CryptoJS = require("crypto-js");

function base64url(source) {
  // Encode in classical base64
  encodedSource = CryptoJS.enc.Base64.stringify(source);

  // Remove padding equal characters
  encodedSource = encodedSource.replace(/=+$/, '');

  // Replace characters according to base64url specifications
  encodedSource = encodedSource.replace(/\+/g, '-');
  encodedSource = encodedSource.replace(/\//g, '_');

  return encodedSource;
}


//**********************************************************/
//    CONFIG SECTION                                        /
//**********************************************************/

const app = express();
console.log(__dirname);
app.use(express.static(__dirname));


//===================================================================
//
//      SERVER ROUTES
//
//==================================================================

app.get("/", (request, response) =>
{
    let foo = fs.readFileSync("./template_master/production/login.html",  "utf8");
    response.write(foo);
    response.end(); 
});


app.get("/login", (request, response) =>
{
    let foo = fs.readFileSync("./template_master/production/login.html", "utf8");
    response.write(foo);
    response.end();
});



app.get("/sso", (request, response) =>
{

    //Customerspecific inputs
    var secret = ""; //only for demo-purposes. The secret should not be used client-side!!!
    var customername = "";
    //var templateguid = "080a1370-54c6-11eb-9f4c-87ebd4534276";
    //var widgetguid = "d70773c0-3f84-11eb-8a1f-098f644623a9";

    //Header with hashing algo
	  var header = {
    "alg": "HS256",
    "typ": "JWT"
    };
    
    //
    var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    var encodedHeader = base64url(stringifiedHeader);
  
    //Build up of the data
    var data = 
    {
      "exp": Math.floor(Date.now() / 1000)+3000,
      "iat": Math.floor(Date.now() / 1000),
      "account": 
      {
        "external_id":"blendr_support_test", 
        "name": "blendr_support_test"
      }
    };

    // const payload = 
    // {
    //   "iat": 1623246237, // required (issued at)
    //   "exp": 1640958227, // required (expires at)
    //   "nbf": 1623246237, // optional (not valid before)
    //   "account": {
    //     "external_id": "123", // required
    //     "name": "Qlik" //optional
    //   },
    //   "user": { //optional
    //     "external_id": "123",
    //     "name": "Alvaro Palacios",
    //     "email": "alp@qlik.com",
    //     "locale": "en-GB" //supported values: en-GB, it-IT, nl-NL, fr-FR, fr-BE, nl-BE
    //   },
    //   "datasource": { //optional, credentials for this account to SaaS partner API
    //     "datasource-param-1": "value-1", //e.g. "api_key": "xxx"
    //     "datasource-param-2": "value-2"
    //   },
    //   "inputs": { //optional
    //     "phonebook_id": "123", //top inputs for setup/settings flow of Blends
    //     "template_prevent_duplicates": true, //optional, only for /sso/templates/{guid}/install link
    //   },
    //   "embed": {
    //     "mode": "redirect|event", //choose between a redirect or listening to events in the parent
    //     "target": "parent|current", //only for mode=redirect, where to redirect
    //     "redirect_url": "https://some-url.com/callback" //only for mode=redirect
    //   }
    // };
  
    var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    var encodedData = base64url(stringifiedData);
  
    //the token will consist of both the header and the data
    var token = encodedHeader + "." + encodedData;
  
    //use the token secret to sign the token. 
    var signature = CryptoJS.HmacSHA256(token, secret);
    
    //base64-urlencode the signed token
    signature = base64url(signature);
  
    var signedToken = token + "." + signature;

    response.redirect('https://' + customername + '.admin.blendr.io/sso/templates?jwt=' + signedToken);
    // response.redirect('https://' + customername + '.admin.blendr.io/sso/?jwt=' + signedToken);
    // let foo = fs.readFileSync("./template_master/production/index.html", "utf8");
    // response.write(foo);
    response.end();
});


//======================================================================================
//
//      SERVER CREATION
//
//======================================================================================

https_exp.createServer({
    key: fs.readFileSync('./server_certs/server.key'),
    cert: fs.readFileSync('./server_certs/server.cert')
  }, app)
  .listen(port, '127.0.0.1', function () {
    console.log('Https Server listening on port 1234! Go to https://127.0.0.1:1234/')
  })