const  express         = require("express"),
       app             = express(),
       systemRoutes    = require("./routes/systems"),
       sensorRoutes    = require("./routes/sensors"),
       bodyParser      = require("body-parser"),
       CONFIG          = require("./config/config"),
       cors            = require("cors"),
       SerialPort      = require("serialport"),
       path            = require("path"),
       db              = require("./models");

const corsOptions = {
    credentials: CONFIG.CORS.CREDENTIALS,
    allowedHeaders: CONFIG.CORS.ALLOWED_HEADERS,
    methods: CONFIG.CORS.METHODS,
    origin: CONFIG.CORS.ORIGIN_URLS
};

app.use(cors(corsOptions));
    
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json('application/json'));

app.use(express.static(path.join(__dirname, 'build')));

app.use("/api/system", systemRoutes);
app.use("/api/sensor", sensorRoutes);

app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

try {
    const Readline = SerialPort.parsers.Readline;
    const port = new SerialPort("COM5");
    const parser = new Readline();
    port.pipe(parser);
    
    port.on("open", () => {
        console.log('[OPEN] Serial port open');
    
        parser.on('data', async data => {
            let sensors = data.split(";");
            for (let sensorData of sensors) {
                let temp = sensorData.replace("\r", "").split(":");

                let id = temp[0];
                let value = temp[1];

                let system;
                let sensor;
                try {
                    system = await db.System.findById("5fcfa291f1576636d0318b74");
                    sensor = await db.Sensor.findById(id);
                }
                catch (err) {
                    console.log("[ERROR] An error occured while getting last events");
                    console.log(err)
                    continue;
                }

                if (value === "1" && sensor.status === "enabled") {
                    try {
                        let lastEvents = await db.Event.find({sensor: id});
                        lastEvents = lastEvents.sort((a, b) => b.date - a.date);
                        
                        if (lastEvents.length < 1 || new Date().getTime() - lastEvents[0].date.getTime() > 10000) {
                            let event = new db.Event({systemStatus: system.alarmStatus, sensor: sensor._id, date: new Date()});
                            await event.save();
                            sensor.last_access_time = new Date();
                            await sensor.save();
                            system.events.push(event);
                            await system.save();
                        }
                    }
                    catch (err) {
                        console.log("[ERROR] An error occured while getting last events");
                        console.log(err)
                    }
                }
            }
        });
    });
}
catch (err) {
    console.log("[ERROR] An error occured while trying to open a serial port");
    console.log(err);
}


app.listen(CONFIG.PORT, () => {
    console.log("[RUN] Running on port " + CONFIG.PORT);
});