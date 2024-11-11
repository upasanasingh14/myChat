const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");
const { stat } = require("fs");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main().then(() => {
    console.log("connection successful");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}

//Index route
app.get("/chats", asyncWrap(async (req, res) => {
    let chats = await Chat.find();
    // console.log(chats);
    res.render("index.ejs", { chats });
}));

//new route
app.get("/chats/new", (req, res, next) => {
    res.render("new.ejs");
     next(new ExpressError(404, "Page not found"));
    
});

//create route
app.post("/chats", asyncWrap(async(req, res, next) => {
    let { from, to, msg } = req.body;
    let newChat = new Chat({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date(),
        updated_at: new Date()
    });
    newChat.save()
        .then(res => { 
            console.log("chat was saved");
            res.redirect("/chats");
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
}));

function asyncWrap(fn){
    return function(req, res, next) {
        fn(req, res, next).catch((err) => next(err));
    };
}

//New- show route
app.get("/chats/:id", asyncWrap(async(req,res,next) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    if(!chat) {
        next(new ExpressError(404, "Chat not Found"));
    }
    res.render("edit.ejs", {chat});
}));

//edit route
app.get("/chats/:id/edit", asyncWrap(async (req, res) => {
    let {id} = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", {chat});
}));

//update route
app.put("/chats/:id", asyncWrap(async (req, res) => {
    let {id} = req.params;
    let {msg: newMsg} = req.body;
    
    let updatedChat = await Chat.findByIdAndUpdate(id, {msg: newMsg, 
                                                        updated_at: new Date()},
                                                       {runValidators: true, new: true}
                                                  );
    console.log(updatedChat);
    res.redirect("/chats");
}));

//delete route
app.delete("/chats/:id", asyncWrap(async (req, res)=>{
    let {id} = req.params;

    await Chat.findByIdAndDelete(id);
    res.redirect("/chats");
}));

app.get("/", (req, res) => {
    res.send("root working");
});

const handleValidationErr = (err) => {
    console.log("this was a validation error");
    return err;
}

app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name === "ValidationError"){
        handleValidationErr(err);
    }
    next(err);
});

//Error Handling Middleware
app.use((err,req,res,next)=>{
    let {status = 500, message = "Some Error Occurred"} = err;
    res.status(status).send(message);
});

app.listen("8081", () => {
    console.log("server is listening");
});