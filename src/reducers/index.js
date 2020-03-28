import { combineReducers } from 'redux';
import meshes from './allMeshes.js';
import { selectedMeshes } from './selectedMeshes';
import panelLayout from './panelLayout';
import logs from './logs';

const rootReducer = combineReducers({
   meshes,
   selectedMeshes,
   panelLayout,
   logs
});

export default rootReducer;
