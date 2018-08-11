import React from 'react';

export default class Scroller extends React.Component {
    constructor(props) {
        super(props);
        this.childHolder = React.createRef();
        this.scroller = React.createRef();

        this.state = {
            prevScrollBarPosition: 0,
            scrollBarPosition: 0,

            childOffsetTop: 0,

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
            if(scrollBarPosition + this.scroller.current.clientHeight + marginAndBordersHeight > this.props.height)
                scrollBarPosition = this.props.height - this.scroller.current.clientHeight - marginAndBordersHeight;
            
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

    onScroll(event) {
        let childOffsetTop = this.state.childOffsetTop + (-event.deltaY);
        const maxValue = -(this.childHolder.current.clientHeight - this.props.height);

        if(childOffsetTop < maxValue) 
            childOffsetTop = maxValue;

        if(childOffsetTop > 0)
            childOffsetTop = 0;

        const prop = childOffsetTop / maxValue;
        console.log(prop);
        const scrollGap = this.props.height - 6 - this.scroller.current.clientHeight;
        console.log(this.props.height, this.scroller.current.clientHeight);
        this.setState({
            childOffsetTop,
            scrollBarPosition: (scrollGap * prop) 
        });
    }

    getChildHolderStyle() {
        return {
            transform: `translateY(${this.state.childOffsetTop}px)`
        };
    }

    render() {
        console.log(this.props.height);
        let scrollerHandlerStyle = { height: 0 };
        let heightRatio = 0;

        if(this.childHolder.current) {
            heightRatio = this.props.height / this.childHolder.current.clientHeight;
            scrollerHandlerStyle = {
                height: (heightRatio * 100) + "%",
                transform: `translateY(${this.state.scrollBarPosition}px)`
            };
        }

        return (
            <div style={{display: "grid", gridTemplateColumns: "1fr 15px", overflow: "hidden"}} 
                onWheel={this.onScroll.bind(this)}
                onMouseMove={this.onMouseMove.bind(this)}
                onMouseUp={this.stopScrolling.bind(this)}>

                    <div style={{overflow: "hidden"}}>
                        <div className="childHolderStyle" ref={this.childHolder} style={this.getChildHolderStyle()} >
                            { this.props.children }
                        </div>
                    </div>
                    <div className="scrollerOuter" style={this.getScrollerOuterStyle(heightRatio)}>
                        <div ref={this.scroller} className="scrollerHandler" style={scrollerHandlerStyle} onMouseDown={this.startScrolling.bind(this)}></div>
                    </div>
            </div>
        );
    }
}