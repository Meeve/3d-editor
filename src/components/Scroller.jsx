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
         if (this.childHolder.current.clientHeight != this.state.childHeight) {
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
         prevScrollBarPosition: this.getScrollBarPosition()
      });
   }

   getBorderAndMarginSize() {
      return this.state.outerScrollerMargin * 2 + this.state.outerScrollerBorder * 2;
   }

   onMouseMove(event) {
      if (this.state.scrollBarMoving) {
         let scrollBarPosition = this.state.prevScrollBarPosition + (event.pageY - this.state.yMouseClick);
         let {prevScrollBarPosition, yMouseClick} = this.state;
         const maxValue = this.props.height - this.scroller.current.clientHeight - this.getBorderAndMarginSize();

         if (scrollBarPosition < 0) {
            scrollBarPosition = 0;
            prevScrollBarPosition = 0;
            yMouseClick = event.pageY;
         }

         if (scrollBarPosition > maxValue) {
            scrollBarPosition = maxValue;
            prevScrollBarPosition = maxValue;
            yMouseClick = event.pageY;
         }

         const prop = scrollBarPosition / maxValue;
         const childGap = this.state.childHeight - this.props.height;

         this.setState({
            childOffsetTop: -(childGap * prop),
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
      let childOffsetTop = this.state.childOffsetTop + -event.deltaY;
      const maxValue = -(this.state.childHeight - this.props.height);

      if (childOffsetTop < maxValue) {
         childOffsetTop = maxValue;
      }

      if (childOffsetTop > 0) {
         childOffsetTop = 0;
      }

      this.setState({
         childOffsetTop
      });
   }

   getHeightRatio() {
      return this.props.height / this.state.childHeight;
   }

   getScrollBarPosition() {
      const maxValue = -(this.state.childHeight - this.props.height);
      const proportion = this.state.childOffsetTop / maxValue;
      const scrollGap = this.scroller.current
         ? this.props.height - this.getBorderAndMarginSize() - this.scroller.current.clientHeight
         : 0;

      return scrollGap * proportion;
   }

   scrollDownIfHasExtraSpace() {
      if (this.childHolder.current) {
         const extraSpace = this.props.height - (this.childHolder.current.clientHeight + this.state.childOffsetTop);
         if (extraSpace > 0 && this.state.childOffsetTop < 0) {
            this.setState({
               childOffsetTop: this.state.childOffsetTop + extraSpace
            });
         }
      }
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
         display: this.getHeightRatio() > 1 ? 'none' : 'block'
      };
   }

   getScrollerHandlerStyle() {
      return {
         height: this.getHeightRatio() * 100 + '%',
         transform: `translateY(${this.getScrollBarPosition()}px)`
      };
   }

   render() {
      this.scrollDownIfHasExtraSpace();

      return (
         <div
            className="scrollerContainer"
            onWheel={this.onScroll.bind(this)}
            onMouseUp={this.stopScrolling.bind(this)}
         >
            <div className="childHolderWrapper">
               <div className="childHolder" ref={this.childHolder} style={this.getChildHolderStyle()}>
                  {' '}
                  {this.props.children}{' '}
               </div>
               {' '}
            </div>

            <div className="scrollerOuter" style={this.getScrollerOuterStyle()}>
               <div
                  ref={this.scroller}
                  className="scrollerHandler"
                  style={this.getScrollerHandlerStyle()}
                  onMouseDown={this.startScrolling.bind(this)}
               />
               {' '}
            </div>
         </div>
      );
   }
}
