import React, { Component } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeScale, addCube, selectMesh, changeMeshProp } from '../actions/index.js';
import NumberField from './numberField.js';
import _ from 'lodash';

class Scene extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scale: 1
    }
  }

  scaleChange(event) {
    this.setState({
      scale: event.target.value
    });

    this.props.changeScale(event.target.value);
  }

  changeProp(prop, e) {
    if(!isNaN(e.target.value)) {
      this.props.changeMeshProp(this.props.selectedMesh.id, prop, parseInt(e.target.value));
    }
  }

  render() {
    let controls = "Not selected yet";
    if(this.props.selectedMesh) {
      controls = (
        <div>
          <div className="row">
            <h2>Localization</h2>
            <NumberField  prop="x" />
            <NumberField  prop="y" />
            <NumberField  prop="z" />
          </div>
          <div className="row">
            <h2>Obrót</h2>
            <NumberField  prop="rx" />
            <NumberField  prop="ry" />
            <NumberField  prop="rz" />
          </div>
        </div>
      );
    }

    return (
      <div className="col-md-6">
        <div className="row">
          <button type="button" className="btn btn-default" onClick={ this.props.addCube.bind(this) } >Add Cube</button>
        </div>
        <div className="row">
          <ul>
            { _.map(this.props.meshes, el => <li onClick={ this.props.selectMesh.bind(this, el) } >test</li>)}
          </ul>
        </div>
        {controls}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
      meshes: state.meshes,
      selectedMesh: state.selectedMesh
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeScale, addCube, selectMesh, changeMeshProp }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Scene);