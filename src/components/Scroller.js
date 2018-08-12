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
            childHeight: 0,

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

    componentDidUpdate() {
        setTimeout(() => {
            if(this.childHolder.current.clientHeight != this.state.childHeight) {
                this.setState({
                    childHeight: this.childHolder.current.clientHeight
                });
            }
        }, 0);
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
            let { prevScrollBarPosition, yMouseClick } = this.state;
            const marginAndBordersHeight = this.state.outerScrollerMargin * 2 + this.state.outerScrollerBorder * 2;
            const maxValue = this.props.height - this.scroller.current.clientHeight - marginAndBordersHeight;

            if(scrollBarPosition < 0) {
                scrollBarPosition = 0;
                prevScrollBarPosition = 0;
                yMouseClick = event.pageY;
            }
            
            if(scrollBarPosition > maxValue) {
                scrollBarPosition = maxValue;
                prevScrollBarPosition = maxValue;
                yMouseClick = event.pageY;
            }
            
            const prop = scrollBarPosition / maxValue;
            const childGap = this.state.childHeight - this.props.height;

            this.setState({
                childOffsetTop: -(childGap * prop),
                scrollBarPosition,
                prevScrollBarPosition,
                yMouseClick
            });
        }
    }

    stopScrolling() {
        this.setState({
            scrollBarMoving: false
        });
    }

    onScroll(event) {
        let childOffsetTop = this.state.childOffsetTop + (-event.deltaY);
        const maxValue = -(this.state.childHeight - this.props.height);

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

    getHeightRatio() {
        return this.props.height / this.state.childHeight;
    }

    getScrollBarPosition() {
        const maxValue = -(this.state.childHeight - this.props.height);

        const proportion = this.state.childOffsetTop / maxValue;

        const scrollGap = this.scroller.current ? this.props.height - 6 - this.scroller.current.clientHeight : 0;

        return scrollGap * proportion;
    }

    getChildHolderStyle() {
        return {
            transform: `translateY(${parseInt(this.state.childOffsetTop)}px)`
        };
    }
    
    getScrollerOuterStyle() {
        return {
            border: `${this.state.outerScrollerBorder}px solid rgb(81, 81, 81)`,
            margin: `${this.state.outerScrollerMargin}px`,
            display: this.getHeightRatio() > 1 ? "none" : "block"
        }
    }

    getScrollerHandlerStyle() {
        return {
            height: (this.getHeightRatio() * 100) + "%",
            transform: `translateY(${this.getScrollBarPosition()}px)`
        };
    }

    render() {
        if(this.childHolder.current) {
            const extraSpace = this.props.height - (this.childHolder.current.clientHeight + this.state.childOffsetTop); 
            if(extraSpace > 0 && this.state.childOffsetTop < 0)
                this.setState({
                    childOffsetTop: this.state.childOffsetTop + extraSpace
                });
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
                    <div className="scrollerOuter" style={this.getScrollerOuterStyle()}>
                        <div ref={this.scroller} 
                            className="scrollerHandler" 
                            style={this.getScrollerHandlerStyle()} 
                            onMouseDown={this.startScrolling.bind(this)}></div>
                    </div>
            </div>
        );
    }
}