import React from 'react';
import Timeline from '../../components/Timeline';
import AnimationContext from '../../modules/AnimationContext';
import _ from 'lodash';

export default class ConnectedTimeline extends React.Component {
   static contextType = AnimationContext;

   render() {
      return (
         <Timeline 
            keyFrames={this.context.keyFrames}
            firstFrame={this.context.firstFrame}
            lastFrame={this.context.lastFrame}
            currentFrame={this.context.currentFrame}
            changeCurrentFrame={this.context.changeCurrentFrame}
         />
      );
   }
}
