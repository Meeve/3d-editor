import createCube from './mesh/cube.js';

export default (state = {}, action) => {
    switch (action.type) {
        case 'addCube':
            return addCube(state);

        case 'changeMeshProp': {
            return changeMeshProp(state, action);
        }
    }
    return state;
}

function addCube(state) {
    let cube = createCube();
    cube.id = Math.random();
    return {
        [cube.id]: cube,
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
