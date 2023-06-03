import { API_URL } from "../config";
import Api from "./Api";

export class GetAdminServicesApi extends Api {
    static id = 'GetAdminServicesApi'

    onCall = () => {
        return this.get(API_URL + '/admin/services')
    }
}

export class GetUserServiceApi extends Api {
    static id = 'GetUserServicesApi';

    onCall = () => {
        return this.get(API_URL + '/user/services')
    }
}

export class UpdateStatusServiceApi extends Api {
    static id= 'updateStatusServiceApi';

    onCall = (id) => {
        return this.put(API_URL + `/admin/services/${id}/update-status`)
    }
}

export class StoreServiceApi extends Api {
    static id= 'storeServiceApi'

    onCall = (name) => {
        return this.post(API_URL + `/admin/services`, name)
    }
}