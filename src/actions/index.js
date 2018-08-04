import { CHANGE_COLUMN_SIZES, CHANGE_ROW_SIZES } from "./types";

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