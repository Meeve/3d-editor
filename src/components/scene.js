import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {changeScale, addCube, addPlane, selectMesh, changeMeshProp} from '../actions/index.js';
import NumberField from './numberField';
import _ from 'lodash';

class Scene extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scale: 1
        };

        this.props.addPlane();
    }

    scaleChange(event) {
        this.setState({
            scale: event.target.value
        });

        this.props.changeScale(event.target.value);
    }

    changeProp(prop, e) {
        if (!isNaN(e.target.value)) {
            this.props.changeMeshProp(this.props.selectedMesh.id, prop, parseInt(e.target.value));
        }
    }

    render() {
        let controls = "Not selected yet";
        if (this.props.selectedMesh) {
            controls = (
                <div>
                    <div className="row">
                        <h2>Localization</h2>
                        X: <NumberField prop="x"/>
                        Y: <NumberField prop="y"/>
                        Z: <NumberField prop="z"/>
                    </div>
                    <div className="row">
                        <h2>Obrót</h2>
                        X Axis: <NumberField prop="rx"/>
                        Y Axis: <NumberField prop="ry"/>
                        Z Axis: <NumberField prop="rz"/>
                    </div>
                </div>
            );
        }

        return (
            <div className="col-md-6">
                <div className="row">
                    <button type="button" className="btn btn-default" onClick={this.props.addCube.bind(this)}>
                        Add Cube
                    </button>
                    <button type="button" className="btn btn-default" onClick={this.props.addPlane.bind(this)}>
                        Add Plane
                    </button>
                </div>
                <div className="row">
                    <ul>
                        {_.map(this.props.meshes, el =>
                            <li onClick={this.props.selectMesh.bind(this, el)} title={JSON.stringify(el)}>
                                #{el.id} - {el.name}
                            </li>
                        )}
                    </ul>
                </div>
                {controls}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        meshes: state.meshes,
        selectedMesh: state.selectedMesh
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({changeScale, addCube, addPlane, selectMesh, changeMeshProp}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Scene);
