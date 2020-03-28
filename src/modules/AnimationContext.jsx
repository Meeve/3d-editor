import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from "react-redux";
import { addCube, mergeMeshesUpdate } from '../actions/index';
import _ from 'lodash';

const AnimationContext = React.createContext();

const keyFramesHooks = () => {
    const [keyFrames, setKeyFrames] = useState(
        [
        //     {
        //     frame: 25,
        //     objects: {
        //         1: {
        //             id: 1,
        //             properties: {
        //                 x: 1, z: 1, y: 0, ry: 0,
        //             }
        //         }
        //     }
        // }, {
        //     frame: 40,
        //     objects: {
        //         1: {
        //             id: 1,
        //             properties: {
        //                 x: 10, z: 10, y: 10, ry: 12.56
        //             }
        //         }
        //     }
        // }
    ]
    );

    const addKeyFrame = keyFrame => {
        setKeyFrames([
            ...keyFrames,
            keyFrame
        ].sort((a,b) => a.frame - b.frame));
    }

    return {
        keyFrames,
        addKeyFrame
    }
}

export const AnimationProvider = ({children}) => {
    const { keyFrames, addKeyFrame } = keyFramesHooks();
    const [animationInterval, setAnimationInterval] = useState(null);
    const dispatch = useDispatch();

    const [currentFrame, setCurrentFrame] = useState(0);
    const currentFrameRef = useRef(0);
    const updateCurrentFrame = value => {
        setCurrentFrame(value);
        currentFrameRef.current = value;
    }

    const [isAnimationTurnOn, setIsAnimationTurnOn] = useState(false);
    const isAnimationTurnOnRef = useRef(false);
    const updateIsAnimationTurnOn = value => {
        setIsAnimationTurnOn(value);
        isAnimationTurnOnRef.current = value;
    }
    
    const [firstFrame, setFirstFrame] = useState(0);
    const firstFrameRef = useRef(0);
    const updateFirstFrame = value => {
        setFirstFrame(value);
        firstFrameRef.current = value;
    }

    const [lastFrame, setLastFrame] = useState(50);
    const lastFrameRef = useRef(50);
    const updateLastFrame = value => {
        setLastFrame(value);
        lastFrameRef.current = value;
    }

    const surroundKeyFramesWithBorderFrames = () => {
        let frames = keyFrames;

        if (frames[0].frame > firstFrameRef.current) {
            frames = [{
                ...frames[0],
                frame: firstFrameRef.current
            }, ...frames];
        }

        if (frames[frames.length - 1].frame < lastFrameRef.current) {
            frames = [...frames, {
                ...frames[frames.length - 1],
                frame: lastFrameRef.current
            }];
        }

        return frames;
    }

    const findSurroundingKeyFrames = (frames) => {
        for(let i = 0; i < frames.length - 1; i++) {
            const previousKeyFrame = frames[i];
            const nextKeyFrame = frames[i + 1];

            if(previousKeyFrame.frame <= currentFrameRef.current &&
                nextKeyFrame.frame > currentFrameRef.current) {
                    return { 
                        previousKeyFrame,
                        nextKeyFrame
                    }; 
            }
        }
    }

    const getPropertiesFromKeyFrame = keyFrame => _.mapValues(keyFrame.objects, object => object.properties);

    const moveObjectsToCurrentFrame = () => {
        const frames = surroundKeyFramesWithBorderFrames();

        if(currentFrameRef.current <= firstFrameRef.current) {
            const newMeshesProperties = getPropertiesFromKeyFrame(frames[0]);
            dispatch(mergeMeshesUpdate(newMeshesProperties));
            return;
        }

        if(currentFrameRef.current >= lastFrameRef.current) {
            const newMeshesProperties = getPropertiesFromKeyFrame(frames[frames.length - 1]);
            dispatch(mergeMeshesUpdate(newMeshesProperties));
            return;
        }

        const { previousKeyFrame, nextKeyFrame } = findSurroundingKeyFrames(frames);

        // algorithm for changing elements
        const framesAmount = nextKeyFrame.frame - previousKeyFrame.frame;
        const proportion = (currentFrameRef.current - previousKeyFrame.frame) / framesAmount;
        
        const newMeshesProperties = _.mapValues(previousKeyFrame.objects, (object, key) => {
            const startMeshProperties = previousKeyFrame.objects[key].properties;
            const targetMeshProperties = nextKeyFrame.objects[key].properties;
            
            return _.mapValues(object.properties, (property, key) => {
                return startMeshProperties[key] + (targetMeshProperties[key] - startMeshProperties[key]) * proportion;
            });
        });
        
        dispatch(mergeMeshesUpdate(newMeshesProperties));
    }

    const startAnimation = () => {
        if(!isAnimationTurnOnRef.current) {
            updateIsAnimationTurnOn(true);
            setAnimationInterval(setInterval(() => {
                if(currentFrameRef.current >= lastFrameRef.current) {
                    updateCurrentFrame(firstFrameRef.current);
                } else if (currentFrameRef.current < firstFrameRef.current) {
                    updateCurrentFrame(firstFrameRef.current);
                } else {
                    updateCurrentFrame(currentFrameRef.current + 1);
                }
                if(keyFrames.length > 0) {
                    moveObjectsToCurrentFrame();
                }
            }, 1000 / 24));
        }
    }

    const changeCurrentFrame = newCurrentFrame => {
        updateCurrentFrame(newCurrentFrame);

        if(keyFrames.length > 0) {
            moveObjectsToCurrentFrame();
        }
    }

    const stopAnimation = () => {
        updateIsAnimationTurnOn(false);
        clearInterval(animationInterval);
    }

    useEffect(() => {
        dispatch(addCube());
    }, []);
    
    return (<AnimationContext.Provider
        value={{
            startAnimation,
            stopAnimation,

            changeCurrentFrame,
            currentFrame,

            firstFrame,
            updateFirstFrame,

            lastFrame,
            updateLastFrame,

            isAnimationTurnOn,
            keyFrames,
            addKeyFrame
        }}
    >
        {children}
    </AnimationContext.Provider>);
}

export default AnimationContext;