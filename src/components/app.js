import React, {Component} from 'react';
import Canvas from './canvas.js';
import Panel from './scene.js';

import PanelResizer from "./PanelResizer";

export default class App extends Component {

    render() {
        return <PanelResizer />;
    }
}
