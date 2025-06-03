import axios from 'axios';

function CreateToken(user) {
  console.log("Creating token for user:", user);
  axios.post('http://localhost:8080/api/createToken', {
    userId: user.Id,
    role: user.Role
  }
   ,{ withCredentials: true }
  )
  .then(response => {
    console.log("Token created successfully");
    // אם אתה רוצה להשתמש בטוקן:
    // console.log(response.data.token);
  })
  .catch(error => {
    console.error("Failed to create token:", error.response?.data || error.message);
  });
}
export default CreateToken;