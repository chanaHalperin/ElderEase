import axios from 'axios';
import { useSelector } from "react-redux";
import { sendEmail } from '../SendEmail';
import { useDispatch } from "react-redux";
import { useEnum } from "../Enums/useEnum";
import { setUser } from "../Store/UserSlice";

const JoinCommunity_button = ({ user_id }) => {
  const user = useSelector((state) => state.user);
  async function JoinCommunityOnClick() {
    await axios.post("http://localhost:8080/Manager/addUserToQueue", {
      user_id: user._id
    }, verifyToken).then(res => {
      dispatch(setUser({ Status: userStatus.PENDING }));
      sendEmail({
        to: user.Email,
        subject: `hello ${user.FirstName} ${user.LastName}!`,
        text: "you are in the queue for the community",
      });
      alert("נכנסת בהצלחה לתור!")
    }).catch(err => {
      alert("מצטערים , אך הייתה בעייה בהכנסה לתור ממתינים")
    });
  };
  const dispatch = useDispatch();
  const {
    data: userStatus,
    loading: loadinguserStatus,
    error: erroruserStatus,
  } = useEnum("getUserStatus");

  return (
    <button onClick={() => JoinCommunityOnClick({ user_id })}>Join our community here</button>
  )
}

export default JoinCommunity_button