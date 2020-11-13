const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
app.use(express.static(path.join(__dirname, '/build')));

let tasks = [];

const server = app.listen(process.env.PORT || 8000);

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New Client!');
  socket.emit('updateData', (tasks));
  socket.on('addTask', ({id, taskName}) => {
    console.log('New task added!');
    const task = {id: id, task:taskName};
    tasks.push(task);
    socket.broadcast.emit('addTask',task);
  });
  socket.on('removeTask', (task) => {
    console.log('Task removed!');
    const indexOfRemovingElement = tasks.indexOf(task);
    tasks.splice(indexOfRemovingElement, 1);
    socket.broadcast.emit('removeTask',task);
  });
});