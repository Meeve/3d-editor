import React, {Component} from 'react';
import Canvas from './canvas.js';
import Scene from './scene.js';
import DropdownMenuShower from "./DropdownMenuShower";

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
        let viewList = _.map(this.state.views, (view, key) => <option key={key}> {view.name} </option>);
        let currentView = "";

        if (this.state.selectedView.element != null) {
            currentView = <this.state.selectedView.element/>;
        }

        return (
            <div style={{display: "grid", gridTemplateRows: "1fr 25px", overflow: "hidden"}}>
                {currentView}
                <div style={{ display: "flex", alignItems: "center" }}>
                    <select value={this.state.selectedView.name} onChange={this.viewChanged.bind(this)}>
                        {viewList}
                    </select> 
                    <DropdownMenuShower text="View">

                    </DropdownMenuShower>
                    <DropdownMenuShower text="Add" actionList={[
                        {
                            text: "Mesh",
                            actionList: [
                                { text: "Cube", action: () => console.log(1)},
                                { text: "Icosahedron", action: () => console.log(2)},
                                { text: "Plane", action: () => console.log(3)},
                                { text: "Pyramid", action: () => console.log(4)}
                            ]
                        },{
                            text: "xxx",
                            actionList: [
                                { text: "xxz", action: () => console.log(1)},
                                { text: "vcx", action: () => console.log(2)},
                                { text: "bvc", action: () => console.log(3)},
                                { text: "fd", action: () => console.log(4)},
                                { text: "fd", action: () => console.log(5)}
                            ]
                        },
                    ]}>

                    </DropdownMenuShower>
                </div>
            </div>
        );
    }
}