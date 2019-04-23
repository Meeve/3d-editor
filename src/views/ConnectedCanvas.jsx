import React from 'react';
import Canvas from '../components/Canvas';
import { connect } from 'react-redux';
import _ from 'lodash';
import Mesh from '../components/Mesh';
import { getGrid } from '../reducers/mesh/grid';

class ConnectedCanvas extends React.Component {
   render() {
      return (
         <Canvas {...this.props}>
            {_.map(this.props.meshes, meshProperties => (
               <Mesh key={meshProperties.id} meshProperties={meshProperties} />
            ))}
            <Mesh meshProperties={getGrid()} />
         </Canvas>
      );
   }
}

function mapStateToProps(state) {
   return {
      meshes: state.meshes
   };
}

export default connect(mapStateToProps)(ConnectedCanvas);
