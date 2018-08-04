import plane from "./mesh/plane";
import cube from "./mesh/cube";

export default (state = {}, action) => {
    switch (action.type) {
        case 'addCube':
            return addMesh(cube(), state);

        case 'addPlane':
            return addMesh(plane(), state);

        case 'changeMeshProp': {
            return changeMeshProp(state, action);
        }
    }
    return state;
}

function addMesh(mesh, state) {
    mesh.id = Math.random();
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
