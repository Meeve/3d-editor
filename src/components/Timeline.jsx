import React from 'react';

export default class Timeline extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         min: 0,
         max: 250,
         steps: 10
      };
   }

   onScroll = event => {
      if (event.deltaY > 0) {
         this.setState({
            steps: this.state.steps + 2,
            min: this.state.min - 25,
            max: this.state.max + 25
         });
      } else {
         this.setState({
            steps: this.state.steps - 2,
            min: this.state.min + 25,
            max: this.state.max - 25
         });
      }
   };

   render() {
      let dif = this.state.max - this.state.min;

      const strips = _.range(this.state.steps + 1).map(() => (
         <div className="outer-strip">
            <div className="inner-strip" />
         </div>
      ));
      const stripValues = _.range(
         this.state.min,
         this.state.max + dif / this.state.steps,
         dif / this.state.steps
      ).map(stripValue => <span>{stripValue}</span>);

      return (
         <div className="timeline-background" onWheel={this.onScroll}>
            <div className="stripes">{strips}</div>
            <div className="strip-values">{stripValues}</div>
            <div className="timeline" />
         </div>
      );
   }
}
