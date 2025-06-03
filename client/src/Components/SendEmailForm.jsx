import React, { useState } from 'react';

function SendEmailForm() {
  return; //חסמתי זמנית את שליחת המיילים זה כבר עובד - רק מטריד
  const [form, setForm] = useState({ to: '', subject: '', text: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage('המייל נשלח בהצלחה!');
      } else {
        setMessage('שליחת המייל נכשלה');
      }
    } catch (error) {
      setMessage('שגיאה בעת שליחת המייל');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="to" placeholder="אל" value={form.to} onChange={handleChange} />
      <input name="subject" placeholder="נושא" value={form.subject} onChange={handleChange} />
      <textarea name="text" placeholder="תוכן ההודעה" value={form.text} onChange={handleChange} />
      <button type="submit">שלח מייל</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default SendEmailForm;
