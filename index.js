var express = require('express');
var socket = require('socket.io');

var port = process.env.PORT;
// App setup
var app = express();
var server = app.listen(port, function(){
    console.log('listening for requests on port'+server.address().port);
});

// Static files (Middleware method : app.use)
app.use(express.static('public'));

// Socket setup & pass server
var io = socket(server);

app.use(express.json());

const users = {};
io.on('connection', (socket) => { 

    
    console.log('made socket connection ', socket.id);
    // Handle new user event
    socket.on('new-user', (data) => {
        users[socket.id]= data;
        console.log(data.name+" joined chat");
        socket.broadcast.emit('new-user', data);
        io.sockets.emit('online-users', users);
    });

    // Handle left user event
    socket.on('disconnect', () => {
        //console.log(Object.keys(users).length)
        //if(true){
        //console.log(users[socket.id].name+" left chat");
        socket.broadcast.emit('user-disconnected',users[socket.id]);
        delete users[socket.id];
        io.sockets.emit('online-users', users);
        //}
    });

    // Handle chat event
    socket.on('chat', (data) => {
        
        io.sockets.emit('chat', data);
    });

    // Handle typing event
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });

});
