const mongoose = require("mongoose");

const { Schema } = mongoose;

mongoose.connect("mongodb+srv://ashwinkhowala1:wLil4woeOph962yd@cluster0.j6l3z.mongodb.net/iit-kgp-db");

// User schema  
const userSchema = new Schema({
    firstName:{
        type: String,
        required: true
    },
    middleName:{
        type:String,
    },
    lastName:{
        type:String,
        required:true
    },
    email:{ 
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    mobile_no:{
        type:String,
        required:true
    },
    DOB:{
        type:Date,
        required:true
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        default: null
    }
});


// Increment login attempts
userSchema.methods.incrementLoginAttempts = async function () {
    if (this.lockUntil && this.lockUntil > Date.now()) {
        return;
    }

    this.loginAttempts += 1;

    if (this.loginAttempts >= 5) {
        this.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
    }

    await this.save();
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = async function () {
    this.loginAttempts = 0;
    this.lockUntil = null;
    await this.save();
};

// Create models
const User = mongoose.model("User", userSchema);

// Export models
module.exports = {
    User
};
