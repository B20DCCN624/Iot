

import './styleConfig.css'
import { useState, useEffect } from 'react';
import { setTime, openDashBoard } from '../../funtion/funtion';

var currentPage = 1;
const limit = 8;
var offset = 0;
var totalPage = 1;
var setupPage = true;

function ConfigHistory() {
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

    const HandlePrePage = () => {
        let tmp = [...pages];
        if (tmp[0] !== 1) {
            for (let i = 0; i < tmp.length; i++) {
                tmp[i] = tmp[i] - 1;
            }
            setPages(tmp);
            currentPage--;
            offset = (currentPage - 1) * limit;
            sendFilter();
        }

    }
    const HandleNextPage = () => {
        let tmp = [...pages];
        // console.log(tmp[tmp.length - 1] + " " + totalPage)
        if (tmp[tmp.length - 1] !== totalPage) {
            for (let i = 0; i < tmp.length; i++) {
                tmp[i] = tmp[i] + 1;
            }
            setPages(tmp);
            currentPage++;
            offset = (currentPage - 1) * limit;
            sendFilter();
        }

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
        var url = 'http://localhost:8080/getActionLogFilter';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)
        })
            .then(response => response.json())
            .then(data => {
                // console.log('aaa');
                setDataSensor(data['data']);
                let total = Math.round(data['rows'] / 8);
                totalPage = total === 0 ? 1 : total;
                if (setupPage) {
                    handleChangePages(currentPage)
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
    const handleClickBar = () => {
        openDashBoard(true)
    }
    //load trang
    useEffect(() => {
        currentPage = 1;
        setupPage = true;
        sendFilter();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="data-container">
            <div className='bar' onClick={handleClickBar}>
                <i class="fa-solid fa-bars"></i>
            </div>
            <div className='title-name-data'>
                <h2 className='name-data-history'>Action history</h2>
            </div>

            <form className='filter-controller' onSubmit={sendFilter}>
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

            </form>
            <div className='table-container'>
                <table class="table table-bordered">
                    <thead class="thead-dark">
                        <tr className="header-title">
                            <th scope="col">STT</th>
                            <th scope="col">Name</th>
                            <th scope="col">Action</th>
                            <th scope="col">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataSensor.map((data, index) => (
                            <tr key={index}>
                                <td>{(currentPage - 1) * limit + 1 + index}</td>
                                <td>{data.name}</td>
                                <td>{data.action}</td>
                                <td>{setTime(data.time)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='page-controller'>
                <div className='page-container'>
                    {currentPage !== 1 ? (
                        <button className='pre-page btn-page'
                            onClick={HandlePrePage}><i class="fa-solid fa-angles-left"></i></button>
                    ) : (
                        <div></div>
                    )}

                    {pages.map(page => (
                        <input
                            className={currentPage === page ? 'active-page' : 'btn-page'}
                            key={page}
                            id={`btn-${page}`}
                            type='button'
                            value={page}
                            onClick={(e) => handleChangePages(e.target.value)}></input>
                    ))
                    }
                    {totalPage > 1 ? (
                        <button className='next-page btn-page'
                            onClick={HandleNextPage}><i class="fa-solid fa-angles-right"></i></button>
                    ) : (
                        <div></div>
                    )}

                </div>
            </div>
        </div>
    );
}
export default ConfigHistory;