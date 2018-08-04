import React, {Component} from 'react';
import Canvas from './canvas.js';
import Scene from './scene.js';

export default class ViewSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            views: {
                Canvas: {name: "Canvas", element: Canvas},
                Scene: {name: "Scene", element: Scene}
            },
            selectedView: {name: "", element: Canvas}
        };
    }

    viewChanged(event) {
        this.setState({
            selectedView: this.state.views[event.target.value]
        });
    }

    render() {
        let viewList = _.map(this.state.views, (view) => <option> {view.name} </option>);
        let currentView = "";

        if (this.state.selectedView.element != null) {
            currentView = <this.state.selectedView.element/>;
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