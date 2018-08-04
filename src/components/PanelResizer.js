import React from 'react';
import { connect } from 'react-redux';

import ViewSelector from "./viewSelector";
import PanelManipulator from './PanelManipulator';

class PanelResizer extends React.Component {
    constructor(props) {
        super(props);

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

            return <div className="resizerBox" key={key} style={resizerStyle}>
                {el.element}{leftResizer}{bottomResizer}{diagonalResizer}
                <PanelManipulator>
                    { el }
                </PanelManipulator>
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

function mapStateToProps(state) {
    return {
        panelLayout: state.panelLayout
    }
}

export default connect()(PanelResizer);