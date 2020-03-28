import React from 'react';

export default class Timeline extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         zoomLevel: 21,
         values: [2, 5, 10],

         timelineXPositionOnScreen: 0,
         timelineWidth: 0,
         isMouseDown: false
      };
   }

   onScroll = event => {
      if (event.deltaY > 0) {
         this.setState({
            zoomLevel: this.state.zoomLevel === 1 ? this.state.zoomLevel : this.state.zoomLevel - 1,
         });
      } else {
         this.setState({
            zoomLevel: this.state.zoomLevel + 1,
         });
      }
   };

   updateSelectionPosition = e => {
      const stepsAmount = this.getStepAmount();
      const stepSize = this.getStepSize();
      const timelineSize = Math.abs(-stepSize) + stepsAmount * stepSize;
      const proportion = (e.pageX - this.state.timelineXPositionOnScreen) / this.state.timelineWidth;
      
      this.props.changeCurrentFrame(Math.round((timelineSize * proportion) - stepSize));
   }

   mouseMove = e => {
      if(this.state.isMouseDown) {
         this.updateSelectionPosition(e);
      }
   }

   mouseDown = () => this.setState({ isMouseDown: true });

   mouseUp = () => this.setState({ isMouseDown: false });

   updateTimelinePosition = el => {
      if (el) {
         const {x, width } = el.getBoundingClientRect()
         this.setState({
            timelineXPositionOnScreen: x,
            timelineWidth: width
         });
      }
   }

   transformValueToabsolutPosition = (value) => {
      const stepsAmount = this.getStepAmount();
      const stepSize = this.getStepSize();

      const timelineSize = Math.abs(-stepSize) + stepsAmount * stepSize;
      const proportion = (value + stepSize) / timelineSize;
      return proportion * this.state.timelineWidth;
   }

   transformValueToabsolutPositionFromRightSide = (value) => {
      const stepsAmount = this.getStepAmount();
      const stepSize = this.getStepSize();

      const timelineSize = Math.abs(-stepSize) + stepsAmount * stepSize;
      const proportion = (value - stepSize) / timelineSize; // here's the only deference, support for translation should fix it
      return proportion * this.state.timelineWidth;
   }

   getStepSize = () => {
      const arrayPostion = parseInt(this.state.zoomLevel / 10); // Maybe hook with carousel can be created here
      const arrayValue = this.state.values[arrayPostion % 3];
      const stepSize = Math.pow(10, parseInt(arrayPostion / 3)) * arrayValue;
      return stepSize;
   }

   getStepAmount = () => 10 + this.state.zoomLevel % 10

   render() {
      const stepsAmount = this.getStepAmount();
      const stepSize = this.getStepSize();
      
      const timelineSize = Math.abs(-stepSize) + stepsAmount * stepSize;
      const proportion = (this.props.currentFrame + stepSize) / timelineSize;
      const selectionPosition = proportion * this.state.timelineWidth; // This is very missleading, translation should be implemented...
      
      const strips = _.range(stepsAmount).map((item, key) => (
         <div key={key} className="outer-strip">
            <div className="inner-strip" />
         </div>
      ));

      const stripValues = _.range(0, stepsAmount).map(
         (stripValue, key) => <span key={key}>{stripValue * stepSize}</span>
      );

      const keyFrames = this.props.keyFrames.map(keyframe => <div className="keyFrame" style={{left: this.transformValueToabsolutPosition(keyframe.frame)}}></div>);

      return (
         <div className="timeline-background" 
            onWheel={this.onScroll}
            onMouseUp={this.mouseUp} 
            onMouseDown={e => {
               this.mouseDown(e);
               this.updateSelectionPosition(e);
            }} 
            onMouseMove={this.mouseMove} 
            ref={this.updateTimelinePosition}>
            <div className="stripes">
               <div className="timeline" style={{
                  left: this.transformValueToabsolutPosition(this.props.firstFrame),
                  right: this.transformValueToabsolutPositionFromRightSide(timelineSize - this.props.lastFrame)
               }} />
               <div className="selection" style={{left: selectionPosition}}></div>
               {strips}
               {keyFrames}
            </div>
            <div className="strip-values">{stripValues}</div>
         </div>
      );
   }
}
