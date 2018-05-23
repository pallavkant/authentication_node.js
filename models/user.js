var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserChema = new mongoose.Schema({
    username: String,
    password: String
});

UserChema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserChema);