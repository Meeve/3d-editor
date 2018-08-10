import React, {Component} from 'react';
import Canvas from './canvas.js';
import Scene from './scene.js';
import Scroller from "./Scroller";

export default class ViewSelector extends Component {
    constructor(props) {
        super(props);
        
        const menuBarHeight = 25;
        
        this.state = {
            menuBarHeight,
            views: {
                Canvas: {
                    name: "Canvas", 
                    element: <Canvas/>
                },
                Scene: {
                    name: "Scene",
                    element: <Scroller height={ this.props.componentHeight - menuBarHeight } >
                            { Scene } 
                        </Scroller>
                        }
            },
            selectedView: {name: "", element: <Canvas />}
        };
    }

    viewChanged(event) {
        this.setState({
            selectedView: this.state.views[event.target.value]
        });
    }

    render() {
        let viewList = _.map(this.state.views, (view, key) => <option key={key}> {view.name} </option>);
        let currentView = "";

        if (this.state.selectedView.element != null) {
            currentView = this.state.selectedView.element;
        }

        return (
            <div style={{display: "grid", gridTemplateRows: "1fr 25px", overflow: "hidden"}}>
                {currentView}
                <div>
                    <select value={this.state.selectedView.name} onChange={this.viewChanged.bind(this)}>
                        {viewList}
                    </select>
                </div>
            </div>
        );
    }
}