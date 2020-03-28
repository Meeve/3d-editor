import plane from './mesh/plane';
import cube from './mesh/cube';
import pyramid from './mesh/pyramid';
import icosahedron from './mesh/icosahedron';
import sphere from './mesh/sphere';
import _ from 'lodash';
import { MERGE_MESHES_UPDATE } from '../actions/types';

export default (state = {}, action) => {
   switch (action.type) {
      case 'addCube':
         return addMesh(cube(), state, 'New cube');
      case 'addPlane':
         return addMesh(plane(), state, 'New plane');
      case 'addPyramid':
         return addMesh(pyramid(), state, 'New pyramid');
      case 'addIcosa':
         return addMesh(icosahedron(), state, 'New icosahedron');
      case 'addSphere':
         return addMesh(sphere(), state, 'New sphere');

      case 'changeMeshProp':
         return changeMeshProp(state, action);
      case MERGE_MESHES_UPDATE: {
         return _.merge({}, state, action.payload);
      }
   }
   return state;
};

let lastId = 1;

function addMesh(mesh, state, defaultName) {
   mesh.id = lastId++;
   return {
      [mesh.id]: mesh,
      ...state
   };
}

function changeMeshProp(state, action) {
   return Object.assign({}, state, {
      [action.payload.id]: {
         ...state[action.payload.id],
         [action.payload.prop]: action.payload.value
      }
   });
}
