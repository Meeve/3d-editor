import { combineReducers } from 'redux';
import meshes from './allMeshes.js';
import selectedMesh from './selectedMesh.js';
import panelLayout from "./panelLayout";

const rootReducer = combineReducers({
  meshes, selectedMesh, panelLayout
});

export default rootReducer;
