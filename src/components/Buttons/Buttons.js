import React, { Component } from 'react';
import './Buttons.css';
import { connect } from 'react-redux';

class Buttons extends Component {
    render() {
        //JSX to create the buttons
        let jsxButtons = this.props.floor.map((ele, i) => {
            //If there is a passenger wanting to go to the floor, makes background green
            if(this.props.passengers.includes(i)){
                return (
                    <div key={i} className="buttons-container">
                        <div className="buttons-circle-green">
                            <div className="buttons-numbers">
                                {i}
                            </div>
                        </div>
                    </div>
                )
                // Else background is whitesmoke color
            } else {
                return (
                    <div key={i} className="buttons-container">
                        <div className="buttons-circle">
                            <div className="buttons-numbers">
                                {i}
                            </div>
                        </div>
                    </div>
                )
            }
      })
        return (
            <div className="Buttons">
                {jsxButtons}
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        passengers: state.passengers,
        floor: state.floor
    }
  }

export default connect(mapStateToProps, {  })(Buttons);