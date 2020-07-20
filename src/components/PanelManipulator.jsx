import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class PanelManipulator extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         panelMultiplayer: false
      };
   }

   getUpperSiblingComponentWithSameWidth(element) {
      return _.filter(this.props.panelLayout.components, potentialUpperComponent => {
         return element.rowStart == potentialUpperComponent.rowEnd &&
            element.colStart == potentialUpperComponent.colStart &&
            element.colEnd == potentialUpperComponent.colEnd;
      })[0];
   }

   getRightSiblingComponentWithSameHeight(element) {
      return _.filter(this.props.panelLayout.components, potentialUpperComponent => {
         return element.colEnd == potentialUpperComponent.colStart &&
            element.rowStart == potentialUpperComponent.rowStart &&
            element.rowEnd == potentialUpperComponent.rowEnd;
      })[0];
   }

   updateRowGridDefinition(previousRowStart) {
      const indexInRowArray = previousRowStart - 1;
      this.props.removeRow(indexInRowArray);
   }

   isRowNotNeededAnymore(row) {
      return _.filter(this.props.panelLayout.components, component => component.rowStart == row || component.rowEnd == row).length <= 2;
   }

   updateColumnGridDefinition(nextColumnStart) {
      const indexInColumnArray = nextColumnStart - 1;
      this.props.removeColumn(indexInColumnArray);
   }

   isColumnNotNeededAnymore(column) {
      return _.filter(this.props.panelLayout.components, component => component.colStart == column || component.colEnd == column).length <= 2;
   }

   calculateNewRowPlaces(previousRowStart) {
      if (this.isRowNotNeededAnymore(previousRowStart)) {
         this.updateRowGridDefinition(previousRowStart);

         return _.map(this.props.panelLayout.components, component => {
            if (component.rowStart > previousRowStart) {
               component.rowStart--;
            }
            if (component.rowEnd > previousRowStart) {
               component.rowEnd--;
            }
            return component;
         });
      }
      return _.map(this.props.panelLayout.components, component => component);
   }

   calculateNewColumnPlaces(nextColumnStart) {
      if (this.isColumnNotNeededAnymore(nextColumnStart)) {
         this.updateColumnGridDefinition(nextColumnStart);

         return _.map(this.props.panelLayout.components, component => {
            if (component.colStart > nextColumnStart) {
               component.colStart--;
            }
            if (component.colEnd > nextColumnStart) {
               component.colEnd--;
            }
            return component;
         });
      }
      return _.map(this.props.panelLayout.components, component => component);
   }

   getComponentWithUpdatedColumnResizedElement(components, element, rightComponent) {
      return _.map(components, component => {
         if (component == element) {
            component.colEnd = rightComponent.colEnd;
         }

         return component;
      });
   }

   getComponentWithUpdatedRowResizedElement(components, element, rightComponent) {
      return _.map(components, component => {
         if (component == element) {
            component.rowStart = rightComponent.rowStart;
         }

         return component;
      });
   }

   wasUpperLeave(targetBoundingRect, event) {
      return targetBoundingRect.top >= event.pageY
   }

   handleUpperLeave(element) {
      const upperComponent = this.getUpperSiblingComponentWithSameWidth(element);
      if (upperComponent) {
         const components = this.calculateNewRowPlaces(element.rowStart);
         const componentWithUpdatedResizedElement = this.getComponentWithUpdatedRowResizedElement(components, element, upperComponent);

         this.props.updateComponents(componentWithUpdatedResizedElement);
         this.props.removeComponent(upperComponent);
      }
   }

   wasRightLeave(targetBoundingRect, event) {
      return event.pageX > targetBoundingRect.left + targetBoundingRect.width;
      ss
   }

   handleRightLeave(element) {
      const rightComponent = this.getRightSiblingComponentWithSameHeight(element);
      if (rightComponent) {
         const components = this.calculateNewColumnPlaces(element.colEnd);
         const componentWithUpdatedResizedElement = this.getComponentWithUpdatedColumnResizedElement(components, element, rightComponent);

         this.props.updateComponents(componentWithUpdatedResizedElement);
         this.props.removeComponent(rightComponent);
      }
   }

   wasBottomLeave(targetBoundingRect, event) {
      return targetBoundingRect.top + targetBoundingRect.height <= event.pageY;
   }

   handleBottomLeave(element, event) {
      const indexInRowArray = element.rowStart - 1;
      this.props.addRow(indexInRowArray);

      const newComponent = {
         ...element,
         rowEnd: element.rowStart + 1
      };

      const prevElementRow = element.rowStart;
      const newComponents = _.map(this.props.panelLayout.components, component => {
         if (component.rowStart > prevElementRow || element == component) {
            component.rowStart++;
         }
         if (component.rowEnd > prevElementRow) {
            component.rowEnd++;
         }
         return component;
      });

      this.props.updateComponents(newComponents.concat(newComponent));
      this.props.startBottomUpResizing(prevElementRow - 1, event.pageY);
   }

   wasLeftLeave(targetBoundingRect, event) {
      return targetBoundingRect.left >= event.pageX;
   }

   handleLeftLeave(element, event) {
      const indexInColumnArray = element.colEnd - 1;
      this.props.addColumn(indexInColumnArray);

      const newComponent = {
         ...element,
         colStart: element.colEnd,
         colEnd: element.colEnd + 1
      };

      const prevElementCol = element.colEnd;
      const newComponents = _.map(this.props.panelLayout.components, component => {
         if (component.colStart >= element.colEnd) {
            component.colStart++;
         }
         if (component.colEnd >= element.colEnd) {
            component.colEnd++;
         }
         if (component == element) {
            component.colEnd--;
         }
         return component;
      });

      this.props.updateComponents(newComponents.concat(newComponent));
      this.props.startLeftRightResizing(prevElementCol - 2, event.pageX);

   }

   multiplayerMouseLeave(element, event) {
      const targetBoundingRect = event.target.getBoundingClientRect();

      if (this.state.panelMultiplayer) {
         if (this.wasBottomLeave(targetBoundingRect, event)) {
            this.handleBottomLeave(element, event);
         } else if (this.wasLeftLeave(targetBoundingRect, event)) {
            this.handleLeftLeave(element, event);
         } else if (this.wasUpperLeave(targetBoundingRect, event)) {
            this.handleUpperLeave(element);
         } else if (this.wasRightLeave(targetBoundingRect, event)) {
            this.handleRightLeave(element);
         }

         this.setState({
            panelMultiplayer: false
         });
      }
   }

   multiplayerMouseDown() {
      this.setState({
         panelMultiplayer: true
      });
   }

   render() {
      return (
         <div className="multiplayer" onMouseDown={this.multiplayerMouseDown.bind(this)}
              onMouseLeave={this.multiplayerMouseLeave.bind(this, this.props.children)}></div>
      );
   }
}

function mapStateToProps(state) {
   return {
      panelLayout: state.panelLayout
   }
}

export default connect(mapStateToProps, actions)(PanelManipulator);