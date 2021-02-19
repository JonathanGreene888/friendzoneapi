const webSocketServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer();
server.listen(webSocketServerPort);
console.log('listening on port 8000');

const webServer = new webSocketServer({
    httpServer: server
});

const clients = {};

const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x100000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
}

webServer.on('request', function (request){
    var userID = getUniqueID();
    console.log("connections recieved")
    
    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    console.log("I am connected to server");
    
    connection.on('message', function(message){
        if(message.type === 'utf8') {
            for(key in clients) {
                clients[key].sendUTF(message.utf8Data);
                console.log("sent message to: ", clients[key]);
            }
        }
    })
})