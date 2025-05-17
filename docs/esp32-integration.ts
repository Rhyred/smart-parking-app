/**
 * ESP32 Integration Guide
 *
 * file ini menyediakan panduan tentang cara mengintegrasikan mikrokontroler ESP32
 * with the Smart Parking App.
 */

/**
 * ESP32 Arduino Code Example
 *
 * ini adalah contoh sederhana tentang cara menghubungkan ESP32 
 * dengan sensor sentuh kapasitif TTP226 untuk mendeteksi penggunaan slot parkir dan mengirim pembaruan ke server.
 *
 * Hardware Requirements:
 * - ESP32 development board
 * - TTP226 capacitive touch sensor
 * - Power supply (battery or wired)
 *
 * Libraries Required:
 * - WiFi.h
 * - HTTPClient.h
 * - ArduinoJson.h
 */

/*
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Server API endpoint
const char* serverUrl = "https://smart-parking-app.vercel.app/api/sensors/update";

// Sensor configuration
const char* sensorId = "sensor1";
const char* slotId = "slot1";
const int sensorPin = 4; // Digital pin connected to TTP226 output
const unsigned long updateInterval = 10000; // Update every 10 seconds

// Variables
unsigned long lastUpdateTime = 0;
bool lastOccupancyState = false;
int batteryLevel = 100; // Mock battery level (0-100)

void setup() {
  Serial.begin(115200);
  pinMode(sensorPin, INPUT);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Read sensor state
  bool isOccupied = digitalRead(sensorPin) == HIGH;
  
  // Check if it's time to update or if occupancy state has changed
  if (millis() - lastUpdateTime >= updateInterval || isOccupied != lastOccupancyState) {
    updateServerStatus(isOccupied);
    lastOccupancyState = isOccupied;
    lastUpdateTime = millis();
  }
  
  delay(1000); // Check every second
}

void updateServerStatus(bool isOccupied) {
  // Check WiFi connection
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    // Configure HTTP request
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON payload
    StaticJsonDocument<200> doc;
    doc["sensorId"] = sensorId;
    doc["slotId"] = slotId;
    doc["status"] = "online";
    doc["isOccupied"] = isOccupied;
    doc["batteryLevel"] = batteryLevel;
    
    String requestBody;
    serializeJson(doc, requestBody);
    
    // Send POST request
    int httpResponseCode = http.POST(requestBody);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println("Response: " + response);
    } else {
      Serial.println("Error on HTTP request");
      Serial.println("HTTP Response code: " + String(httpResponseCode));
    }
    
    http.end();
  } else {
    Serial.println("WiFi disconnected");
    // Attempt to reconnect
    WiFi.reconnect();
  }
  
  // Decrease battery level for simulation
  if (batteryLevel > 0) {
    batteryLevel -= 1;
  }
}
*/

/**
 * Notes:
 *
 * 1. The ESP32 device continuously monitors the TTP226 capacitive touch sensor.
 * 2. When a car is detected or at regular intervals, it sends an update to the server.
 * 3. The server updates the database, which is reflected in real-time on the app.
 *
 * For low power applications, consider:
 * - Using ESP32 deep sleep mode between readings
 * - Setting appropriate wake-up intervals
 * - Using a battery level monitoring circuit
 */

/**
 * API Endpoints for ESP32:
 *
 * 1. Update Sensor Status:
 *    POST /api/sensors/update
 *    Body: {
 *      "sensorId": "sensor1",
 *      "slotId": "slot1",
 *      "status": "online",
 *      "isOccupied": true,
 *      "batteryLevel": 85
 *    }
 *
 * 2. Get Sensor Status:
 *    GET /api/sensors/status?id=sensor1
 *
 * 3. Get Parking Slot Status:
 *    GET /api/parking/status?id=slot1
 */
