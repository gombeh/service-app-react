import { SET_USER } from "../../constants/action-types";

const userReducer = (state={}, action) =>{
    switch(action.type) {
        case SET_USER: 
            return action.payload;

        default:
            return state
    }
}

export default userReducer;