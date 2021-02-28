const mongoose = require("mongoose");

const systemSchema = new mongoose.Schema({
    status: {
        type: String,
        enum : ["offline","online"],
        default: "offline",
        required: true
    },
    alarmStatus: {
        type: String,
        enum : ["armed","idle"],
        default: "idle",
        required: true
    },
    sensors: [{ type: mongoose.Schema.ObjectId, ref: "Sensor" }],
    events: [{ type: mongoose.Schema.ObjectId, ref: "Event" }],
    last_access_time: Date
});

module.exports = mongoose.model("System", systemSchema);