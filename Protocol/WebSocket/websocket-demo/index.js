const http = require("http");
const WebSocketServer = require("websocket").server
let connection;

//create a raw http server (this will help us create the TCP which will then pass to the websocket to do the job)
const httpServer = http.createServer((req, res) => {
  console.log("Received request from client.");
});

//pass the httpserver object to the WebSocketServer library to do all the job, this class will override the req/res 
const websocket = new WebSocketServer({
  httpServer: httpServer,
});

//when a legit websocket request comes listen to it and get the connection .. once you get a connection thats it! 
websocket.on("request", (request) => {
  connection = request.accept(null, request.origin);
  connection.on("open", () => console.log("OPENED!!"));
  connection.on("close", () => console.log("CLOSED!!"));
  connection.on("message", (message) => console.log(message.utf8Data));

  //use connection.send to send stuff to the client 
  sendMsgEveryInterval();
});

httpServer.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

function sendMsgEveryInterval(){
  connection.send(`Message to you: ${Math.random()}`)

  setTimeout(sendMsgEveryInterval,5000);
}



//client code 
//let ws = new WebSocket("ws://localhost:8080");
//ws.onmessage = message => console.log(`Received: ${message.data}`);
//ws.send("Hello! I'm client")
