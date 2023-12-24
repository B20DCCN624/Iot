import './styleDashboard.css'
import { Link } from 'react-router-dom';
import { openDashBoard, darkMode } from '../../funtion/funtion';
import { useState } from 'react';
function DashBoard() {
    
    const closeBar = () => {
        openDashBoard(false);
    }
    return (
        <div className="dashboard">
            <div className="container-name">
                <i class="fa-solid fa-gauge"></i>
                IOT G18
            </div>
            <div className='menu-dashboard'>
                <Link to={``} onClick={closeBar}>
                    <div className='option-dashboard'>

                        <i class="fa-regular fa-compass icon-db"></i>
                        Dash board
                    </div>
                </Link>
                <Link to={`/data-history`} onClick={closeBar}>
                    <div className='option-dashboard'>

                        <i class="fa-solid fa-database icon-db"></i>
                        Data history
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default DashBoard;