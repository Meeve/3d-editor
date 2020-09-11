import React from 'react';

export default class Dropdown extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         dropdownRef: React.createRef(),
         opennerHolderRef: React.createRef(),
         calculateDirection: this.getStyleCalculatingFunction(),
         openActions: this.getOpenActions(),
         isOpened: false,
      };
   }

   getOpenActions = () => {
      const defaultOpenAction = 'hover';
      const choosenAction = this.props.openAction === undefined ? defaultOpenAction : this.props.openAction;
      const openActions = {
         click: this.getOpenActionsForClick(),
         hover: this.getOpenActionsForHover(),
      };

      if (!openActions[choosenAction]) {
         throw new Error(`Provided open actions ${choosenAction} is not supported`);
      }

      return openActions[choosenAction];
   };

   getOpenActionsForClick = () => {
      return {
         onClick: this.toggleOpen,
      };
   };

   getOpenActionsForHover = () => {
      return {
         onMouseEnter: () => this.setState({ isOpened: true }),
      };
   };

   getStyleCalculatingFunction = () => {
      const defaultDirection = 'top';
      const choosenDirection = this.props.direction === undefined ? defaultDirection : this.props.direction;
      const directions = {
         top: this.calculateStyleForTopDirection,
         right: this.calculateStyleForRightDirection,
      };

      if (!directions[choosenDirection]) {
         throw new Error(`Provided direction property ${choosenDirection} is not supported`);
      }

      return directions[choosenDirection];
   };

   calculateStyleForTopDirection = (dropdownSizes) => {
      return {
         top: -dropdownSizes.height + 'px',
         left: 0,
      };
   };

   calculateStyleForRightDirection = (dropdownSizes, opennerSizes) => {
      return {
         top:
            opennerSizes.top + dropdownSizes.height > window.innerHeight
               ? -dropdownSizes.height + opennerSizes.height + 'px'
               : 0,
         left: opennerSizes.width + 'px',
      };
   };

   toggleOpen = () => {
      this.setState({ isOpened: !this.state.isOpened });
   };

   getWrapedChildren = () => {
      if (Array.isArray(this.props.children)) {
         return _.map(this.props.children, this.styleChild);
      }
      return this.styleChild(this.props.children);
   };

   styleChild = (child, key) => {
      return (
         <div key={key} className="dropdownMenuAction">
            {child}
         </div>
      );
   };

   getPositionStylesForExpander = () => {
      let innerContainerStyles = {};

      if (this.state.dropdownRef.current) {
         innerContainerStyles = this.getContainerStyle();
      } else {
         // setState is a promise, so first references will be set, and then this method will trigger rerender
         this.setState({});
      }

      return innerContainerStyles;
   };

   getExpandedDropdown = () => {
      if (this.state.isOpened) {
         return (
            <div
               className="dropDownOptionHolder"
               style={this.getPositionStylesForExpander()}
               ref={this.state.dropdownRef}>
               {this.getWrapedChildren()}
            </div>
         );
      }

      return '';
   };

   getStylesForEventCatcher = () => {
      let styles = {};
      const catcherBound = 30;
      if (this.state.isOpened && this.state.dropdownRef.current) {
         let dropdownSizes = this.state.dropdownRef.current.getBoundingClientRect();
         let innerContainerStyles = this.getContainerStyle();
         styles = {
            width: dropdownSizes.width + catcherBound * 2 + 'px',
            height: dropdownSizes.height + catcherBound * 2 + 'px',
            top: -catcherBound + parseInt(innerContainerStyles.top) + 'px',
            left: -catcherBound + parseInt(innerContainerStyles.left) + 'px',
         };
      }

      return styles;
   };

   getContainerStyle = () => {
      let dropdownSizes = this.state.dropdownRef.current.getBoundingClientRect();
      let openerSizes = this.state.opennerHolderRef.current.getBoundingClientRect();
      return this.state.calculateDirection(dropdownSizes, openerSizes);
   };

   render() {
      return (
         <div
            className="dropdown"
            ref={this.state.opennerHolderRef}
            onMouseLeave={() => this.setState({ isOpened: false })}>
            <div className="dropdownContent" {...this.state.openActions}>
               {this.props.content}
            </div>
            {this.getExpandedDropdown()}

            <div className="dropdownEventCatcher" style={this.getStylesForEventCatcher()} />
         </div>
      );
   }
}
