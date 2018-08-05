import React from 'react';
import ViewSelector from "./viewSelector";
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

    getComponentWithUpdatedColumnRezisedElement(components, element, rightComponent) {
        return _.map(components, component => {
            if(component == element)
                component.colEnd = rightComponent.colEnd;

            return component;
        });
    }

    getComponentWithUpdatedRowRezisedElement(components, element, rightComponent) {
        return _.map(components, component => {
            if(component == element)
                component.rowStart = rightComponent.rowStart;

            return component;
        });
    }

    wasUpperLeave(targetBoundingRect, event) {
        return targetBoundingRect.top >= event.pageY
    }

    handleUpperLeave(element) {
        const upperComponent = this.getUpperSiblingComponentWithSameWidth(element);
        const components = this.calculateNewRowPlaces(element.rowStart);
        const componentWithUpdatedRezisedElement = this.getComponentWithUpdatedRowRezisedElement(components, element, upperComponent);
        
        this.props.updateComponents(componentWithUpdatedRezisedElement);
        this.props.removeComponent(upperComponent);
    }

    wasRightLeave(targetBoundingRect, event) {
        return event.pageX > targetBoundingRect.left + targetBoundingRect.width;ss
    }
    
    handleRightLeave(element) {
        const rightComponent = this.getRightSiblingComponentWithSameHeight(element);
        const components = this.calculateNewColumnPlaces(element.colEnd);
        const componentWithUpdatedRezisedElement = this.getComponentWithUpdatedColumnRezisedElement(components, element, rightComponent);

        this.props.updateComponents(componentWithUpdatedRezisedElement);
        this.props.removeComponent(rightComponent);
    }

    multiplayerMouseLeave(element, event) {
        const targetBoundingRect = event.target.getBoundingClientRect();

        if(this.state.panelMultiplayer) {
            if (targetBoundingRect.top + targetBoundingRect.height <= event.pageY) {
                const rows = this.state.rows.slice(0, element.rowStart - 1).concat([0, ...this.state.rows.slice(element.rowStart - 1)]);
                const newComponent = {
                    ...element,
                    rowEnd: element.rowStart + 1,
                    element: <ViewSelector/>
                };
                let rowStart = element.rowStart;
                const newComponents = _.map(this.state.components, component => {
                    if (component.rowStart > rowStart || component == element)
                        component.rowStart++;
                    if (component.rowEnd > element.rowStart || component == element)
                        component.rowEnd++;
                    return component;
                });
    
                this.setState({
                    rows,
                    appStyles: {
                        ...this.state.appStyles,
                        gridTemplateRows: _.reduce(rows, (prev, next) => prev + " " + next + "px", "")
                    },
                    panelMultiplayer: false,
                    components: newComponents.concat(newComponent)
                }, this.bottomResize.bind(this, newComponent.rowStart - 1, {...event}));
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
                 onMouseLeave={this.multiplayerMouseLeave.bind(this, this.props.children)}>  </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        panelLayout: state.panelLayout
    }
}

export default connect(mapStateToProps, actions)(PanelManipulator);