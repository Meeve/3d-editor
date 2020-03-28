import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import AnimationContext from '../../modules/AnimationContext';

const locationKeyFrame = ['x', 'y', 'z', 'ry', 'rz', 'rx'];

const getLocationProperties = mesh => {
    let output = {};
    for (let prop of locationKeyFrame) {
        output[prop] = mesh[prop];
    }
    return output;
}

export const DopeSheetStrip = () => {
    const animation = useContext(AnimationContext);
    const selectedMeshes = useSelector(state => state.selectedMeshes);
    const meshes = useSelector(state => state.meshes);

    const addNewFrame = () => {
        if(selectedMeshes.length > 0) {
            const selectedMeshId = selectedMeshes[0];
            animation.addKeyFrame({
                frame: animation.currentFrame,
                objects: {
                    [selectedMeshId]: {
                        id: selectedMeshId,
                        properties: {
                            ...getLocationProperties(meshes[selectedMeshId])
                        }
                    }
                }
            })
        }
    }

    return <button onClick={addNewFrame}>Dodaj klatke</button>
}