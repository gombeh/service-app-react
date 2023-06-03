import { setUser } from ".";
import { GetUserApi } from "../../apis/UserApis";
import { getUser } from "../../helpers/helper";

export const asyncActionSetUser = () => {
    return (dispatch) => {
      new GetUserApi({
        onResponse: response => {
          dispatch(setUser(response.data.result));
        }
      }).async()
    }
}