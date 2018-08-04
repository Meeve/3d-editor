export default (state = null, action) => {
    switch (action.type) {
        case 'selectMesh':
            return action.payload;

        case 'changeMeshProp': {
            return Object.assign({}, state, {
                [action.payload.prop]: action.payload.value
            });
        }

    }
    return state;
}
