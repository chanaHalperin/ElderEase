import { useDispatch } from 'react-redux';
import { logoutUser } from '../Store/UserSlice';
import { NavLink } from 'react-router-dom';
const LogOut = () => {
const dispatch = useDispatch();
const onClickB=()=> {
  dispatch(logoutUser())
  //צריך לשנות את זה - לא יפה לעשות ככה
  window.location.href = '/';
}
  return(
        <NavLink onClick={onClickB}>Logout</NavLink>
  )
}
export default LogOut;