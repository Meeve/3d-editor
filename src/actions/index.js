import {
   CHANGE_COLUMN_SIZES,
   CHANGE_ROW_SIZES,
   REMOVE_COMPONENT,
   REMOVE_ROW,
   UPDATE_COMPONENTS,
   REMOVE_COLUMN,
   ADD_ROW,
   ADD_COLUMN,
   START_BOTTOM_UP_RESIZING,
   STOP_RESIZING,
   TRANSFORM_ROW_SIZES_BETWEEN_SIBLINGS,
   START_LEFT_RIGHT_RESIZING,
   TRANSFORM_COLUMN_SIZES_BETWEEN_SIBLINGS,
   CHANGE_TIMELINE_PROPERTY,
   CHANGE_ANIMATION_STATE,
   MERGE_MESHES_UPDATE
} from './types';

export function changeScale(scale) {
   return {
      type: 'changeScale',
      payload: scale
   };
}

export function addCube() {
   return {
      type: 'addCube',
      payload: {}
   };
}

export function addPlane() {
   return {
      type: 'addPlane',
      payload: {}
   };
}

export function addPyramid() {
   return {
      type: 'addPyramid',
      payload: {}
   };
}

export function addIcosa() {
   return {
      type: 'addIcosa',
      payload: {}
   };
}

export function addSphere() {
   return {
      type: 'addSphere',
      payload: {}
   };
}

export function selectMesh(id) {
   return {
      type: 'selectMesh',
      payload: id
   };
}

export function unselectMesh(id) {
   return {
      type: 'unselectMesh',
      payload: id
   };
}

export function changeMeshProp(id, prop, value) {
   return {
      type: 'changeMeshProp',
      payload: {
         id,
         prop,
         value
      }
   };
}

export function mergeMeshesUpdate(newMeshesState) {
   return {
      type: MERGE_MESHES_UPDATE,
      payload: newMeshesState
   }
}

export function changeColumnSizes(newColumnSizes) {
   return {
      type: CHANGE_COLUMN_SIZES,
      payload: newColumnSizes
   };
}

export function changeRowSizes(newRowSizes) {
   return {
      type: CHANGE_ROW_SIZES,
      payload: newRowSizes
   };
}

export function removeComponent(componentToDelete) {
   return {
      type: REMOVE_COMPONENT,
      componentToDelete
   };
}

export function removeRow(rowToRemove) {
   return {
      type: REMOVE_ROW,
      rowToRemove
   };
}

export function updateComponents(components) {
   return {
      type: UPDATE_COMPONENTS,
      components
   };
}

export function removeColumn(columnToRemove) {
   return {
      type: REMOVE_COLUMN,
      columnToRemove
   };
}

export function addRow(index) {
   return {
      type: ADD_ROW,
      index
   };
}

export function addColumn(index) {
   return {
      type: ADD_COLUMN,
      index
   };
}

export function startBottomUpResizing(activeRow, yMouseClick) {
   return {
      type: START_BOTTOM_UP_RESIZING,
      activeRow,
      yMouseClick
   };
}

export function startLeftRightResizing(activeColumn, xMouseClick) {
   return {
      type: START_LEFT_RIGHT_RESIZING,
      activeColumn,
      xMouseClick
   };
}

export function transformRowSizesBetweenSiblings(yOffset) {
   return {
      type: TRANSFORM_ROW_SIZES_BETWEEN_SIBLINGS,
      yOffset
   };
}

export function transformColumnSizesBetweenSiblings(xOffset) {
   return {
      type: TRANSFORM_COLUMN_SIZES_BETWEEN_SIBLINGS,
      xOffset
   };
}

export function stopResizing() {
   return {
      type: STOP_RESIZING
   };
}