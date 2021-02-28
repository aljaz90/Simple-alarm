const express     = require("express"),
      router      = express.Router(),
      db          = require("../models");

router.post("/:id", async (req, res) => {
try {
    let sensor = await db.Sensor.findById(req.params.id);

    if (!sensor) {
        throw `Document not found: Sensor {_id: ${req.params.id}}`;
    }

    let status = "disabled";
    if (req.body.status === "enabled") {
        status = "enabled";
    }
    else if (req.body.status !== "disabled") {
        throw "Invalid sensor status";
    }

    sensor.status = status;
    await sensor.save();

    res.send("Success");
}
catch (err) {
    console.log("[ERROR] An error occured while setting sensor data")
    console.log(err)
    res.status(500).send("An error occured while setting sensor data");
}
});

module.exports = router;