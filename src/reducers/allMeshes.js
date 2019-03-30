import plane from "./mesh/plane";
import cube from "./mesh/cube";
import pyramid from "./mesh/pyramid";
import icosahedron from "./mesh/icosahedron";

export default (state = {}, action) => {
    switch (action.type) {
        case 'addCube':
            return addMesh(cube(), state, "New cube");
        case 'addPlane':
            return addMesh(plane(), state, "New plane");
        case 'addPyramid':
            return addMesh(pyramid(), state, "New pyramid");
        case 'addIcosa':
            return addMesh(icosahedron(), state, "New icosahedron");

        case 'changeMeshProp': {
            return changeMeshProp(state, action);
        }
    }
    return state;
}

let lastId = 1;

function addMesh(mesh, state, defaultName) {
    mesh.id = lastId++;
<<<<<<< HEAD

=======
    mesh.name = defaultName;
>>>>>>> master
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
