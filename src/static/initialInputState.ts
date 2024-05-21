type InputState = {
    overlayNew: boolean,
    customDate: boolean,
    doubleDates: boolean,
    stateID: number,
    lastChange:{type:string}
}

const initialInputState:InputState = {
    overlayNew:false,
    customDate:false,
    doubleDates:false,
    stateID:0,
    lastChange:{type:'init'}
}

export {initialInputState,InputState}