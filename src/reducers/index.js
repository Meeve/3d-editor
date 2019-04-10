import { combineReducers } from 'redux';
import meshes from './allMeshes.js';
import selectedMesh from './selectedMesh.js';
import panelLayout from './panelLayout';
import logs from './logs';

const rootReducer = combineReducers({
   meshes,
   selectedMesh,
   panelLayout,
   logs
});

export default rootReducer;
