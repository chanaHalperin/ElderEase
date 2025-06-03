import { message } from 'antd';
import axios from 'axios';

function CreateToken(user) {
  axios.post('http://localhost:8080/api/createToken', {
    userId: user.idNumber,
    role: user.Role
  }
  ,{ withCredentials: true }
  )
  .then(response => {
  })
  .catch(error => {
    message.error("Failed to create token");
  });
}

export default CreateToken;