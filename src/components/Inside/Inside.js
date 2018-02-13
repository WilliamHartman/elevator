import React, { Component } from 'react';
import './Inside.css';
import { connect } from 'react-redux';
import stickman from '../../assets/stickman.png';

class Inside extends Component {
    render() {
        let jsxPassengers = this.props.passengers.map((passenger, i) => {
        return (
            <div key={i}>
                <img src={stickman} alt="stickman" className="inside-stickman"/>
                <div className="inside-stickman-head">
                    <div className="inside-stickman-head-number">
                        {passenger}
                    </div>
                </div>
            </div>
        )
      })
        return (
            <div className="Inside">
                {jsxPassengers}
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        passengers: state.passengers
    }
  }

export default connect(mapStateToProps, {  })(Inside);