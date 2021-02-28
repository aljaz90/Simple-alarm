const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
    type: {
        type: String,
        enum : ["movement", "magnetic", "camera", "sound"],
        default: "movement"
    }, 
    status: {
        type: String,
        enum : ["disabled", "enabled"],
        default: "disabled"
    },
    last_access_time: Date
});

module.exports = mongoose.model("Sensor", sensorSchema);