import React, {Component} from 'react';
import Canvas from './canvas.js';
import Panel from './scene.js';
import {ViewSelector} from "./viewSelector.js";

export default class App extends Component {
    constructor(props) {
        super(props);
        let components = [
            {element: <ViewSelector/>, colStart: 1, colEnd: 2, rowStart: 1, rowEnd: 2},
            {element: <ViewSelector/>, colStart: 2, colEnd: 4, rowStart: 1, rowEnd: 2},
            {element: <ViewSelector/>, colStart: 1, colEnd: 2, rowStart: 2, rowEnd: 4},

            {element: <ViewSelector/>, colStart: 2, colEnd: 3, rowStart: 2, rowEnd: 3},
            {element: <ViewSelector/>, colStart: 3, colEnd: 4, rowStart: 2, rowEnd: 4},
            {element: <ViewSelector/>, colStart: 2, colEnd: 3, rowStart: 3, rowEnd: 4}
        ];
        let columns = [640, 640, 640];
        let rows = [316, 316, 315];

        this.state = {
            components,
            isUpDownResizing: false,
            isLeftRightResizing: false,
            panelMultiplayer: false,
            appStyles: {
                gridTemplateColumns: _.reduce(columns, (prev, next) => prev + " " + next + "px", ""),
                gridTemplateRows: _.reduce(rows, (prev, next) => prev + " " + next + "px", "")
            },
            columns,
            rows
        };
    }

    leftResize(colNumber, e) {
        this.setState({
            isLeftRightResizing: true,
            xMouseClick: e.pageX,
            activeColumn: colNumber,
            prevValue: this.state.columns[colNumber],
            nextColPrevValue: this.state.columns[colNumber + 1]
        });
    }

    bottomResize(rowNumber, e) {
        this.setState({
            isUpDownResizing: true,
            yMouseClick: e.pageY,
            activeRow: rowNumber,
            prevRowValue: this.state.rows[rowNumber],
            nextRowPrevValue: this.state.rows[rowNumber + 1]
        });
    }

    diagonallyResize(rowNumber, colNumber, e) {
        this.leftResize(colNumber, e);
        this.bottomResize(rowNumber, e);
    }

    appResize(e) {
        let columns = this.state.columns;
        let rows = this.state.rows;

        if (this.state.isLeftRightResizing) {
            columns[this.state.activeColumn] = this.state.prevValue + e.pageX - this.state.xMouseClick;
            columns[this.state.activeColumn + 1] = this.state.nextColPrevValue - (e.pageX - this.state.xMouseClick);
        }

        if (this.state.isUpDownResizing) {
            rows[this.state.activeRow] = this.state.prevRowValue + e.pageY - this.state.yMouseClick;
            rows[this.state.activeRow + 1] = this.state.nextRowPrevValue - (e.pageY - this.state.yMouseClick);
        }

        if (this.state.isLeftRightResizing || this.state.isUpDownResizing) {
            this.setState({
                rows,
                appStyles: {
                    columns, rows,
                    gridTemplateColumns: _.reduce(columns, (prev, next) => prev + " " + next + "px", ""),
                    gridTemplateRows: _.reduce(rows, (prev, next) => prev + " " + next + "px", "")
                }
            });
        }
    }

    stopResizing() {
        this.setState({
            isLeftRightResizing: false,
            isUpDownResizing: false,
            panelMultiplayer: false
        });
    }

    multiplayerMouseLeave(element, event) {
        const targetBoundingRect = event.target.getBoundingClientRect();

        if (event.pageX < targetBoundingRect.left || event.pageX > targetBoundingRect.left + targetBoundingRect.width)
            return;

        if (this.state.panelMultiplayer && targetBoundingRect.top + targetBoundingRect.height <= event.pageY) {
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
        } else if (this.state.panelMultiplayer && targetBoundingRect.top >= event.pageY) {
            const upperComponent = _.filter(this.state.components, component => {
                return element.rowStart == component.rowEnd && element.colStart == component.colStart && element.colEnd == component.colEnd;
            })[0];
            const previousRowStart = element.rowStart;
            element.rowStart = upperComponent.rowStart;
            let components = _.filter(this.state.components, component => component != upperComponent);
            let rows = this.state.rows;

            if (_.filter(components, component => component.rowStart == previousRowStart || component.rowEnd == previousRowStart).length == 0) {
                rows[previousRowStart - 2] += rows[previousRowStart - 1];
                rows.splice(previousRowStart - 1, 1);
            }

            components = _.map(components, component => {
                if (component.rowStart > previousRowStart) {
                    component.rowStart--;
                }
                if (component.rowEnd > previousRowStart) {
                    component.rowEnd--;
                }
                return component;
            });

            this.setState({
                rows,
                components,
                panelMultiplayer: false,
                appStyles: {
                    ...this.state.appStyles,
                    gridTemplateRows: _.reduce(rows, (prev, next) => prev + " " + next + "px", "")
                }
            });
        }
    }

    multiplayerMouseDown() {
        this.setState({
            panelMultiplayer: true
        });
    }

    render() {
        const grid = _.map(this.state.components, (el, key) => {
            const colCounter = el.colEnd - 2;
            const leftResizer = colCounter != this.state.columns.length - 1 ?
                <div className="leftResizer" onMouseDown={this.leftResize.bind(this, colCounter)}></div> : "";

            const rowCounter = el.rowEnd - 2;
            const bottomResizer = rowCounter != this.state.rows.length - 1 ?
                <div className="bottomResizer" onMouseDown={this.bottomResize.bind(this, rowCounter)}></div> : "";

            const diagonalResizer = colCounter != this.state.columns.length - 1 && rowCounter != this.state.rows.length - 1 ?
                <div className="diagonalResizer"
                     onMouseDown={this.diagonallyResize.bind(this, rowCounter, colCounter)}></div> : "";

            const resizerStyle = {
                gridColumn: `${el.colStart} / ${el.colEnd}`,
                gridRow: `${el.rowStart} / ${el.rowEnd}`
            };

            return <div className="resizerBox" style={resizerStyle}>
                {el.element}{leftResizer}{bottomResizer}{diagonalResizer}
                <div className="multiplayer" onMouseDown={this.multiplayerMouseDown.bind(this)}
                     onMouseLeave={this.multiplayerMouseLeave.bind(this, el)}></div>
            </div>
        });

        return (
            <div className="app" onMouseMove={this.appResize.bind(this)} onMouseUp={this.stopResizing.bind(this)}
                 style={this.state.appStyles}>
                {grid}
            </div>
        );
    }
}
