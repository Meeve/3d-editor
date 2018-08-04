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

export function addPlane() {
    return {
        type: 'addPlane',
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
