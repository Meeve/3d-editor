import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeScale, addCube, addPlane, addPyramid, addIcosa, selectMesh, changeMeshProp, unselectMesh } from '../../actions/index.js';
import { NumberField } from '../../components/inputs/NumberField';
import _ from 'lodash';

class Scene extends Component {
   constructor(props) {
      super(props);

      this.state = {
         scale: 1
      };
   }

   changeProp = (prop, value) => {
      this.props.changeMeshProp(this.props.selectedMeshes[0], prop, value);
   };

   isMeshSelected = id => this.props.selectedMeshes.filter(selectedMeshId => selectedMeshId === id).length > 0;

   toggleSelection = (id) => {
      if (this.isMeshSelected(id)) {
         this.props.unselectMesh(id);
      } else {
         this.props.selectMesh(id);
      }
   }

   render() {
      let controls = 'Not selected yet';
      
      if (this.props.selectedMeshes.length > 0) {
         const selectedMesh = this.props.meshes[this.props.selectedMeshes[0]];
         controls = (
            <div>
               <div className="row">
                  <h2>Location</h2>
                  <NumberField
                     onChange={value => this.changeProp('x', value)}
                     value={selectedMesh.x}
                     label="Move X"
                  />
                  <NumberField
                     onChange={value => this.changeProp('y', value)}
                     value={selectedMesh.y}
                     label="Move Y"
                  />
                  <NumberField
                     onChange={value => this.changeProp('z', value)}
                     value={selectedMesh.z}
                     label="Move Z"
                  />
               </div>
               <div className="row">
                  <h2>Rotation</h2>
                  <NumberField
                     onChange={value => this.changeProp('rx', value)}
                     value={selectedMesh.rx}
                     label="X Axis"
                  />
                  <NumberField
                     onChange={value => this.changeProp('ry', value)}
                     value={selectedMesh.ry}
                     label="Y Axis"
                  />
                  <NumberField
                     onChange={value => this.changeProp('rz', value)}
                     value={selectedMesh.rz}
                     label="Z Axis"
                  />
               </div>
            </div>
         );
      }

      return (
         <div className="col-md-6">
            <div className="row">
               <button type="button" className="btn btn-default" onClick={this.props.addCube.bind(this)}>
                  Add Cube
               </button>
               &nbsp;
               <button type="button" className="btn btn-default" onClick={this.props.addPlane.bind(this)}>
                  Add Plane
               </button>
               &nbsp;
               <button type="button" className="btn btn-default" onClick={this.props.addPyramid.bind(this)}>
                  Add Pyramid
               </button>
               &nbsp;
               <button type="button" className="btn btn-default" onClick={this.props.addIcosa.bind(this)}>
                  Add Icosahedron
               </button>
            </div>
            <div className="row">
               <ul>
                  {_.map(this.props.meshes, el => (
                     <li 
                        key={el.id} 
                        className={(this.isMeshSelected(el.id) ? 'activeMesh' : "") + " " + (this.props.selectedMeshes[0] === el.id ? "mainSelection" : '')}
                        onClick={() => this.toggleSelection(el.id)} 
                        title={JSON.stringify(el)}>
                        #{el.id} - {el.name}
                     </li>
                  ))}
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
      selectedMeshes: state.selectedMeshes
   };
}

function mapDispatchToProps(dispatch) {
   return bindActionCreators(
      { changeScale, addCube, addPlane, addPyramid, addIcosa, selectMesh, changeMeshProp, unselectMesh },
      dispatch
   );
}

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(Scene);
