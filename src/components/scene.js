import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {changeScale, addCube, addPlane, addPyramid, addIcosa, selectMesh, changeMeshProp} from '../actions/index.js';
import NumberField from './numberField';
import _ from 'lodash';

class Scene extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scale: 1
        };

        this.props.addIcosa();
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
                        <h2>Location</h2>
                        <NumberField prop="x" label="Move X"/>
                        <NumberField prop="y" label="Move Y"/>
                        <NumberField prop="z" label="Move Z"/>
                    </div>
                    <div className="row">
                        <h2>Rotation</h2>
                        <NumberField prop="rx" label="X Axis"/>
                        <NumberField prop="ry" label="Y Axis"/>
                        <NumberField prop="rz" label="Z Axis"/>
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
                    &nbsp;
                    <button type="button" className="btn btn-default" onClick={this.props.addPlane.bind(this)}>
                        Add Plane
                    </button>
                    &nbsp;
                    <button type="button" className="btn btn-default" onClick={this.props.addPyramid.bind(this)}>
                        Add Pyramid
                    </button>
                    &nbsp;
                    <button type="button" className="btn btn-default" onClick={this.props.addIcosa.bind(this)}>
                        Add Icosahedron
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
    return bindActionCreators({changeScale, addCube, addPlane, addPyramid, addIcosa, selectMesh, changeMeshProp}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Scene);
