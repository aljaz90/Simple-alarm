import React, { Component } from 'react'
import { Switch } from '../components/Forms/Switch'
import { IonIcon } from '../components/IonIcons/IonIcon'
import { formatDateTime, formatDate, getDatesBetweenDates } from '../utils/Utils';
import { ResponsiveLine } from 'nivo'

export default class Events extends Component {

    constructor(props) {
        super(props);

        let activeTab = new URLSearchParams(props.location.search).get("tab");
        this.state = {
            currentTab: activeTab === "chart" ? "chart" : "list"
        }
        this.container = React.createRef();
    }

    getAmountOfEventsOnDate = (events, date) => {
        return events.filter(ev => formatDate(ev.date) === formatDate(date)).length;
    }

    parseDataForChart = () => {
        let events = [...this.props.system.events];
        events = events.sort((a, b) => new Date(a.date) - new Date(b.date));
        let data = [];
        let dates = getDatesBetweenDates(new Date(events[0].date), new Date());

        let alarmEvents = events.filter(el => el.systemStatus === "armed");
        let idleEvents = events.filter(el => el.systemStatus === "idle");
        
        data = [
            {
                id: "Alarm",
                color: "hsl(354, 100%, 57%)",
                data: dates.map(date => ({
                    x: formatDate(date),
                    y: this.getAmountOfEventsOnDate(alarmEvents, date),
                }))
            },
            {
                id: "Idle",
                color: "hsl(126, 68%, 55%)",
                data: dates.map(date => ({
                    x: formatDate(date),
                    y: this.getAmountOfEventsOnDate(idleEvents, date),
                }))            
            }
        ]      

        return data;
    }

    render() {

        if (!this.props.system) {
            return null;
        }

        let events = [...this.props.system.events].sort((a, b) => new Date(b.date) - new Date(a.date));
        let content = (
            <div className="events--container">
                {
                    events.map(el => 
                        <div key={el._id} className={`events--event ${el.systemStatus === "armed" ? "events--event-important" : ""}`}>
                            {
                                el.systemStatus === "armed" ?
                                    <div className="events--event--type events--event--type-important">
                                        <IonIcon icon="alert-circle-outline" className="events--event--type--icon" /> Alarm
                                    </div>
                                :
                                    <div className="events--event--type">
                                        <IonIcon icon="shield-checkmark-outline" className="events--event--type--icon" /> Idle
                                    </div>
                            }
                            <div className="events--event--sensor">
                                <span className="events--event--sensor--title">Detected by: </span> {el.sensor}
                            </div>
                            <div className="events--event--date">
                                {formatDateTime(el.date)}
                            </div>
                        </div>
                    )
                }
                <div className="events--event-filler"></div>
            </div>
        );

        if (this.state.currentTab === "chart") {
            content = (
                    <div className="events--container-chart">
                        <ResponsiveLine
                            curve="catmullRom"
                            colorBy={d => d.color}
                            data={this.parseDataForChart()}
                            height={this.container.current ? this.container.current.offsetHeight - 200 : 500}
                            width={this.container.current ? this.container.current.offsetWidth - 200 : 800}
                            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                            xScale={{ type: 'point' }}
                            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                            yFormat=" >-.2f"
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                orient: 'bottom',
                                tickSize: 5,
                                tickPadding: 10,
                                tickRotation: 0,
                                legend: 'Date',
                                legendOffset: 36,
                                legendPosition: 'center'
                            }}
                            axisLeft={{
                                orient: 'left',
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Number of events',
                                legendOffset: -40,
                                legendPosition: 'center'
                            }}
                            pointSize={10}
                            pointColor={{ theme: 'background' }}
                            pointBorderWidth={2}
                            pointBorderColor={{ from: 'serieColor' }}
                            pointLabelYOffset={-12}
                            useMesh={true}
                            legends={[
                                {
                                    anchor: 'bottom-right',
                                    direction: 'column',
                                    justify: false,
                                    translateX: 100,
                                    translateY: 0,
                                    itemsSpacing: 0,
                                    itemDirection: 'left-to-right',
                                    itemWidth: 80,
                                    itemHeight: 20,
                                    itemOpacity: 0.75,
                                    symbolSize: 12,
                                    symbolShape: 'circle',
                                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemBackground: 'rgba(0, 0, 0, .03)',
                                                itemOpacity: 1
                                            }
                                        }
                                    ]
                                }
                            ]}
                        />
                    </div>);
        }
        
        return (
            <div ref={this.container} className="events">
                <div className="events--header">
                    <IonIcon className="events--header--icon" icon="calendar-outline" /> Events
                </div>
                <div className="events--nav">
                    <Switch className="events--nav--nav" type="nav" defaultOption={this.state.currentTab} onSelect={option => { this.setState({...this.state, currentTab: option}); this.props.history.push(`/events?tab=${option}`); }} options={[{key: "list", text: "List", icon: "list-outline"}, {key: "chart", text: "Chart", icon: "analytics-outline"}]} />
                </div>
                {content}
            </div>
        );
    }
}
