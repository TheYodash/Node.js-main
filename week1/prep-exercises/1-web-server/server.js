/**
 * Exercise 3: Create an HTTP web server
 */

const http = require('http');
const fs = require('fs').promises;
const path = require('path');

//create a server
let server = http.createServer(async function (req, res) {
	// YOUR CODE GOES IN HERE
	try{
	  if(req.url === '/'){
		  const data = await fs.readFile(path.join(__dirname,'index.html'));
		  res.writeHead(200, {'Content-Type': 'text/html'});
		  res.end(data);
	  }
	  else if(req.url === '/index.js'){
		  const data = await fs.readFile(path.join(__dirname,'index.js'));
		  res.writeHead(200, {'Content-Type': 'text/javascript'});
		  res.end(data);
	  } else if (req.url === '/style.css') {
		const data = await fs.readFile(path.join(__dirname, 'style.css'));
		res.writeHead(200, { 'Content-Type': 'text/css' });
		res.end(data);
	  } else {
		  throw new Error('Not found');
  
	  }
	}
	catch(err){
	  console.log(err);
	  res.writeHead(404, {'Content-Type': 'text/html'});
	  res.write('<h1>404 Not Found</h1>');
	  res.end();
	}
  });


  server.listen(3000); // The server starts to listen on port 3000
