import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateFloor, clearFloor, unloadPassengers, loadPassengers, changeFloor, reverseDirection, reverseFlag } from './../../ducks/reducer';
import './Skyscraper.css';


class Skyscraper extends Component {
    constructor(){
        super();

        this.state = {
            loadFlag: false
        }

        this.startElevator = this.startElevator.bind(this);
        this.updateFloor = this.updateFloor.bind(this);
        this.elevatorBrains = this.elevatorBrains.bind(this);
        this.loadStep = this.loadStep.bind(this);
        this.moveStep = this.moveStep.bind(this);
        this.reverseStep = this.reverseStep.bind(this);
    }

    startElevator(){
        // setInterval(this.elevatorBrains, 1000)
        this.elevatorBrains();
    }

    elevatorBrains(){
        this.loadStep();        
    }

    loadStep(){
        if(this.props.passengers.includes(this.props.currentFloor)){
            this.props.unloadPassengers();
        }
        if(this.props.floor[9-this.props.currentFloor].length > 0){
            console.log(`load passengers from floor: ${9-this.props.currentFloor}`)
            this.props.loadPassengers();
            this.setState({loadFlag: true}, () => this.moveStep())
        } else {
            this.moveStep();
        }
    }

    moveStep(){        
        if(this.props.goingUp === true || this.props.currentFloor === 0){
            console.log('going up or on floor 0')
            if(this.props.passengers.some(passenger => passenger > this.props.currentFloor)){
                console.log('passenger to floor above current')
                this.props.changeFloor('up');
            } else if (this.props.wantsUp.some(ele => ele > this.props.currentFloor)){
                console.log('someone wants up on floor above')
                this.props.changeFloor('up');
            } else if(this.props.wantsUp.length > 0){
                console.log('someone wants up on floor below')
                this.props.changeFloor('down');
                this.props.reverseFlag();
            }
        } else if(this.props.goingUp === false || this.props.currentFloor === 9){
            console.log('going down or on floor 9')
            if(this.props.passengers.some(passenger => passenger < this.props.currentFloor)){
                console.log('passenger to floor below current')
                this.props.changeFloor('down');
            } else if (this.props.wantsDown.some(ele => ele < this.props.currentFloor)){
                console.log('someone wants down on floor below')
                this.props.changeFloor('down');
            } else if(this.props.wantsDown.length > 0){
                console.log('someone wants down on floor above')
                this.props.changeFloor('up');
                this.props.reverseFlag();
            }
        } 
        this.reverseStep();
    }

    reverseStep(){
        console.log('reverse step - loadFlag: '+ this.state.loadFlag)
        if(!this.state.loadFlag){
            if(this.props.passengers.length === 0){
                console.log('no passengers')
                if(this.props.goingUp === true && !this.props.wantsUp.some(ele => ele > this.props.currentFloor)){
                    console.log('going up reverse')
                    this.props.reverseDirection();
                } else if(this.props.goingUp === false && !this.props.wantsDown.some(ele => ele < this.props.currentFloor)){
                    console.log('going down reverse')
                    this.props.reverseDirection();
                } else {
                    console.log('failed both ifs')
                }
            }
        }
        this.setState({loadFlag: false})
    }

    updateFloor(e, floorNumber){
        e = parseInt(e)
        this.props.updateFloor(floorNumber, [e]);
    }

    render() {
        console.log(this.props)
        let floors = this.props.floor;
        let jsxFloors = floors.map( (floor, i) => {
            let jsxFloorOptions = this.props.floor.map((ele, j) => {
                if(9-j !== i){
                    return <option key={j}>{j}</option>;
                }
            })
            if(this.props.currentFloor === 9-i){
                return (
                    <div>
                        {`|X| Floor ${9-i} - ${floor}`}
                        <select onChange={e => this.updateFloor(e.target.value, i)}>
                            <option disabled selected>Choose Floor</option>   
                            {jsxFloorOptions}
                        </select>
                    </div>
                )
            }
            return (
                <div>
                    {`|_| Floor ${9-i} - ${floor}`}
                    <select onChange={e => this.updateFloor(e.target.value, i)}>
                        <option disabled selected>Choose Floor</option>   
                        {jsxFloorOptions}
                    </select>
                </div>
            )
        })

        return (
        <div className="Skyscraper">
            <div className="sky-container">
                {jsxFloors}
                <button onClick={() => this.startElevator()}>Step</button>
            </div>
        </div>
        );
    }
}

function mapStateToProps(state){
    return {
        floor: state.floor,
        currentFloor: state.currentFloor,
        goingUp: state.goingUp,
        passengers: state.passengers,
        wantsUp: state.wantsUp,
        wantsDown: state.wantsDown
    }
  }

export default connect(mapStateToProps, { updateFloor, clearFloor, unloadPassengers, loadPassengers, changeFloor, reverseDirection, reverseFlag })(Skyscraper);