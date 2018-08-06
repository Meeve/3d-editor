import { CHANGE_COLUMN_SIZES, CHANGE_ROW_SIZES, REMOVE_COMPONENT, REMOVE_ROW, UPDATE_COMPONENTS, REMOVE_COLUMN, ADD_ROW, ADD_COLUMN } from "./types";

export function changeScale(scale) {

    return {
        type: 'changeScale',
        payload: scale
    }
}

export function addCube() {
    return {
        type: 'addCube',
        payload: {} 
    }
}

export function selectMesh(el) {
    return {
        type: 'selectMesh',
        payload: el
    }
}

export function changeMeshProp(id, prop, value) {
    return {
        type: 'changeMeshProp',
        payload: {
            id, prop, value
        }
    }
}

export function changeColumnSizes(newColumnSizes) {
    return {
        type: CHANGE_COLUMN_SIZES,
        payload: newColumnSizes
    }
}

export function changeRowSizes(newRowSizes) {
    return {
        type: CHANGE_ROW_SIZES,
        payload: newRowSizes
    }
}

export function removeComponent(componentToDelete) {
    return {
        type: REMOVE_COMPONENT,
        componentToDelete
    }
}

export function removeRow(rowToRemove) {
    return {
        type: REMOVE_ROW,
        rowToRemove
    }
}

export function updateComponents(components) {
    return {
        type: UPDATE_COMPONENTS,
        components
    }
}

export function removeColumn(columnToRemove) {
    return {
        type: REMOVE_COLUMN,
        columnToRemove
    }
}

export function addRow(index) {
    return {
        type: ADD_ROW,
        index
    }
}

export function addColumn(index) {
    return {
        type: ADD_COLUMN,
        index
    }
}

