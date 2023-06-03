import { API_URL } from "../config";
import Api from "./Api";

export class GetUserApi extends Api {
    static id = 'GetUserApi'

    onCall = () => {
        return this.get(API_URL + '/user');
    }
}

export class UpdateUserApi extends Api {
    static id = 'UpdateUserApi';

    onCall = (name) => {
        return this.put(API_URL + '/user', {name});
    }
}