import './styleDataHistory.css'
import { useState, useEffect } from 'react';
import { setTime, openDashBoard } from '../../funtion/funtion';

var currentPage = 1;
var limit = 10;
var offset = 0;
var totalPage = 1;
var setupPage = true;

function DataHistory() {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [dataSensor, setDataSensor] = useState([]);
    const [pages, setPages] = useState([]);

    const handleChangePages = (page) => {
        console.log('current: ' + currentPage + ' ' + setupPage);
        var num = totalPage - parseInt(page);
        var temp = [];
        if (num >= 5) {
            for (let i = 0; i < 5; i++) {
                let count = parseInt(page) + i;
                if (count <= totalPage) {
                    temp.push(parseInt(page) + i);
                } else {
                    break;
                }
            }
        } else {
            for (let i = totalPage - 4 > 0 ? totalPage - 4 : 1; i <= totalPage; i++) {
                temp.push(i);
            }
        }
        console.log(temp)
        setPages(temp);
        currentPage = parseInt(page);
        offset = (currentPage - 1) * limit;
        if (setupPage === false) {
            sendFilter();
        }
        setupPage = false;
    }

    const sendFilter = (event) => {
        event?.preventDefault(); // Ngăn form gửi đi
        if (event !== undefined) {
            offset = 0;
            currentPage = 1;
            setupPage = true;
        }
        let newData = {
            startDay: start,
            endDay: end,
            limit: limit,
            offset: offset
        };
        console.log(newData)
        const url = 'http://localhost:3006/api/dataHistory'; // Địa chỉ URL của server Node.js
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // console.log(data);                
                setDataSensor(data);
                let total = Math.ceil(data.length / limit);
                totalPage = total === 0 ? 1 : total;
                if (setupPage) {
                    handleChangePages(currentPage);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
    //load trang
    useEffect(() => {
        currentPage = 1;
        setupPage = true;
        sendFilter();
    }, [])

    return (
        <div className="data-container">
            <div className='title-name-data'>
                <h2 className='name-data-history'>Data history</h2>
            </div>

            {/* <form className='filter-controller' onSubmit={sendFilter}>
                <div className='option-filter'>
                    <input type='date'
                        className='filter-input'
                        onChange={(e) => setStart(e.target.value)}
                        required></input>
                </div>
                <div className='option-filter'>
                    <input type='date' className='filter-input'
                        onChange={(e) => setEnd(e.target.value)}
                        required></input>
                </div>
                <div className='option-filter'>
                    <button type='submit' className='btn-filter'><i class="fa-solid fa-magnifying-glass"></i></button>
                </div>

            </form> */}
            <div className='table-container'>
                <table class="table table-bordered">
                    <thead class="thead-dark">
                        <tr className="header-title">
                            <th scope="col">STT</th>
                            <th scope="col">Humidity</th>
                            <th scope="col">Temperature</th>
                            <th scope="col">soilMoisture</th>
                            <th scope="col">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataSensor.map((data, index) => (
                            <tr key={index}>
                                <td>{(currentPage - 1) * limit + 1 + index}</td>
                                <td>{data.Humidity}%</td>
                                <td>{data.Temperature}°C</td>
                                <td>{data.SoilMoisture} %</td>
                                <td>{setTime(data.createdAT)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default DataHistory;