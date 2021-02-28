const express     = require("express"),
      router      = express.Router(),
      db          = require("../models");

router.get("/", async (req, res) => {
    try {
        let system = await db.System.findById("5fcfa291f1576636d0318b74").populate({path: "sensors", model: "Sensor"}).populate({path: "events", model: "Event"});
        res.json(system._doc);
    }
    catch (err) {
        console.log("[ERROR] An error occured while getting system data")
        console.log(err)
        res.status(500).send("An error occured while getting system data");
    }
});

router.post("/", async (req, res) => {
    try {
        let system = await db.System.findById("5fcfa291f1576636d0318b74");

        let status = "idle";
        if (req.body.alarmStatus === "armed") {
            status = "armed";
        }
        else if (req.body.alarmStatus !== "idle") {
            throw "Invalid alarm status";
        }

        system.alarmStatus = status;
        await system.save();

        res.send("Success");
    }
    catch (err) {
        console.log("[ERROR] An error occured while setting system data")
        console.log(err)
        res.status(500).send("An error occured while setting system data");
    }
});

module.exports = router;