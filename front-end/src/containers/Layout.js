import React from 'react';
import { SidebarItem } from '../components/Sidebar/SidebarItem';
export const Layout = () => {
    return (
        <React.Fragment>
            <div className="nav">
                <div className="nav--logo">Simple.Alarm</div>
                <div className="nav--nav">
                </div>
            </div>
            <div className="sidebar">
                <div className="sidebar--header">
                    <div className="sidebar--header--icon"></div>
                </div>
                <SidebarItem icon="compass-outline" name="Dashboard" to="/" />
                <SidebarItem icon="list-outline" name="Sensors" to="/sensors" />
                <SidebarItem icon="calendar-outline" name="Events" to="/events" />
                <SidebarItem icon="home-outline" name="Floor plan" to="/floorplan" />
            </div>
        </React.Fragment>
    )
}
