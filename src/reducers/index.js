import { combineReducers } from 'redux';
import meshes from './allMeshes.js';
import selectedMesh from './selectedMesh.js';

const rootReducer = combineReducers({
  meshes, selectedMesh
});

export default rootReducer;
