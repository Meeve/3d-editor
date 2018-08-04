import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ViewSelector from "./viewSelector";
import PanelManipulator from './PanelManipulator';
import * as actions from '../actions/index';

class PanelResizer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isUpDownResizing: false,
            isLeftRightResizing: false,
            appStyles: this.calculateGridStyles(this.props.panelLayout.columnSizes, this.props.panelLayout.rowSizes)
        };
    }

    calculateGridStyles(cols, rows) {
        return {
            gridTemplateColumns: this.transformArraySizesToStyle(cols),
            gridTemplateRows: this.transformArraySizesToStyle(rows)
        };
    }

    transformArraySizesToStyle(arraySizes) {
        return _.reduce(arraySizes, (prev, next) => prev + " " + next + "px", "");
    }

    leftResize(colNumber, e) {
        this.setState({
            isLeftRightResizing: true,
            xMouseClick: e.pageX,
            activeColumn: colNumber,
            prevActiveColumnValue: this.props.panelLayout.columnSizes[colNumber],
            prevSibilingColumnValue: this.props.panelLayout.columnSizes[colNumber + 1]
        });
    }

    bottomResize(rowNumber, e) {
        this.setState({
            isUpDownResizing: true,
            yMouseClick: e.pageY,
            activeRow: rowNumber,
            prevActiveRowValue: this.props.panelLayout.rowSizes[rowNumber],
            prevSibilingRowValue: this.props.panelLayout.rowSizes[rowNumber + 1]
        });
    }

    diagonallyResize(rowNumber, colNumber, e) {
        this.leftResize(colNumber, e);
        this.bottomResize(rowNumber, e);
    }

    appResize(e) {
        let columns = Object.assign([], this.props.panelLayout.columnSizes);
        let rows = Object.assign([], this.props.panelLayout.rowSizes);
        
        if (this.state.isLeftRightResizing) {
            columns[this.state.activeColumn] = this.state.prevActiveColumnValue + e.pageX - this.state.xMouseClick;
            columns[this.state.activeColumn + 1] = this.state.prevSibilingColumnValue - (e.pageX - this.state.xMouseClick);
            this.props.changeColumnSizes(columns);
        }

        if (this.state.isUpDownResizing) {
            rows[this.state.activeRow] = this.state.prevActiveRowValue + e.pageY - this.state.yMouseClick;
            rows[this.state.activeRow + 1] = this.state.prevSibilingRowValue - (e.pageY - this.state.yMouseClick);
            this.props.changeRowSizes(rows);
        }

        if(this.state.isLeftRightResizing || this.state.isUpDownResizing) {
            this.setState({
                appStyles: this.calculateGridStyles(columns, rows)
            });
        }
    }

    stopResizing() {
        this.setState({
            isLeftRightResizing: false,
            isUpDownResizing: false
        });
    }

    isLastColumn(colCounter) {
        return colCounter == this.props.panelLayout.columnSizes.length - 1 
    }

    isLastRow(rowCounter) {
        return rowCounter == this.props.panelLayout.rowSizes.length - 1
    }

    getLeftResizer(colCounter) {
        return this.isLastColumn(colCounter) ? <div></div> :
            <div className="leftResizer" onMouseDown={this.leftResize.bind(this, colCounter)}></div>;
    }

    getBottomResizer(rowCounter) {
        return this.isLastRow(rowCounter) ? <div></div> :
            <div className="bottomResizer" onMouseDown={this.bottomResize.bind(this, rowCounter)}></div>;
    }

    getDiagonalResizer(colCounter, rowCounter) {
        return !this.isLastColumn(colCounter) && !this.isLastRow(rowCounter) ?
            <div className="diagonalResizer"
                 onMouseDown={this.diagonallyResize.bind(this, rowCounter, colCounter)}></div> : <div></div>;
    }

    getElementWithResizers(el) {
        const colCounter = el.colEnd - 2;
        const rowCounter = el.rowEnd - 2;
        
        return (
            <React.Fragment>
                {el.element}
                {this.getLeftResizer(colCounter)}
                {this.getBottomResizer(rowCounter)}
                {this.getDiagonalResizer(colCounter, rowCounter)}
            </React.Fragment>
        );
    }

    getResizerStyle(el) {
        return {
            gridColumn: `${el.colStart} / ${el.colEnd}`,
            gridRow: `${el.rowStart} / ${el.rowEnd}`
        };
    }

    createResizeBox(el, key) {
        return <div className="resizerBox" key={key} style={this.getResizerStyle(el)}>
            {this.getElementWithResizers(el)}
            <PanelManipulator>
                { el }
            </PanelManipulator>
        </div>
    }

    render() {
        const resizerBoxes = _.map(this.props.panelLayout.components, (el, key) => this.createResizeBox(el, key));
        
        return (
            <div className="app" onMouseMove={this.appResize.bind(this)} onMouseUp={this.stopResizing.bind(this)}
                 style={this.state.appStyles}>
                 {resizerBoxes}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        panelLayout: state.panelLayout
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...actions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelResizer);