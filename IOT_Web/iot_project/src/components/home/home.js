import './styleHome.css'
import Graph from '../Graph/Graph';
import { getTime, formatTime, turnOn, turnOff, openDashBoard, setRangeColorTemperature, setRangeColorHumidity, setRangeColorLight } from '../../funtion/funtion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSocket, disconnectSocket } from '../../socket/SocketManager';
import { da } from 'date-fns/locale';

var temp = 0;
var hummi = 0;
var soid = 0;
function Home() {
    const [setupPage, setSetupPage] = useState(false);
    const [currentTime, setCurrentTime] = useState("");
    const [SensorData, setSensorData] = useState({});
    const [labels, setLabels] = useState([])
    const [optionData, setOptionData] = useState(
        [
            {
                "data": [],
                "borderColor": "#3498db",
                "backgroundColor": 'rgba(255, 0, 0, 0.1)',
                "label": "Độ ẩm",
                "isOn": false,
                "tension": 0.5,
            },
            {
                "data": [],
                "borderColor": "#e74c3c",
                "backgroundColor": 'rgba(255, 0, 0, 0.1)',
                "label": "Nhiệt độ",
                "isOn": false,
                "tension": 0.5,
            },
            {
                "data": [],
                "borderColor": "#e67e22",
                "backgroundColor": 'rgba(255, 0, 0, 0.1)',
                "label": "Độ ẩm đất",
                "isOn": false,
                "tension": 0.5,
            }

        ]
    )
    //'/topic/mqtt-data'
    const subsscribeTopic = (topic) => {
        getSocket().subscribe(topic, message => {
            let respone = JSON.parse(message.body);
            console.log('Received message:', respone);
            if (topic === "sensor/data") {
                setSensorData(respone);
                updateData(respone);
            }
            else if (topic === "/topic/light-control") {
                setsoilMoistureMqtt(respone['light'] === 1 ? 0 : respone['light'], respone['status']);
                console.log('set light')
            }
        });
    }
    //socket
    useEffect(() => {
        const socket = getSocket()
        socket.on('send-data', (data) => {
            console.log(data)
            // let respone = JSON.parse(data)
            setSensorData(data);
            updateData(data);
        });
        return () => {
            disconnectSocket()
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        console.log('get all data')
        fetch('http://localhost:3006/api/data')
            .then(response => response.json())
            .then(data => {
                // console.log(data)
                let x = [];
                let lst1 = [], lst2 = [], lst3 = [];
                for (let i = 0; i < data.length; i++) {
                    x.push(formatTime(data[i].time));
                    lst1.push(data[i].Humidity);
                    lst2.push(data[i].Temperature);
                    lst3.push(data[i].SoilMoisture);
                }
                console.log(lst1, lst2, lst3)
                x = x.slice(-10);
                lst1 = lst1.slice(-10);
                lst2 = lst2.slice(-10);
                lst3 = lst3.slice(-10);
                setLabels(x);
                setOptionData(prevOptionData => {
                    const newOptionData = [...prevOptionData];
                    newOptionData[0].data = lst1;
                    newOptionData[1].data = lst2;
                    newOptionData[2].data = lst3;
                    // console.log(newOptionData)
                    return newOptionData;
                });
            })
            .catch(err => console.log(err))

        //set up status sensor
        // fetch("http://localhost:8080/getSensor")
        //     .then(response => response.json())
        //     .then(data => {
        //         for (let sensor of data) {
        //             if (sensor['id'] === 1) {
        //                 setStatusSenser(0, sensor['isOn']);
        //             } else {
        //                 setStatusSenser(sensor['id'], sensor['isOn']);
        //             }
        //         }
        //     })
        //     .catch(err => console.log(err))
        // setSetupPage(true);
        // console.log('set up page done!')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(getTime);
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const updateData = (respone) => {
        setLabels(pre => {
            const temp = [...pre];
            temp.push(formatTime())

            return temp.slice(-10);
        }
        )
        setOptionData(prevOptionData => {
            const newOptionData = [...prevOptionData];
            newOptionData[0].data.push(respone.humidity);
            newOptionData[1].data.push(respone.temperature);
            newOptionData[2].data.push(respone.soil_moisture);
            newOptionData[0].data = newOptionData[0].data.slice(-10);
            newOptionData[1].data = newOptionData[1].data.slice(-10);
            newOptionData[2].data = newOptionData[2].data.slice(-10);

            temp = respone.temperature;
            hummi = respone.humidity;
            soid = respone.soil_moisture;
            // console.log(newOptionData)
            return newOptionData;
        });
        setRangeColorTemperature(respone.temperature);
        setRangeColorHumidity(respone.humidity);
        setRangeColorLight(respone.soil_moisture);
    }

    const setsoilMoistureMqtt = (senserId, status) => {
        if (status) {
            turnOn(senserId)
        } else {
            turnOff(senserId)
        }
        setOptionData(prevOptionData => {
            const newOptionData = [...prevOptionData];
            if (senserId === 0) {
                newOptionData[senserId].isOn = status;
                newOptionData[senserId + 1].isOn = status;
            } else {
                newOptionData[senserId].isOn = status;
            }
            return newOptionData;
        });
    }

    const setStatusSenser = (senserId, status) => {
        if (status) {
            turnOn(senserId)
        } else {
            turnOff(senserId)
        }
        setOptionData(prevOptionData => {
            const newOptionData = [...prevOptionData];
            if (senserId === 0) {
                newOptionData[senserId].isOn = status;
                newOptionData[senserId + 1].isOn = status;
            } else {
                newOptionData[senserId].isOn = status;
            }
            if (getSocket().connected && setupPage) {
                let relayAction = {
                    sensorId: senserId === 0 ? 1 : senserId,
                    isOn: status,
                    user: 'Iot'
                };
                // console.log(relayAction)
                getSocket().emit('send-relay', relayAction);
                console.log(relayAction);
            }
            return newOptionData;
        });
    }

    const handleClick = (statusRelay) => {
        if (statusRelay === '.relay') {
            let status = !optionData[0].isOn;
            getSocket().emit('send-relay', statusRelay);
            setStatusSenser(0, status);
        }
        // console.log(stompClientRef.current.connected)
    }

    const handleClickBar = () => {
        openDashBoard(true)
    }

    return (
        <div className="container-home">

            <div className="user-inf">
                <p className='mini-dashboard' onClick={handleClickBar}>
                    <i class="fa-solid fa-bars"></i>
                </p>
                <p className='current-time'>{currentTime}</p>

            </div>
            <div className='inf-home-container'>
                <div className='humidity child-home'>
                    <i class="fa-solid fa-droplet icontemp"></i>
                    độ ẩm không khí {SensorData.humidity === undefined ? hummi : SensorData.humidity}%
                </div>
                <div className='temperature child-home'>
                    <i class="fa-solid fa-temperature-three-quarters icontemp"></i>
                    nhiệt độ {SensorData.temperature === undefined ? temp : SensorData.temperature}°C
                </div>
                <div className='soilMoisture child-home'>
                    <i class="fa-solid fa-droplet icontemp"></i>
                    độ ẩm đất {SensorData.soil_moisture === undefined ? soid : SensorData.soil_moisture}%
                </div>

            </div>
            <div className='graph-container'>

                <div className='chart-temperature each-graph'>
                    <div className='chart-element'>
                        <Graph option={optionData} labels={labels}></Graph>
                    </div>
                    <div className='controller'>
                        <div className='item-controller'>
                            <div className='inf-sensor'>
                                <div className='btn-controller'>
                                    <label class="toggle">
                                        <input type="checkbox" checked={optionData[0].isOn} onClick={() => handleClick('.relay')} />
                                        <span class="slider"></span>
                                    </label>
                                    <div className='icon-controller eff1'>
                                        <i class="fa-solid fa-sun light1"></i>
                                    </div>
                                </div>
                                <div className='name-sensor'>
                                    On/Off
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;