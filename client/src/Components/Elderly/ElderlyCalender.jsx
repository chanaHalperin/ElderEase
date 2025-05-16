import React, { useEffect, useState } from 'react';
import { Button, Calendar, Tooltip, Card, Typography } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/he';
import { message } from 'antd';
import { useSelector } from 'react-redux';


dayjs.locale('he');
const { Text, Title } = Typography;
const ElderlyActivitiesCalendar = () => {
    const [activitiesByDate, setActivitiesByDate] = useState({});
    //צריך לשלוף דווקא את הId של הזקן של היוזר את היוזר

  const userId=  useSelector((state) => state.user._id);
    console.log("userId",userId)
  const [activities, setActivities] = useState([]);
    const[flag,setFlag]=useState(false)

    useEffect(() => {
        console.log("userId",userId)
            const elderly =axios.get(`http://localhost:8080/Elderly/${userId}/getElderlyByUserId`)
            .then(res => {
                console.log("elderlyId",res.data._id)
            })
            .catch(err => {
                console.error('שגיאה בשליפת זקן ID:', err);
            });
      const elderlyId = elderly._id;
        setFlag(false)
        axios.get(`http://localhost:8080/Elderly/getByIdWithActivities/${elderlyId}`)
            .then(res => {
                const activities = res.data.ActivitiesList;
                const grouped = {};

                activities.forEach(act => {
                    const dateKey = dayjs(act.Date).format('YYYY-MM-DD');
                    if (!grouped[dateKey]) grouped[dateKey] = [];
                    grouped[dateKey].push(act);
                });

                setActivitiesByDate(grouped);
            })
            .catch(err => {
                console.error('שגיאה בשליפת הפעילויות:', err);
            });
    }, [flag]);
    const handleDelete = async (activityId) => {
        try {
            setFlag(true)
            await axios.patch(`http://localhost:8080/Elderly/${elderlyId}/removeActivityFromElderly`, {
                activityId,
            });
            setActivities(prev => prev.filter(act => act._id !== activityId));
            message.success("הפעילות הוסרה");
        } catch (err) {
            console.error(err);
            message.error("שגיאה במחיקה");
        }
    };
    const renderTooltipContent = (activity) => (
        <Card
            title={activity.Name}
            variant="borderless"
            style={{ width: 250, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '12px' }}
        >
            <Text><strong>קטגוריה:</strong> {activity.Category}</Text><br />
            <Text><strong>תאריך:</strong> {dayjs(activity.Date).format('DD/MM/YYYY HH:mm')}</Text><br />
            <Text><strong>מיקום:</strong> {activity.Location}</Text><br />
            <Text><strong>יוזם הפעילות:</strong> {activity.MakerName}</Text><br />
            <Text><strong>מחיר:</strong> {activity.Price} ₪</Text><br />
            <Text><strong>מקסימום משתתפים:</strong> {activity.MaxParticipants}</Text>
            <Button
                type="primary"
                danger
                block
                size="small"
                onClick={() => handleDelete(activity._id)}
                style={{ marginTop: 8 }}
            >
                הסר פעילות
            </Button>
        </Card >
    );

    const dateCellRender = (value) => {
        const dateKey = value.format('YYYY-MM-DD');
        const activities = activitiesByDate[dateKey];

        if (activities && activities.length) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {activities.map((activity) => (
                        <Tooltip
                            title={renderTooltipContent(activity)}
                            placement="top"
                            key={activity._id}
                            color="white"
                            styles={{ body: { borderRadius: '12px', padding: 0 } }}
                        >
                            <div
                                style={{
                                    backgroundColor: '#1890ff',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                }}
                            >
                                {activity.Name}
                            </div>
                        </Tooltip>
                    ))}
                </div>
            );
        }

        return null;
    };

    return (
        <Calendar
            cellRender={dateCellRender}
            style={{ background: '#fff', padding: '16px', borderRadius: '12px' }}
        />
    );
};

export default ElderlyActivitiesCalendar;
