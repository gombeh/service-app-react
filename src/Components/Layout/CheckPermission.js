import { useSelector } from "react-redux";
import Forbiden from "../../Pages/Forbiden";

const CheckPermission = (props) => {
    const permissions = useSelector(state => state.users?.permissions ?? []);
    if(permissions[0] === '*' || permissions.includes(props.permission)) {
        return props.children;
    }
    return <Forbiden />
}

export default CheckPermission;