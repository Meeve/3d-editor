import React from "react";

export default class Timeline extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            min: 0,
            max: 305
        };
    }

    render() {
        let pow = this.state.max.toString().length - 1;
        let upper = this.state.max - (this.state.max % Math.pow(10, pow));
        
        const strips = _.range(10).map(() => <div className="outer-strip"><div className="inner-strip"></div></div>);
        const stripValues = _.range(0, upper, upper / 10).map(stripValue => <span>{stripValue}</span>);

        return (<div className="timeline-background">
            <div className="stripes">
                {strips}
            </div>
            <div className="strip-values">
                {stripValues}
            </div>
            <div className="timeline">

            </div>
        </div>);
    }
}