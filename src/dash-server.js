//import some modules
var fs = require('fs');
var url = require('url');
var path = require('path');
var http = require('http');
var cors = require('cors')

var workDir = path.resolve('.');

//create http server
var server = http.createServer(function (request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Request-Method', '*');
	response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
	response.setHeader('Access-Control-Allow-Headers', '*');

  const headers = {
    'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000, // 30 days
    /** add other headers as per requirement */
  };

    //acquire pathname && filetype(.mpd/.mp4/.m4s)
    var pathname = url.parse(request.url).pathname;
    var filetype = pathname.substr(1).split('.')[1];
    console.log(pathname);
    console.log(filetype);

    fs.readFile(__dirname + '/videos/' + pathname.substr(1), function (err, data) {
        if (err) {
            console.log(err);
            response.writeHead(404, { 'Content-Type': 'text/html' });
        }
        else {
            //send mpd file
            if (filetype == "mpd") {
                response.writeHead(200, { 'Content-Type': 'application/dash+xml', 'Connection': 'keep-alive'});
                response.write(data);
            }
            //send m4s or mp4 file
            else if (filetype == "m4s" || filetype == "mp4") {
                fs.stat(__dirname + '/videos/' + pathname.substr(1), function (err, stat) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if (stat.isFile()) {
                            contentLen = stat.size;
                            console.log(String(contentLen));
                            const head = { 
                              'Content-Type': 'video/mp4', 
                              'Connection': 'keep-alive', 
                              'Content-Length': contentLen
                             }
                            response.writeHead(200, { 
                              'Content-Type': 'video/mp4', 
                              'Connection': 'keep-alive', 
                              'Content-Length': contentLen
                           });
                          }
                    }
                });
                response.write(data);
            }
            else {
                console.log(request.url);
            }
        }
        //end reponse
        response.end();
    });
});

server.listen(8080);
console.log('server running at http://localhost:8080/');