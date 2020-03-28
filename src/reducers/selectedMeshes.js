export const selectedMeshes = (state = [], action) => {
    switch (action.type) {
        case 'selectMesh':
            return [...state, action.payload];
        case 'unselectMesh':
            return [...state.filter(id => id != action.payload)]
    }
    return state;
}
