import { SET_USER } from "../../constants/action-types";

export const setUser = user => ({
    type: SET_USER,
    payload: user
});