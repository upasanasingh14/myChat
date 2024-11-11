const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

main().then(()=>{
    console.log("connection successful");
})
.catch(err=> console.log(err));

async function main(){
        await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}

let allChats = [
    {   from: "neha",
        to: "priya",
        msg: "send me your exam sheets",
        created_at: new Date()
    },
    {   from: "abc",
        to: "xyz",
        msg: "hello",
        created_at: new Date()
    },
    {   from: "lita",
        to: "passi",
        msg: "bye",
        created_at: new Date()
    },
    {   from: "pita",
        to: "prince",
        msg: "welcome",
        created_at: new Date()
    },
    {   from: "sweety",
        to: "panni",
        msg: "come here",
        created_at: new Date()
    },
    {   from: "sanju",
        to: "sami",
        msg: "see you this weekend!",
        created_at: new Date()
    },
    {   from: "tina",
        to: "lamen",
        msg: "send me c++ notes",
        created_at: new Date()
    },
    {   from: "serena",
        to: "dan",
        msg: "hey, i am in Paris",
        created_at: new Date()
    },
];

Chat.insertMany(allChats);


// chat1.save().then(res=>{
//     console.log(res);
// });

// Chat.findByIdAndDelete('67207e31dd645c6cd1ce35f7').then((res)=>{
//     console.log(res);
// }).catch(err => {
//     console.log(err);
// });