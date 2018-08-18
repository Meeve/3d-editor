import React from 'react';
import ReactDOM from 'react-dom';
import DropdownMenu from "./DropdownMenu";

export default class DropdownMenuShower extends React.Component {
    constructor(props) {
        super(props);
        
        this.dropdown = React.createRef();
        this.state = {
            isMenuOpened: false
        };
    }

    toggleDropdownMenu() {
        this.setState({
            isMenuOpened: !this.state.isMenuOpened
        });
    }

    render() {
        let dropdownMenu = "";

        if(this.state.isMenuOpened) {
            console.log(this.props.actionList);
            const clientRect = this.dropdown.current.getBoundingClientRect();
            dropdownMenu = <DropdownMenu position={clientRect} actionList={this.props.actionList}></DropdownMenu>;
        }

        return (
            <div ref={this.dropdown} >
                <div className="dropDownMenuHeader" onClick={this.toggleDropdownMenu.bind(this)} >
                    {this.props.text}
                </div>

                {dropdownMenu}
            </div>
        )
    }
}