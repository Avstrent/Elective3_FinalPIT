#include <WiFi.h>
#include <WiFiMulti.h>
#include <PubSubClient.h>

WiFiMulti wifiMulti;
WiFiClient espClient;
PubSubClient mqtt(espClient);

const char* MQTT_BROKER   = "10.141.68.150";
const uint16_t MQTT_PORT  = 1883;
const char* MQTT_TOPIC    = "RFID_LOGIN";
const char* MQTT_CLIENT_ID = "mqttx_841f3abe";

#define RELAY_PIN 27  // GPIO 27 controls the relay (active-LOW)

void ensureWiFi() {
  if (WiFi.status() == WL_CONNECTED) return;
  while (wifiMulti.run() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\nWiFi connected.");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void ensureMQTT() {
  while (!mqtt.connected()) {
    Serial.print("Connecting to MQTT...");
    if (mqtt.connect(MQTT_CLIENT_ID)) {
      mqtt.subscribe(MQTT_TOPIC, 0);
      Serial.println("connected & subscribed to RFID_LOGIN");
    } else {
      Serial.print("failed, rc=");
      Serial.println(mqtt.state());
      delay(1000);
    }
  }
}

// --- When a message arrives on the topic ---
void onMqttMessage(char* topic, byte* payload, unsigned int length) {
  String msg;
  for (unsigned int i = 0; i < length; i++) msg += (char)payload[i];
  msg.trim();

  Serial.print("Received from ");
  Serial.print(topic);
  Serial.print(": ");
  Serial.println(msg);

  if (msg == "1") {
    Serial.println("RFID FOUND → Relay ON");
    digitalWrite(RELAY_PIN, LOW);   // Active-LOW relay → LOW = ON
  } 
  else if (msg == "0") {
    Serial.println("RFID FOUND → Relay OFF");
    digitalWrite(RELAY_PIN, HIGH);  // Active-LOW relay → HIGH = OFF
  } 
  else {
    Serial.println("Unknown message received");
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // Start OFF (active-LOW relay)

  WiFi.mode(WIFI_STA);
  wifiMulti.addAP("jerfox", "123456789");
  wifiMulti.addAP("Cloud Control Network", "ccv7network");
  wifiMulti.addAP("scam ni", "Walakokabalo0123!");
  ensureWiFi();

  mqtt.setServer(MQTT_BROKER, MQTT_PORT);
  mqtt.setCallback(onMqttMessage);
  ensureMQTT();

  Serial.println("ESP32-2 ready. Listening to RFID_LOGIN topic...");
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) ensureWiFi();
  if (!mqtt.connected()) ensureMQTT();
  mqtt.loop();
}
