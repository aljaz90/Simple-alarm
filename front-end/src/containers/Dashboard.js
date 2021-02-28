import React, { Component } from 'react';
import { IonIcon } from '../components/IonIcons/IonIcon';
import { formatDateTime } from '../utils/Utils';
import { Switch } from '../components/Forms/Switch';
import axios from 'axios';

export default class Dashboard extends Component {

    changeAlarmStatus = async newStatus => {
        try {
            if (newStatus === this.props.system.alarmStatus) {
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            const data = {
                alarmStatus: newStatus,
            };

            await axios.post("http://localhost:4000/api/system", data, config);
            this.props.setSystem({...this.props.system, alarmStatus: newStatus});
            this.props.showNotification({
                type: "toast",
                contentType: "success",
                text: "Alarm status updated successfully",
                time: 1.5
            });
        }
        catch {
            this.props.showNotification({
                type: "toast",
                contentType: "error",
                text: "An error occured while trying update alarm status",
                time: 3
            });   

        }
    };

    render() {
        if (!this.props.system) {
            return null;
        }

        let recentEvents = [...this.props.system.events].sort((a, b) => new Date(b.date) - new Date(a.date)).splice(0, 4);

        return (
            <React.Fragment>
                <div className="dashboard--system">
                    <div className="dashboard--system--header">
                        Overview
                    </div>
                    <div className="dashboard--system--container">
                        <div className="dashboard--system--details">
                            <div className="dashboard--system--name">
                                Main System
                            </div>
                            <div className="dashboard--system--location">
                                <IonIcon icon="location-outline" className="dashboard--system--location--icon" />
                                Ljubljana, Slovenia
                            </div>
                            <div className={`dashboard--system--status ${this.props.system.status === "online" ? "dashboard--system--status-online": "dashboard--system--status-offline"}`}>
                                {
                                    this.props.system.status === "online" ?
                                        <React.Fragment>
                                            <IonIcon icon="flash-outline" className="dashboard--system--status--icon" />
                                            Online
                                        </React.Fragment>
                                    :
                                        <React.Fragment>
                                            <IonIcon icon="flash-off-outline" className="dashboard--system--status--icon" />
                                            Offline
                                        </React.Fragment>
                                }
                            </div>
                        </div>
                        <div className="dashboard--system--sensors">
                            <div className="dashboard--system--sensor">
                                <IonIcon icon="body-outline" className="dashboard--system--sensor--icon" />
                                {this.props.system.sensors.filter(el => el.type === "movement").length} Movement sensors
                            </div>
                            <div className="dashboard--system--sensor">
                                <IonIcon icon="videocam-outline" className="dashboard--system--sensor--icon" />
                                {this.props.system.sensors.filter(el => el.type === "camera").length} Surveillance cameras
                            </div>
                            <div className="dashboard--system--sensor">
                                <IonIcon icon="magnet-outline" className="dashboard--system--sensor--icon" />
                                {this.props.system.sensors.filter(el => el.type === "magnetic").length} Magnetic sensors
                            </div>
                            <div className="dashboard--system--sensor">
                                <IonIcon icon="mic-outline" className="dashboard--system--sensor--icon" />
                                {this.props.system.sensors.filter(el => el.type === "sound").length} Audio sensors
                            </div>
                        </div>
                    </div>
                    <div className="dashboard--system--action">
                        <div className="dashboard--system--action--label">
                            Alarm status
                        </div>
                        <Switch defaultOption={this.props.system.alarmStatus === "armed" ? "armed" : "idle"} className="dashboard--system--action--action" onSelect={option => this.changeAlarmStatus(option)} options={[{key: "armed", text: "Armed", icon: "lock-closed-outline"}, {key: "idle", text: "Disabled", icon: "lock-open-outline"}]} />
                    </div>
                </div>
                <div className="dashboard--sensors">
                    <div className="dashboard--sensors--header">
                        Sensors
                    </div>
                    {
                        this.props.system.sensors.map(el => {
                            let sensorTypeIcon = "accessibility-outline";
                            let sensorTypeText = "Movement sensor";
                            if (el.type === "magnetic") {
                                sensorTypeIcon = "magnet-outline";
                                sensorTypeText = "Magnetic sensor";
                            }
                            else if (el.type === "camera") {
                                sensorTypeIcon = "videocam-outline";
                                sensorTypeText = "Surveillance camera";
                            }
                            else if (el.type === "sound") {
                                sensorTypeIcon = "mic-outline";
                                sensorTypeText = "Sound sensor";
                            }

                            return (
                                <div key={el._id} className="dashboard--sensors--sensor">
                                    <div className="dashboard--sensors--sensor--type">
                                        <IonIcon icon={sensorTypeIcon} className="dashboard--sensors--sensor--type--icon" /> 
                                        {sensorTypeText} - 
                                        <span className="dashboard--sensors--sensor--type--id">
                                            {el._id}
                                        </span>
                                    </div>
                                    <div className="dashboard--sensors--sensor--date">
                                        <span className="dashboard--sensors--sensor--date--label">Last active on: </span>{formatDateTime(el.last_access_time)}
                                    </div>
                                    <div className={`dashboard--sensors--sensor--status ${el.status === "enabled" ? "dashboard--sensors--sensor--status-online" : "dashboard--sensors--sensor--status-offline"}`}>
                                        {
                                            el.status === "enabled" ?
                                            <React.Fragment>
                                                <IonIcon icon="flash-outline" className="dashboard--sensors--sensor--status--icon" /> Enabled
                                            </React.Fragment>
                                            :
                                            <React.Fragment>
                                                <IonIcon icon="flash-off-outline" className="dashboard--sensors--sensor--status--icon" /> Disabled
                                            </React.Fragment>
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div onClick={() => this.props.history.push("/sensors")} className="dashboard--sensors--view_more">
                        View more
                    </div>
                </div>
                <div className="dashboard--events">
                    <div className="dashboard--events--header">
                        Events
                    </div>
                    <div onClick={() => this.props.history.push("/events")} className="dashboard--events--view_more">
                        View more
                    </div>
                    {
                        recentEvents.map(el => 
                            <div key={el._id} className={`dashboard--events--event ${el.systemStatus === "armed" ? "dashboard--events--event-important" : ""}`}>
                                {
                                    el.systemStatus === "armed" ?
                                        <div className="dashboard--events--event--type dashboard--events--event--type-important">
                                            <IonIcon icon="alert-circle-outline" className="dashboard--events--event--type--icon" /> Alarm
                                        </div>
                                    :
                                        <div className="dashboard--events--event--type">
                                            <IonIcon icon="shield-checkmark-outline" className="dashboard--events--event--type--icon" /> Idle
                                        </div>
                                }
                                <div className="dashboard--events--event--sensor">
                                    <span className="dashboard--events--event--sensor--title">Detected by: </span> {el.sensor}
                                </div>
                                <div className="dashboard--events--event--date">
                                    {formatDateTime(el.date)}
                                </div>
                            </div>
                        )
                    }
                </div>
            </React.Fragment>
        );
    }
}
