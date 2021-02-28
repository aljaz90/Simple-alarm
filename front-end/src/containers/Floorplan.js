import React from 'react';
import EzAnimate from '../components/Animations/EzAnimate';
import { IonIcon } from '../components/IonIcons/IonIcon';

export const Floorplan = props => {

    let recentEvents = [];
    if (props.system) {
        recentEvents = [...props.system.events].filter(el => new Date() - new Date(el.date).getTime() < 10000).map(el => el.sensor);
    }


    return (
        <div className="floorplan">
            <div className="floorplan--header">
                Floor plan
            </div>
            <div className="floorplan--plan">
                <EzAnimate transitionName="animation--fadeInOut">
                    {
                        recentEvents.includes("5fcfa291f1576636d0318b70") &&
                            <div className="floorplan--plan--area floorplan--plan--area-1">
                                <IonIcon className="floorplan--plan--area--icon" icon="alert-circle-outline" />
                            </div>
                    }
                </EzAnimate>
                <EzAnimate transitionName="animation--fadeInOut">
                    {
                        recentEvents.includes("5fcfa291f1576636d0318b71") &&
                            <div className="floorplan--plan--area floorplan--plan--area-2">
                                <IonIcon className="floorplan--plan--area--icon" icon="alert-circle-outline" />
                            </div>
                    }
                </EzAnimate>
                <EzAnimate transitionName="animation--fadeInOut">
                    {
                        recentEvents.includes("5fcfa291f1576636d0318b72") &&
                            <div className="floorplan--plan--area floorplan--plan--area-3">
                                <IonIcon className="floorplan--plan--area--icon" icon="alert-circle-outline" />
                            </div>
                    }
                </EzAnimate>
                <EzAnimate transitionName="animation--fadeInOut">
                    {
                        recentEvents.includes("5fcfa291f1576636d0318b73") &&
                            <div className="floorplan--plan--area floorplan--plan--area-4">
                                <IonIcon className="floorplan--plan--area--icon" icon="alert-circle-outline" />
                            </div>
                    }
                </EzAnimate>
            </div>
        </div>
    );
};
