import React, { Component } from 'react';
import Canvas from './canvas.js';
import Panel from './panel.js';

export class ViewSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            views: {
                Canvas: { name: "Canvas", element: Canvas },
                Panel: { name: "Panel", element: Panel }
            },
            selectedView: { name: "", element: null }
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
        
        if(this.state.selectedView.element != null) {
            currentView = <this.state.selectedView.element />;
        }

        return (
            <div>
                <div>
                    { currentView }
                </div>
                <div>
                    <select value={this.state.selectedView.name} onChange={this.viewChanged.bind(this)} >
                        { viewList }
                    </select>
                </div>
            </div>
        );
    }
}