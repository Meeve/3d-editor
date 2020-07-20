import React from 'react';
import { connect } from 'react-redux';
import PanelManipulator from './PanelManipulator';
import * as actions from '../actions/index';
import _ from 'lodash';

class PanelResizer extends React.Component {
   constructor(props) {
      super(props);
      this.handleLeftRightResizing = _.throttle(this.handleLeftRightResizing, 20);
      this.handleTopBottomResizing = _.throttle(this.handleTopBottomResizing, 20);
      this.state = {
         isUpDownResizing: false,
         isLeftRightResizing: false,
         borderSize: 3
      };
   }

   leftResize(colNumber, e) {
      this.props.startLeftRightResizing(colNumber, e.pageX);
   }

   bottomResize(rowNumber, e) {
      this.props.startBottomUpResizing(rowNumber, e.pageY);
   }

   diagonallyResize(rowNumber, colNumber, e) {
      this.leftResize(colNumber, e);
      this.bottomResize(rowNumber, e);
   }

   appResize(e) {
      this.handleLeftRightResizing(e.pageX);
      this.handleTopBottomResizing(e.pageY);
   }

   handleTopBottomResizing = pageY => {
      if (this.props.panelLayout.isUpDownResizing) {
         this.props.transformRowSizesBetweenSiblings(pageY);
      }
   };

   handleLeftRightResizing = pageX => {
      if (this.props.panelLayout.isLeftRightResizing) {
         this.props.transformColumnSizesBetweenSiblings(pageX);
      }
   };

   stopResizing() {
      this.props.stopResizing();
   }

   isLastColumn(colCounter) {
      return colCounter == this.props.panelLayout.columnSizes.length - 1;
   }

   isLastRow(rowCounter) {
      return rowCounter == this.props.panelLayout.rowSizes.length - 1;
   }

   getLeftResizer(colCounter) {
      return this.isLastColumn(colCounter) ? (
         <div />
      ) : (
         <div className="leftResizerEventCatcher" onMouseDown={this.leftResize.bind(this, colCounter)}>
            <div className="greyBackground">
               <div className="visibleResizer" />
            </div>
         </div>
      );
   }

   getBottomResizer(rowCounter) {
      return this.isLastRow(rowCounter) ? (
         <div />
      ) : (
         <div className="bottomResizerEventCatcher" onMouseDown={this.bottomResize.bind(this, rowCounter)}>
            <div className="greyBackground">
               <div className="visibleResizer" />
            </div>
         </div>
      );
   }

   getDiagonalResizer(colCounter, rowCounter) {
      return !this.isLastColumn(colCounter) && !this.isLastRow(rowCounter) ? (
         <div
            className="diagonalResizerEventCatcher"
            onMouseDown={this.diagonallyResize.bind(this, rowCounter, colCounter)}>
            <div className="greyBackground">
               <div className="visibleResizer" />
            </div>
         </div>
      ) : (
         <div />
      );
   }

   getComponentToRender(el) {
      let componentWidth = _.sum(this.props.panelLayout.columnSizes.slice(el.colStart - 1, el.colEnd - 1));
      let componentHeight = _.sum(this.props.panelLayout.rowSizes.slice(el.rowStart - 1, el.rowEnd - 1));

      return (
         <el.element
            componentWidth={componentWidth - this.state.borderSize}
            componentHeight={componentHeight - this.state.borderSize}
            elementProperties={el.elementProperties}
         />
      );
   }

   getElementWithResizers(el) {
      const colCounter = el.colEnd - 2;
      const rowCounter = el.rowEnd - 2;

      return (
         <React.Fragment>
            {this.getComponentToRender(el)}
            {this.getLeftResizer(colCounter)}
            {this.getBottomResizer(rowCounter)}
            {this.getDiagonalResizer(colCounter, rowCounter)}
         </React.Fragment>
      );
   }

   getResizerStyle(el) {
      return {
         gridColumn: `${el.colStart} / ${el.colEnd}`,
         gridRow: `${el.rowStart} / ${el.rowEnd}`,
         gridTemplateColumns: `1fr ${this.state.borderSize}px`,
         gridTemplateRows: `1fr ${this.state.borderSize}px`
      };
   }

   createResizeBox(el, key) {
      return (
         <div className="resizerBox" key={key} style={this.getResizerStyle(el)}>
            {this.getElementWithResizers(el)}
            <PanelManipulator>{el}</PanelManipulator>
         </div>
      );
   }

   calculateGridStyles(cols, rows) {
      return {
         gridTemplateColumns: this.transformArraySizesToStyle(cols),
         gridTemplateRows: this.transformArraySizesToStyle(rows)
      };
   }

   transformArraySizesToStyle(arraySizes) {
      return _.reduce(arraySizes, (prev, next) => prev + ' ' + next + 'px', '');
   }

   render() {
      const resizerBoxes = _.map(this.props.panelLayout.components, (el, key) => this.createResizeBox(el, key));

      return <div
         className="app"
         onMouseMove={this.appResize.bind(this)}
         onMouseUp={this.stopResizing.bind(this)}
         style={this.calculateGridStyles(this.props.panelLayout.columnSizes, this.props.panelLayout.rowSizes)}>
         {resizerBoxes}
      </div>;
   }
}

function mapStateToProps(state) {
   return {
      panelLayout: state.panelLayout
   };
}

export default connect(
   mapStateToProps,
   actions
)(PanelResizer);
