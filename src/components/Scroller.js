import React from 'react';

export default class Scroller extends React.Component {
    constructor(props) {
        super(props);
        this.childHolder = React.createRef();
        this.scrollHolder = React.createRef();
        this.scroller = React.createRef();

        this.state = {
            prevScrollBarPosition: 0,
            scrollBarPosition: 0,
            outerScrollerMargin: 2,
            outerScrollerBorder: 1
        };
    }

    startScrolling(event) {
        this.setState({
            yMouseClick: event.pageY,
            scrollBarMoving: true,
            prevScrollBarPosition: this.state.scrollBarPosition
        });
    }

    onMouseMove(event) {
        if(this.state.scrollBarMoving) {
            let scrollBarPosition = this.state.prevScrollBarPosition + (event.pageY - this.state.yMouseClick);
            if(scrollBarPosition < 0) 
                scrollBarPosition = 0;
            
            const marginAndBordersHeight = this.state.outerScrollerMargin * 2 + this.state.outerScrollerBorder * 2;
            if(scrollBarPosition + this.scroller.current.clientHeight + marginAndBordersHeight > this.scrollHolder.current.clientHeight)
                scrollBarPosition = this.scrollHolder.current.clientHeight - this.scroller.current.clientHeight - marginAndBordersHeight;
            
            this.setState({
                scrollBarPosition
            });
        }
    }

    stopScrolling() {
        this.setState({
            scrollBarMoving: false
        });
    }

    getScrollerOuterStyle(heightRatio) {
        return {
            border: `${this.state.outerScrollerBorder}px solid rgb(81, 81, 81)`,
            margin: `${this.state.outerScrollerMargin}px`,
            display: heightRatio > 1 ? "none" : "block"
        }
    }

    render() {
        let scrollerHandlerStyle = { height: 0 };
        let heightRatio = 0;

        if(this.childHolder.current) {
            heightRatio = this.scrollHolder.current.clientHeight / this.childHolder.current.clientHeight;
            scrollerHandlerStyle = {
                height: (heightRatio * 100) + "%",
                transform: `translateY(${this.state.scrollBarPosition}px)`
            };
        }

        return (
            <div style={{display: "grid", gridTemplateColumns: "1fr 15px", overflow: "hidden"}} 
                ref={this.scrollHolder} 
                onMouseMove={this.onMouseMove.bind(this)}
                onMouseUp={this.stopScrolling.bind(this)}>

                    <div style={{overflow: "hidden"}}>
                        <div ref={this.childHolder} >
                            <this.props.children/>
                        </div>
                    </div>
                    <div className="scrollerOuter" style={this.getScrollerOuterStyle(heightRatio)}>
                        <div ref={this.scroller} className="scrollerHandler" style={scrollerHandlerStyle} onMouseDown={this.startScrolling.bind(this)}></div>
                    </div>
            </div>
        );
    }
}