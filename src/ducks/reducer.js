//Sets the max number of floors
const topFloorNumber = 19;

//Builds the initialState floor
let floorInit = [];
for(let i=0; i<=topFloorNumber; i++){
    floorInit.push([]);
}

const initialState = {
    floor: [...floorInit],
    currentFloor: 0,
    passengers: [],
    goingUp: true,
    wantsUp: [],
    wantsDown: [],
    reverseFlag: false
}

const UPDATE_FLOOR = 'UPDATE_FLOOR'; 
const CLEAR_FLOOR = 'CLEAR_FLOOR'; 
const UNLOAD_PASSENGERS = 'UNLOAD_PASSENGERS'; 
const LOAD_PASSENGERS = 'LOAD_PASSENGERS'; 
const CHANGE_FLOOR = 'CHANGE_FLOOR'; 
const REVERSE_DIRECTION = 'REVERSE_DIRECTION'; 
const REVERSE_FLAG = 'REVERSE_FLAG'; 


export function updateFloor( floorNumber, newPerson ){
    return {
        type: UPDATE_FLOOR,
        payload: [floorNumber, newPerson]
    }
}

export function clearFloor( floorNumber, newPerson ){
    return {
        type: CLEAR_FLOOR,
        payload: [floorNumber, newPerson]
    }
}

export function unloadPassengers( ){
    return {
        type: UNLOAD_PASSENGERS,
        payload: 0
    }
}

export function loadPassengers( ){
    return {
        type: LOAD_PASSENGERS,
        payload: 0
    }
}

export function changeFloor( direction ){
    return {
        type: CHANGE_FLOOR,
        payload: direction
    }
}

export function reverseDirection(  ){
    return {
        type: REVERSE_DIRECTION,
        payload: null
    }
}

export function reverseFlag(  ){
    return {
        type: REVERSE_DIRECTION,
        payload: true
    }
}


export default function reducer(state=initialState, action) {
    let newFloor = [];
    let newPassengers = [];
    let currentFloor;

    switch(action.type){
        case UPDATE_FLOOR:
            let newWantsUp = [...state.wantsUp];
            let newWantsDown = [...state.wantsDown];
            newFloor = [...state.floor];
            currentFloor = newFloor[action.payload[0]]
            //Pushes the new member in the queue to the temporary currentFloor
            currentFloor.push(action.payload[1][0])
            //Replaces old currentFloor with temporary
            newFloor.splice(action.payload[0], 1, currentFloor)
            //Pushes the floor level to the corrent wantsUp/wantsDown array
            if(action.payload[1][0] > topFloorNumber-action.payload[0]){
                newWantsUp.push(topFloorNumber-action.payload[0]);
            } else if(action.payload[1][0] < topFloorNumber-action.payload[0]){
                newWantsDown.push(topFloorNumber-action.payload[0]);
            }
            return Object.assign({}, state, {floor: newFloor, wantsUp: newWantsUp, wantsDown: newWantsDown});
        
        case CLEAR_FLOOR:
            newFloor = [...state.floor];
            return Object.assign({}, state, {floor: newFloor});

        case UNLOAD_PASSENGERS:
            newPassengers = [...state.passengers];
            //Removes passengers who equal the current floor
            let tempPass = newPassengers.filter( (ele) => ele !== state.currentFloor);
            return Object.assign({}, state, {passengers: tempPass});

        case LOAD_PASSENGERS:
            let toLoad = [];
            let toStay = [];
            let updateWantsUp = [...state.wantsUp];
            let updateWantsDown = [...state.wantsDown];
            //If the elevator is going up, loads the queue members with higher numbers,
            // removes them from the currentfloor queue, removes floor from wantsUp
            if(state.goingUp === true ){
                toLoad = state.floor[topFloorNumber-state.currentFloor].filter( ele => ele > state.currentFloor)
                toStay = state.floor[topFloorNumber-state.currentFloor].filter( ele => ele < state.currentFloor)
                updateWantsUp = updateWantsUp.filter(ele => ele !== state.currentFloor)
            //If the elevator is going down, loads the queue members with lower numbers,
            // removes them from the currentfloor queue, removes floor from wantsdown
            } else {
                toLoad = state.floor[topFloorNumber-state.currentFloor].filter( ele => ele < state.currentFloor)
                toStay = state.floor[topFloorNumber-state.currentFloor].filter( ele => ele > state.currentFloor)
                updateWantsDown = updateWantsDown.filter(ele => ele !== state.currentFloor)
            }
            //If the reverseflag is true, load all
            if(state.reverseFlag === true){
                toLoad = state.floor[topFloorNumber-state.currentFloor];
                updateWantsUp = [];
                updateWantsDown = [];
            }
            newPassengers = [...state.passengers, ...toLoad];
            newFloor = [...state.floor];
            newFloor.splice(topFloorNumber-state.currentFloor, 1, toStay)
            return Object.assign({}, state, {passengers: newPassengers, floor: newFloor, wantsUp: updateWantsUp, wantsDown: updateWantsDown});

        case CHANGE_FLOOR:
            let newFloorLevel = state.currentFloor;
            let newGoingUp = state.goingUp;
            //Add 1 to floor if going up, subtract if going down
            //If on top or bottom floor, reverse goingUp
            if(action.payload === 'up'){
                newFloorLevel++;
                if(newFloorLevel === topFloorNumber) newGoingUp = false;
            } else if(action.payload === 'down'){
                newFloorLevel--;
                if(newFloorLevel === 0) newGoingUp = true;
            }
            return Object.assign({}, state, {currentFloor: newFloorLevel, goingUp: newGoingUp});

        case REVERSE_DIRECTION:
            let newDirection = !state.goingUp;
            return Object.assign({}, state, {goingUp: newDirection});    

        case REVERSE_FLAG:
            return Object.assign({}, state, {reverseFlag: true});            

        default: 
            return state;
    }
}