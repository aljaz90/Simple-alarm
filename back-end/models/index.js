let mongoose = require("mongoose"),
    CONFIG   = require("../config/config");      

(async () => {
    try {
        await mongoose.connect(CONFIG.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(`[CONNECTED] Connected to the database at: ${CONFIG.DATABASE_URL}`);
    }
    catch (err) { 
        console.log(`[ERROR] Unable to connect to the database at: ${CONFIG.DATABASE_URL}`);
        console.log(err)  
    }
})();

mongoose.Promise = Promise;
mongoose.set('useCreateIndex', true);

module.exports.System = require("./system");
module.exports.Sensor = require("./sensor");
module.exports.Event = require("./event");
