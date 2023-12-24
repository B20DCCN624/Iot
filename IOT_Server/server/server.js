const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
// Socket Setup
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
var mqtt = require('mqtt');
var mysql = require('mysql');
// MySQL setup
var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '17112212',
  database: 'iot'
});
// MQTT setup
var options = {
  host: "192.168.12.105",
  port: 1883,
  protocol: 'mqtt',
  username: 'tuan',
  password: '123'
};

// initialize the MQTT client
var client = mqtt.connect(options);

// subscribe vào 'sensorData'
client.subscribe('home/sensorData');

// Kiem tra ket noi với MQTT
client.on('connect', function () {
  console.log('Connected MQTT');
});

// log ra lỗi nếu kết nối vs mqtt có lỗi
client.on('error', function (error) {
  console.log(error);
});

// Create TABLE
con.connect(function (err) {
  if (err) throw err;

  var sql = "CREATE TABLE IF NOT EXISTS Sensors (id int(10) PRIMARY KEY AUTO_INCREMENT, Temperature FLOAT(2),Humidity FLOAT(2),SoilMoisture INT(2), createdAT datetime default NOW())";
  con.query(sql, function (err) {
    if (err) throw err;
    console.log("Table Sensors created");
  });
});

let statusRelay = "off"
// lắng nghe xem có client nào kết nối với server không 
io.on('connection', (socket) => {
  console.log(`${io.engine.clientsCount} users active`); // log ra số lượng client đang kết nối đến server
  
  socket.on('send-relay', (data) => {
    console.log('Received relay data from client:', data);

    if (data === '.relay') {
      statusRelay = statusRelay === 'off' ? 'on' : 'off';
    }  
    io.emit('relay-change', { isOn: statusRelay === 'on' }); // Truyền trạng thái từ client này đến tất cả clients khác
    //Gửi thông điệp đến MQTT
    client.publish('status', statusRelay);
    console.log('statusRelay:', statusRelay);

    let statuss;
    if (statusRelay === 'on') {
      statuss = 'ON';
    } else {
      statuss = 'OFF';
    }
    console.log(statuss)
  });
});

// lắng nghe những message từ topic 'sensorData'
client.on('message', function (topic, message) {
  console.log(topic, message.toLocaleString()); // log ra màn hình tên topic và giá trị nhận được

  // Kiểm tra topic là 'sensorData' và có dữ liệu không
  if (topic === "home/sensorData" && message) {
    try {
      const data = JSON.parse(message);
      var humidity = data['humidity']
      var temperature = data['temperature']
      var soil_moisture = data['soil_moisture']

      // Kiểm tra nếu dữ liệu không phải là 'nan'
      if (!isNaN(humidity) && !isNaN(temperature) && !isNaN(soil_moisture)) {
        const created = new Date().toLocaleString();
        // Thực hiện lưu dữ liệu vào database và gửi đi thông qua Socket.IO
        var sql = `INSERT INTO Sensors (Humidity, Temperature, SoilMoisture) VALUES (${humidity}, ${temperature}, ${soil_moisture})`;
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log(`1 record inserted`);
        });
        io.emit('send-data', data);
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }
});

server.listen(3005, () => {
  console.log('listening on *:3005');
});

// API endpoint để lấy dữ liệu từ database
app.get('/api/data', (req, res) => {
  const sql = 'SELECT * FROM Sensors'; 
  con.query(sql, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.json(result);
  });
});

app.get('/api/dataHistory', (req, res) => {
  const sql = 'SELECT * FROM Sensors ORDER BY createdAT DESC'; 
  con.query(sql, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.json(result);
  });
});

const port = 3006; // Sử dụng cổng khác với server Socket.IO
app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});

// Xuất (export) một đối tượng từ module này để có thể sử dụng ở nơi khác 
module.exports = {
  getData: function () {
    return fullData;
  }
};
