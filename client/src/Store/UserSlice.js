import {createSlice} from '@reduxjs/toolkit';

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
    Object.assign(state, action.payload); // מעדכן רק את מה שנשלח
  localStorage.setItem('user', JSON.stringify(state));
  console.log("after load user to local storage", state);
  return state;
},
    logoutUser: (state) => {
      state = null;
      localStorage.removeItem("user");
    },
  },
});
export const {setUser,logoutUser} = userSlice.actions;
export default userSlice.reducer