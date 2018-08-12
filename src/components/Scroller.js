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

        this.stopScrolling = this.stopScrolling.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
    }

    componentDidMount() {
        document.body.addEventListener('mouseup', this.stopScrolling);
        document.body.addEventListener('mousemove', this.onMouseMove);
    }

    componentWillUnmount() {
        document.body.removeEventListener('mouseup', this.stopScrolling);
        document.body.addEventListener('mousemove', this.onMouseMove);
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
            const marginAndBordersHeight = this.state.outerScrollerMargin * 2 + this.state.outerScrollerBorder * 2;
            const maxValue = this.props.height - this.scroller.current.clientHeight - marginAndBordersHeight;

            if(scrollBarPosition < 0) 
                scrollBarPosition = 0;
            
            if(scrollBarPosition > maxValue)
                scrollBarPosition = maxValue;
            
            const prop = scrollBarPosition / maxValue;
            const childGap = this.childHolder.current.clientHeight - this.props.height;
            this.setState({
                childOffsetTop: -(childGap * prop),
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
        const scrollGap = this.props.height - 6 - this.scroller.current.clientHeight;

        this.setState({
            childOffsetTop,
            scrollBarPosition: scrollGap * prop
        });
    }

    getChildHolderStyle() {
        return {
            transform: `translateY(${this.state.childOffsetTop}px)`
        };
    }

    render() {
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