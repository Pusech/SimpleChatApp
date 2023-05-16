const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
const url =
  "mongodb+srv://pusech:1uehGyWVmCIO8nvF@messageapp.q7fraig.mongodb.net/Chat?retryWrites=true&w=majority";
// app.use(express.static("public"));
mongoose.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, res) {
    try {
      console.log("Connected to Database");
    } catch (err) {
      throw err;
    }
  }
);

// mongoose
//   .connect(
//     "mongodb+srv://pusech:1uehGyWVmCIO8nvF@messageapp.q7fraig.mongodb.net/Chat?retryWrites=true&w=majority"
//   )
//   .catch((err) => "Ошибка подключения к монгоДБ");

const messageSchema = {
  content: String,
};

const Message = mongoose.model("Message", messageSchema);

// const newMessage = new Message({
//     content: req.body.content,
//   });
//   newMessage
//     .save()
//     .then(res.send("Success"))
//     .catch((err) => res.send(err));

app.get("/", (req, res) => {
  Message.find({})
    .then((foundMessages) =>
      res.render("index", { listMessages: foundMessages })
    )
    .catch((err) => "ошибка при поиске" + err);
});

io.on("connection", (socket) => {
  console.log("User connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
    const newMessage = new Message({
      content: msg,
    });
    newMessage.save();
  });
});

// Message.find({}).then((msg) => console.log(msg));

server.listen(port, function () {
  console.log("Server started on render");
});
