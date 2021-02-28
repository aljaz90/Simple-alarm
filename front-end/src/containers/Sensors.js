import React, { Component } from 'react'
import { Switch } from '../components/Forms/Switch';
import { IonIcon } from '../components/IonIcons/IonIcon'
import { formatDateTime } from '../utils/Utils';
import axios from 'axios';

export default class Sensors extends Component {

    changeSensorStatus = async (sensorID, newStatus) => {
        try {
            let sensorIndex = this.props.system.sensors.findIndex(el => el._id === sensorID);
            if (sensorIndex < 0 || newStatus === this.props.system.sensors[sensorIndex].status) {
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            console.log(newStatus)
            const data = {
                status: newStatus,
            };

            await axios.post(`http://localhost:4000/api/sensor/${sensorID}`, data, config);
            let sensors = [...this.props.system.sensors];
            sensors[sensorIndex].status = newStatus;

            this.props.setSystem({...this.props.system, sensors: sensors});
            this.props.showNotification({
                type: "toast",
                contentType: "success",
                text: "Sensor status updated successfully",
                time: 1.5
            });
        }
        catch (err) {
            this.props.showNotification({
                type: "toast",
                contentType: "error",
                text: "An error occured while trying update sensor status",
                time: 3
            });
            console.log(err)
        }
    };

    render() {

        if (!this.props.system) {
            return null;
        }

        return (
            <div className="sensors">
                <div className="sensors--header">
                    <IonIcon className="sensors--header--icon" icon="list-outline"/> Sensors
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
                            <div key={el._id} className="sensors--sensor">
                                <div className="sensors--sensor--type">
                                    <IonIcon icon={sensorTypeIcon} className="sensors--sensor--type--icon" /> 
                                    {sensorTypeText} - 
                                    <span className="sensors--sensor--type--id">
                                        {el._id}
                                    </span>
                                </div>
                                <div className="sensors--sensor--date">
                                    <span className="sensors--sensor--date--label">Last active on: </span>{formatDateTime(el.last_access_time)}
                                </div>
                                <div className={`sensors--sensor--status ${el.status === "enabled" ? "sensors--sensor--status-online" : "sensors--sensor--status-offline"}`}>
                                    <Switch defaultOption={el.status} className="dashboard--system--action--action" onSelect={option => this.changeSensorStatus(el._id, option)} options={[{key: "enabled", text: "Enabled", icon: "flash-outline"}, {key: "disabled", text: "Disabled", icon: "flash-off-outline"}]} />
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        );
    }
}
