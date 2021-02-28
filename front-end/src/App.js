import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Layout } from './containers/Layout';
import NotificationSystem from './containers/NotificationSystem';
import Dashboard from './containers/Dashboard';
import Sensors from './containers/Sensors';
import Events from './containers/Events';
import axios from 'axios';
import { Floorplan } from './containers/Floorplan';

export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            notification: null,
            notificationsBuffer: [],
            apiInterval: null,
            system: null
        }
    };

    componentDidMount() {
        this.setState({...this.state, apiInterval: setInterval(this.getDataFromAPI, 2000)});
        this.getDataFromAPI();
    }

    componentWillUnmount() {
        clearInterval(this.state.apiInterval)
    }

    setSystem = sytem => {
        this.setState({...this.state, system: sytem});
    };

    getDataFromAPI = async () => {
        try {
            let data = await axios.get("http://localhost:4000/api/system");
            this.setState({...this.state, system: data.data});
            let currentTime = new Date().getTime();
            let newEvents = data.data.events.filter(ev => currentTime - new Date(ev.date).getTime() < 2000);
            for (let ev of newEvents) {
                if (ev.systemStatus === "armed") {
                    this.showNotification({
                        type: "alert",
                        contentType: "warning",
                        text: "Alarm has been triggered",
                        actions: [{text: "Okay"}]
                    });
                    break;
                }
            } 
        }
        catch {
            this.showNotification({
                type: "toast",
                contentType: "error",
                text: "Unable to connect to the server",
                time: 2
            });
        }
    };

    showNotification = (notification, removeFromBuffer = false) => {
        if (this.state.notification) {
            if (removeFromBuffer) {
                if (notification.type === "toast" && notification.time > 0) {
                    setTimeout(() => this.dismissNotification(), notification.time * 1000);
                }
                let notificationsBuffer = this.state.notificationsBuffer.slice(1);
                this.setState({ ...this.state, notification, notificationsBuffer });
            }
            else {
                this.setState({ ...this.state, notificationsBuffer: [...this.state.notificationsBuffer, notification] });
            }
        }
        else {
            if (notification.type === "toast" && notification.time > 0) {
                setTimeout(() => this.dismissNotification(), notification.time * 1000);
            }
            this.setState({ ...this.state, notification });
        }
    };

    dismissNotification = () => {
        if (this.state.notificationsBuffer.length > 0) {
            this.showNotification(this.state.notificationsBuffer[0], true);
        }
        else {
            this.setState({ ...this.state, notification: null });
        }
    };

    render() {
        return (
        <div className="container">
            <NotificationSystem dismissNotification={() => this.dismissNotification()} notification={this.state.notification} />
            <Layout {...this.state} showNotification={this.showNotification} saveUserData={this.saveUserData} />
            <Switch>
                <Route exact path="/" render={props => <Dashboard showNotification={this.showNotification} setSystem={this.setSystem} system={this.state.system} {...props} />} />
                <Route exact path="/sensors" render={props => <Sensors showNotification={this.showNotification} setSystem={this.setSystem} system={this.state.system} {...props} />} />
                <Route exact path="/events" render={props => <Events showNotification={this.showNotification} system={this.state.system} {...props} />} />
                <Route exact path="/floorplan" render={props => <Floorplan showNotification={this.showNotification} system={this.state.system} {...props} />} />
                <Route path="/*" render={() => <Redirect to="/" />} />
            </Switch>
        </div>
        );
    }
}