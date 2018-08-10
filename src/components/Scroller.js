import React from 'react';

export default class Scroller extends React.Component {
    constructor(props) {
        super(props);
        this.childHolder = React.createRef();
        this.scrollHolder = React.createRef();
    }

    render() {
        let scrollerHandlerStyle = { height: 0 };
        let heightRatio = 0;

        if(this.childHolder.current) {
            heightRatio = this.scrollHolder.current.clientHeight / this.childHolder.current.clientHeight;
            scrollerHandlerStyle = {
                height: (heightRatio * 100) + "%"
            };
        }

        return (
            <div style={{display: "grid", gridTemplateColumns: "1fr 15px", overflow: "hidden"}} ref={this.scrollHolder}>
                <div style={{overflow: "hidden"}}>
                    <div ref={this.childHolder} >
                        <this.props.children/>
                    </div>
                </div>
                <div className="scrollerOuter" style={{ display: heightRatio > 1 ? "none" : "block" }}>
                    <div className="scrollerHandler" style={scrollerHandlerStyle}></div>
                </div>
            </div>
        );
    }
}