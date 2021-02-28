const char sensorIDs[4][25] = {"5fcfa291f1576636d0318b70", "5fcfa291f1576636d0318b71", "5fcfa291f1576636d0318b72", "5fcfa291f1576636d0318b73"};
const byte sensorPins[] = {11, 10, 9 , 8};
bool sensorStatus[] = {false, false, false, false};
unsigned long lastReportTime = 0;

void setup() {
  Serial.begin(9600);

  for (byte pin : sensorPins) {
      pinMode(pin, INPUT_PULLUP);
  }
}

void sendReport() {
  if (millis() - lastReportTime < 1000) {
    return;
  }

  String dataToSend = "";
  for (int i = 0; i < 4; i++) {
    dataToSend += sensorIDs[i];
    dataToSend += ":";
    dataToSend += sensorStatus[i];
    sensorStatus[i] = false;
    if (i < 3) {
      dataToSend += ";";
    }
  }
  Serial.println(dataToSend);

  lastReportTime = millis();
}

void loop() {
  for (int i = 0; i < 4; i++) {
    if (digitalRead(sensorPins[i]) == 0) {
      sensorStatus[i] = true;
    } 
  }
  sendReport();
}
