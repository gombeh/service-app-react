import { API_URL } from "../config"
import Api from "./Api"

export class LoginApi extends Api {
    static id = 'LoginApi'

    onCall = (params) => {
        return this.post(API_URL + '/login', params)
    }
}

export class LogoutApi extends Api {
    static id = 'LogoutApi'

    onCall = () => {
        return this.post(API_URL + '/logout')
    }
}