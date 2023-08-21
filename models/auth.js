let mongoose = require('mongoose');

mongoose.connect('mongodb+srv://sparrow:2056King*@cluster0.rxzfnrt.mongodb.net/sparrow?retryWrites=true&w=majority');
let  User  = mongoose.Schema({
    name: String,
    password:String,
    email :String,
    number:String,
    Date:{
        type:Date,
        default:Date.now
    }

    
});

let Users = mongoose.model("user" , User);

module.exports=Users;