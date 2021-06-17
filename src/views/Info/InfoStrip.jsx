import React, { useContext } from 'react';
import { saveAs } from 'file-saver';
import { useDispatch, useSelector } from "react-redux";
import { importFile } from "../../actions/index";
import AnimationContext from '../../modules/AnimationContext';

const InfoStrip = () => {

    const dispatch = useDispatch();
    const meshes = useSelector(state => state.meshes);
    const animation = useContext(AnimationContext);

    const saveDataToFile = () => {
        const blob = new Blob([JSON.stringify(
            {"meshes": meshes, "keyFrames": animation.keyFrames }
        )],
            { type: "text/plain;charset=utf-8" });
        saveAs(blob, "static.txt");
    }

    const importDataFromFile = (file) => {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (e) {
            const fileContent = JSON.parse(e.target.result);
            dispatch(importFile(fileContent));
            animation.setKeyFrames(fileContent.keyFrames);
        }
    }
    

    return (
    <div className="timelineStipContainer">
        <div className="timelineStrip" onClick={() => saveDataToFile()}>
            Export
        </div>
        <div>
        <input accept=".txt" id="getFilesInput" type="file" id="selectedFile" style={{display: "none"}} onChange={(e) => importDataFromFile(e.target.files[0])}/>
        <input type="button" value="Import" className="timelineStripInput" onClick={() => document.getElementById('selectedFile').click()} />
        </div>
    </div>
    );
    
}

export default InfoStrip;