
import React, { useEffect, useState } from 'react';
import { Button, Calendar, Tooltip, Card, Typography, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/he';
import { useSelector } from 'react-redux';

dayjs.locale('he');
const { Text } = Typography;

const ElderlyActivitiesCalendar = () => {
    const user = useSelector((state) => state.user);
    const [activitiesByDate, setActivitiesByDate] = useState({});

    useEffect(() => {
        if (!user) return;
        const fetchElderlyAndActivities = async () => {
            try {
                const activitiesRes = await axios.get(`http://localhost:8080/Elderly/getByIdWithActivities/${user.RefId}`, {
                    withCredentials: true,
                });

                const activities = activitiesRes.data.ActivitiesList;
                const grouped = {};

                activities.forEach((act) => {
                    const dateKey = dayjs(act.Date).format('YYYY-MM-DD');
                    if (!grouped[dateKey]) grouped[dateKey] = [];
                    grouped[dateKey].push(act);
                });

                setActivitiesByDate(grouped);
            } catch (error) {
                message.error("אירעה שגיאה בעת טעינת הנתונים.");
            }
        };
        fetchElderlyAndActivities();
    }, [user]);

    const handleDelete = async (activityId) => {
        try {
            if (!user) return;
            await axios.patch(`http://localhost:8080/Elderly/${user.RefId}/removeActivityFromElderly`, {
                activityId,
            }, { withCredentials: true });
            message.success("הפעילות הוסרה");
            // הסרה מהתצוגה
            setActivitiesByDate((prev) => {
                const updated = { ...prev };
                for (const date in updated) {
                    updated[date] = updated[date].filter((act) => act._id !== activityId);
                    if (updated[date].length === 0) delete updated[date]; // הסרת תאריך ריק
                }
                return updated;
            });
        } catch (err) {
            message.error("שגיאה במחיקת פעילות");
        }
    };

    const renderTooltipContent = (activity) => (
        <Card
            title={activity.Name}
            variant="borderless"
            style={{ width: 250, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '12px' }} >
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
        </Card>
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
