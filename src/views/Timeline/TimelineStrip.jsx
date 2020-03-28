import React from 'react';
import { IntegerField } from "../../components/inputs/IntegerField";
import AnimationContext from '../../modules/AnimationContext';

export default class TimelineStrip extends React.Component {
    static contextType = AnimationContext;

    render() {
        return (<div className="timelineStrip">
            <div> {/* need for this div is total fail */}
                <IntegerField 
                    value={this.context.currentFrame} 
                    onChange={value => this.context.changeCurrentFrame(value)}
                    slideSpeed={20}
                />
            </div>
            <button onClick={() => this.context.startAnimation()}>Play</button>
            <button onClick={() => this.context.stopAnimation()}>Stop</button>
            <div>
                <IntegerField 
                    label='Start'
                    value={this.context.firstFrame} 
                    onChange={value => this.context.updateFirstFrame(value)}
                    slideSpeed={20}
                />
            </div>
            <div>
                <IntegerField 
                    label='End'
                    value={this.context.lastFrame} 
                    onChange={value => this.context.updateLastFrame(value)}
                    slideSpeed={20}
                />
            </div>
        </div>);
    }
}