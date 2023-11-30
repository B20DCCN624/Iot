import { Outlet } from 'react-router-dom';
import './styleLayout.css'
import DashBoard from '../components/dashboard/dashboad';

function Layout() {

    return (
        <div className="main-container">
            <div className="layout-container">
                <div className="dashboard-container">
                    <DashBoard></DashBoard>
                </div>
                <div className="home-container">
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
}

export default Layout;