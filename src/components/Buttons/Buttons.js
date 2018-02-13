import React, { Component } from 'react';
import './Buttons.css';
import { connect } from 'react-redux';

class Buttons extends Component {
    render() {
        let jsxButtons = this.props.floor.map((ele, i) => {
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