import React,{ useCallback, useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../Redux/actions";
import { UpdateUserApi } from "../../apis/UserApis";

const Profile = () => {
  const [name , setName] = useState('');
  let dispatch = useDispatch();
  let currentName = useSelector(state => state.users.name);

  const mutaion = new UpdateUserApi({
    onResponse: (response) => {
      dispatch(setUser(response.data.result))
    }
  }).useMutation();

  useEffect(() => {
    setName(currentName);
  }, [currentName]);

  const storeHandler = async (e) => {
    e.preventDefault();

    mutaion.mutate(name);
  };

  const nameChangeHandler = useCallback((e) => {
    setName(e.target.value);
  });

  return (
    <div className="w-full mt-5">
  
      <form
        onSubmit={storeHandler}
        method="post"
        className="p-10 border rounded-md border-gray-500 w-1/2"
      >
        <div className="mb-5">
          <Link
            className="bg-gray-500 text-white rounded-md px-5 py-2"
            to="/"
          >
            Back
          </Link>
        </div>
        <div>
          <label htmlFor="text" className="block mb-2">
            name
          </label>
          <input
            type="text"
            value={name}
            onChange={nameChangeHandler}
            id="name"
            className="border border-gray-500 rounded-md w-full h-10 p-2"
          />
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="bg-blue-500 rounded-md px-5 py-2 w-full"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
