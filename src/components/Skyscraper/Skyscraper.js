import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateFloor, clearFloor, unloadPassengers, loadPassengers, changeFloor, reverseDirection, reverseFlag } from './../../ducks/reducer';
import './Skyscraper.css';


class Skyscraper extends Component {
    constructor(){
        super();

        this.state = {
            loadFlag: false,
            topFloorNumber: 19
        }

        this.startElevator = this.startElevator.bind(this);
        this.updateFloor = this.updateFloor.bind(this);
        this.elevatorBrains = this.elevatorBrains.bind(this);
        this.loadStep = this.loadStep.bind(this);
        this.moveStep = this.moveStep.bind(this);
        this.reverseStep = this.reverseStep.bind(this);
    }
    
    //Invokes elevatorBrains method onclick
    startElevator(){
        // setInterval(this.elevatorBrains, 1000)
        this.elevatorBrains();
    }

    //Starts loadStep Method
    elevatorBrains(){
        this.loadStep();        
    }

    //Handles loading and unloading of passengers
    loadStep(){     
        //If there is a passenger with the same value of the current floor, 
        // invokes unloadPassengers in the reducer
        if(this.props.passengers.includes(this.props.currentFloor)){
            this.props.unloadPassengers();
        }
        //If there is a queue on the current floor, invokes loadPassengers
        // in the reducer and sets the loadFlag to true, then invokes moveStep
        if(this.props.floor[this.state.topFloorNumber-this.props.currentFloor].length > 0){
            this.props.loadPassengers();
            this.setState({loadFlag: true}, () => this.moveStep())
        } else {
            this.moveStep();
        }
    }

    //Handles moving floors
    moveStep(){        
        if(this.props.goingUp === true || this.props.currentFloor === 0){
            //console.log('going up or on floor 0')
            if(this.props.passengers.some(passenger => passenger > this.props.currentFloor)){
                // console.log('passenger to floor above current')
                this.props.changeFloor('up');
            } else if (this.props.wantsUp.some(ele => ele > this.props.currentFloor)){
                // console.log('someone wants up on floor above')
                this.props.changeFloor('up');
            } else if(this.props.wantsUp.length > 0){
                // console.log('someone wants up on floor below')
                this.props.changeFloor('down');
                this.props.reverseFlag();
            }
        } else if(this.props.goingUp === false || this.props.currentFloor === this.state.topFloorNumber){
            // console.log('going down or on floor this.state.topFloorNumber')
            if(this.props.passengers.some(passenger => passenger < this.props.currentFloor)){
                // console.log('passenger to floor below current')
                this.props.changeFloor('down');
            } else if (this.props.wantsDown.some(ele => ele < this.props.currentFloor)){
                // console.log('someone wants down on floor below')
                this.props.changeFloor('down');
            } else if(this.props.wantsDown.length > 0){
                // console.log('someone wants down on floor above')
                this.props.changeFloor('up');
                this.props.reverseFlag();
            }
        } 
        this.reverseStep();
    }

    //Handles reversing the direction of the elevator
    reverseStep(){
        // console.log('reverse step - loadFlag: '+ this.state.loadFlag)
        if(!this.state.loadFlag){
            if(this.props.passengers.length === 0){
                // console.log('no passengers')
                if(this.props.goingUp === true && !this.props.wantsUp.some(ele => ele > this.props.currentFloor)){
                    // console.log('going up reverse')
                    this.props.reverseDirection();
                } else if(this.props.goingUp === false && !this.props.wantsDown.some(ele => ele < this.props.currentFloor)){
                    // console.log('going down reverse')
                    this.props.reverseDirection();
                } else {
                    // console.log('failed both ifs')
                }
            }
        }
        this.setState({loadFlag: false})
    }

    //Handles the onChange from select options
    updateFloor(e, floorNumber){
        e = parseInt(e)
        this.props.updateFloor(floorNumber, [e]);
    }

    render() {
        let floors = this.props.floor;
        //JSX to create each floor
        let jsxFloors = floors.map( (floor, i) => {
            //JSX to create select options
            let jsxFloorOptions = this.props.floor.map((ele, j) => {
                if(this.state.topFloorNumber-j !== i){
                    return <option key={j}>{j}</option>;
                }
            })
            //Creates a string of numbers representing the queue
            let floorString = '';
            if(floor.length > 0){
                floorString = floor.join(', ');
            }
            //If the car is on the current floor returns this
            if(this.props.currentFloor === this.state.topFloorNumber-i){
                return (
                    <div className="skyscraper-floor" key={i}>
                        <div className="skyscraper-car-left"></div>
                        <div className="skyscraper-car-right"></div>
                        <div className="skyscraper-queue">
                            {floorString}
                        </div>
                        <div className="skyscraper-floor-number">
                            {`Floor ${this.state.topFloorNumber-i}`}
                        </div>
                        <select onChange={e => this.updateFloor(e.target.value, i)} className="skyscraper-select">
                            <option disabled selected>Choose Floor</option>   
                            {jsxFloorOptions}
                        </select>
                    </div>
                )
            }
            //Normal non-car floor
            return (
                <div className="skyscraper-floor" key={i}>
                    <div className="skyscraper-shaft-left"></div>
                    <div className="skyscraper-shaft-right"></div>
                    <div className="skyscraper-queue">
                        {floorString}
                    </div>
                    <div className="skyscraper-floor-number">
                        {`Floor ${this.state.topFloorNumber-i}`}
                    </div>
                    <select onChange={e => this.updateFloor(e.target.value, i)} className="skyscraper-select">
                        <option disabled selected>Choose Floor</option>   
                        {jsxFloorOptions}
                    </select>
                </div>
            )
        })

        return (
        <div className="Skyscraper">
            <div className="skyscraper-container">
                {jsxFloors}
            </div>
            <button onClick={() => this.startElevator()}>Step</button>
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