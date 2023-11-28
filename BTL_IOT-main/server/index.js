const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});
var mqtt = require('mqtt');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "172.0.0.1",
  user: 'root',
  password: '17112212',
  database: "iot"
});

var options = {
  host: "broker.emqx.io",
  port: 1883,
  protocol: 'mqtt',
  username: 'tuan',
  password: '123'
};

// initialize the MQTT client
var client = mqtt.connect(options);

// subscribe vào 'topic_0'
client.subscribe('topic_0');

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

  var sql = "CREATE TABLE IF NOT EXISTS Sensors (id int(10) PRIMARY KEY AUTO_INCREMENT, ClusterSensor INT(1) DEFAULT 1,Temperature FLOAT(2),Huminity FLOAT(2),DoAmDat INT(2), createdAT datetime default NOW())";
  con.query(sql, function (err) {
    if (err) throw err;
    console.log("Table Sensors created");
  });
});

// lắng nghe xem có client nào kết nối với server không 
io.on('connection', (socket) => {
  console.log(`${io.engine.clientsCount} users active`); // log ra số lượng client đang kết nối đến server
  socket.on('send-alert', (data) => {
    client.publish('topic_3', data);
  });
});

// lắng nghe những topic mà đã subscribe vào
client.on('message', function (topic, message) {
  console.log(topic, message.toLocaleString()); // log ra màn hình tên topic và giá trị nhận được

  // Kiểm tra các topic và xử lý dữ liệu tương ứng
  if (topic === "home/humidity" && message) {
    const humidity = Math.round(parseFloat(message));
    const created = new Date().toLocaleString();
    var sql = `INSERT INTO Sensors (Huminity) VALUES (${humidity})`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(`1 record inserted`);
    });
    io.emit('send-data', { humidity, created });
  } else if (topic === "home/temperature" && message) {
    const temperature = Math.round(parseFloat(message));
    const created = new Date().toLocaleString();
    var sql = `INSERT INTO Sensors (Temperature) VALUES (${temperature})`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(`1 record inserted`);
    });
    io.emit('send-data', { temperature, created });
  } else if (topic === "home/soil_moisture" && message) {
    const soilMoisture = Math.round(parseFloat(message));
    const created = new Date().toLocaleString();
    var sql = `INSERT INTO Sensors (DoAmDat) VALUES (${soilMoisture})`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(`1 record inserted`);
    });
    io.emit('send-data', { soilMoisture, created });
  }
});

server.listen(3005, () => {
  console.log('listening on *:3005');
});

module.exports = {
  getData: function () {
    return fullData;
  }
};
