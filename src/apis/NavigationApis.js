import { API_URL } from "../config";
import Api from "./Api";

export class getRoutingApi extends Api {
    static id = 'getRoutingApi'

    onCall = () => {
        return this.get(API_URL + '/admin/routing');
    }
}
