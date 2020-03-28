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
    const selectedMesh = useSelector(state => state.selectedMesh);

    const addNewFrame = () => {
        if(selectedMesh) {
            animation.addKeyFrame({
                frame: animation.currentFrame,
                objects: {
                    [selectedMesh.id]: {
                        id: selectedMesh.id,
                        properties: {
                            ...getLocationProperties(selectedMesh)
                        }
                    }
                }
            })
        }
    }

    return <button onClick={addNewFrame}>Dodaj klatke</button>
}