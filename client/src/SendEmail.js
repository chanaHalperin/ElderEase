import axios from 'axios';
export async function sendEmail({ to, subject, text }) {

    console.log(to+" " + subject + " " + text);
  const res = axios.post('http://localhost:8080/api/send-email', {
    to,
    subject,
    text
  }).then(res => {
    console.log('Email sent successfully:', res.data);
  }).catch(err => {
    console.error('Error sending email:', err);
  });
    return res;
}
