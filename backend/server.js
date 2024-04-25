const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const PORT = 8000;

app.get("/", (req, res) => {
    res.send("hello")
})

server.listen(PORT, () => console.log(`Server listen on port ${PORT}`));

const io = require("socket.io")(server, {
	cors: {
		origin: ["http://localhost:5173"],
		methods: ["GET", "POST"],
	},
});

let todos = [];

io.on("connection", (socket) => {
    console.log("user connected: ", socket.id)

    socket.emit("todos", todos);

    socket.on("newTodo", (data) => {
        todos.push(data);
        io.emit("todos", todos); 
        console.log("todo sa be: ", data)
    })

    socket.on("deleteTodo", (id) => {
        todos = todos.filter(todo => todo.id !== id);
        io.emit("todos", todos);
        console.log("deleteTodo: ", id);
    });

    socket.on("updateTodo", (data) => {
        todos = todos.map(todo => 
            todo.id === data.id ? { ...todo, status: data.status } : todo
        );
        io.emit("todos", todos);
        console.log("updateTodo: ", data.id);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected: ", socket.id)
	});
})
