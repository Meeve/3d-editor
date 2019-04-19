import React, { Component } from 'react';
import Dropdown from '../../components/dropdown/Dropdown';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addCube, addPlane, addPyramid, addIcosa, addSphere } from '../../actions/index.js';

class AddDropdown extends Component {
   render() {
      return (
         <Dropdown content="Add" openAction="click">
            <Dropdown content="Mesh" direction="right">
               <button type="button" className="dropdownButton" onClick={this.props.addCube.bind(this)}>
                  Add Cube
               </button>
               <button type="button" className="dropdownButton" onClick={this.props.addPlane.bind(this)}>
                  Add Plane
               </button>
               <button type="button" className="dropdownButton" onClick={this.props.addPyramid.bind(this)}>
                  Add Pyramid
               </button>
               <button type="button" className="dropdownButton" onClick={this.props.addIcosa.bind(this)}>
                  Add Icosahedron
               </button>
               <button type="button" className="dropdownButton" onClick={this.props.addSphere.bind(this)}>
                  Add Sphere
               </button>
            </Dropdown>
         </Dropdown>
      );
   }
}

function mapDispatchToProps(dispatch) {
   return bindActionCreators({ addCube, addPlane, addPyramid, addIcosa, addSphere }, dispatch);
}

export default connect(
   null,
   mapDispatchToProps
)(AddDropdown);
