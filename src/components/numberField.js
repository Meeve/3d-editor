import React, { Component } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeScale, addCube, selectMesh, changeMeshProp } from '../actions/index.js';

class NumberField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prop: props.prop,
            value: props.selectedMesh[props.prop]
        };

        window.addEventListener('mouseup', () => {
            this.setState({
                mouseDown: false
            });
        });
    }
    
    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.selectedMesh[this.props.prop]
        });
    }

    changeProp(e) {
        this.setState({
            value: e.target.value
        });

        if(!isNaN(e.target.value) && e.target.value !== "") {
            this.props.changeMeshProp(this.props.selectedMesh.id, this.props.prop, parseInt(e.target.value));
        }
    }

    mouseMove(e) {
        if(this.state.mouseDown && this.state.isMouseIn) {
            let offset = this.state.prevValue + ( + e.pageX - this.state.clickedX) / 20;
            this.setState({
                value: offset
            });
            this.props.changeMeshProp(this.props.selectedMesh.id, this.props.prop, offset );
        }
    }

    render() {
        return (
        <div>
            {this.state.prop}
            <input 
                onMouseDown={ e => {this.setState({ mouseDown: true, clickedX: e.pageX, prevValue: parseInt(this.state.value) });} } 
                onMouseMove={ this.mouseMove.bind(this) }
                onMouseLeave={ e => this.setState({ isMouseIn: false }) }
                onMouseEnter={ e => this.setState({ isMouseIn: true }) }
                onChange={ this.changeProp.bind(this)}
                value={ this.state.value }
                type="number"/> 
        </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        selectedMesh: state.selectedMesh
    }
}

  function mapDispatchToProps(dispatch) {
    return bindActionCreators({ changeMeshProp }, dispatch);
  }
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(NumberField);