const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    systemStatus: {
        type: String,
        enum : ["armed", "idle"],
        required: true
    },
    sensor: {  
        type: mongoose.Schema.ObjectId, 
        ref: "Sensor",
        required: true
    },
    date: {
        type: Date,
        default: new Date(),
        required: true
    }
});

module.exports = mongoose.model("Event", eventSchema);