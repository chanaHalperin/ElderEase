import { createSlice } from '@reduxjs/toolkit';
import CreateToken from "../CreateToken"
import { useNavigate } from 'react-router-dom';
const initialState = JSON.parse(localStorage.getItem("user")) || {
  RefId: null,
  Id: null,
  Phone: null,
  FirstName: null,
  LastName: null,
  Email: null,
  Password: null,
  Role: null,
  Status: null,
  CreatedAt: null
};
const userSlice = createSlice({
  name: 'UserSlice',
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      // const updatedUser = { ...state, ...action.payload };
      // localStorage.setItem('user', JSON.stringify(updatedUser));
      //קריאה לcreatetoken
      Object.assign(state, action.payload); // עדכון state
      //CreateToken({ Id: action.payload.Id, Role: action.payload.Role });
      localStorage.setItem('user', JSON.stringify(state));
      return state;
    },
    // logoutUser: (state) => {
    //   state = null;
    //   localStorage.removeItem("user");
    //   const navigate = useNavigate();
    //   navigate("/");
    // },
    logoutUser: (state) => {
      state = null;
      localStorage.removeItem("user");
    },
  },
});
export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer