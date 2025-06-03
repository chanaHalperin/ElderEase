import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Spin, Typography, Input, Select, DatePicker, Card, Empty } from 'antd';
import ActivityCard from './ActivityCard';
import { SearchOutlined, FilterOutlined, CalendarOutlined, AppstoreOutlined } from '@ant-design/icons';
import '../../styles/Activity/ActivitiesList.css';
import { useSelector } from 'react-redux';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ActivitiesList = () => {
  const [activities, setActivities] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [dateRange, setDateRange] = useState([]);

  const elderlyId = useSelector((state) => state.user.RefId);
  useEffect(() => {
    axios.get('http://localhost:8080/Activity/getAll', { withCredentials: true })
      .then(response => {
        setActivities(response.data);
        setFiltered(response.data);
        setLoading(false);
        // שליפת קטגוריות ייחודיות
        const cats = Array.from(new Set(response.data.map(a => a.Category).filter(Boolean)));
        setCategories(cats);
      })
      .catch(error => {
        setLoading(false);
      });
  }, []);

  // סינון פעילויות
  useEffect(() => {
    let data = [...activities];
    if (search) {
      data = data.filter(a =>
        (a.Name && a.Name.includes(search)) ||
        (a.Description && a.Description.includes(search))
      );
    }
    if (category) {
      data = data.filter(a => a.Category === category);
    }
    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      data = data.filter(a => {
        const date = a.Date ? new Date(a.Date) : null;
        return date && date >= start.toDate() && date <= end.toDate();
      });
    }
    setFiltered(data);
  }, [search, category, dateRange, activities]);

  return (
    <div className="activities-list-bg">
      <Card className="activities-list-card">
        <Title level={2} style={{ textAlign: 'center', marginBottom: 18 }}>
          <AppstoreOutlined style={{ color: "#1890ff", marginLeft: 8 }} />
          רשימת פעילויות
        </Title>
        <div className="activities-list-filters">
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="חפש לפי שם או תיאור"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 220 }}
          />
          <Select
            allowClear
            placeholder="בחר קטגוריה"
            value={category || undefined}
            onChange={setCategory}
            style={{ minWidth: 140 }}
            suffixIcon={<FilterOutlined />}
          >
            {categories.map(cat => (
              <Option key={cat} value={cat}>{cat}</Option>
            ))}
          </Select>
          <RangePicker
            format="DD/MM/YYYY"
            placeholder={['מתאריך', 'עד תאריך']}
            value={dateRange}
            onChange={setDateRange}
            style={{ minWidth: 220 }}
            suffixIcon={<CalendarOutlined />}
          />
        </div>
        {loading ? (
          <Spin tip="טוען..." size="large" style={{ margin: '2rem auto', display: 'block' }} />
        ) : (
          <Row gutter={[32, 32]} justify="center" className="activities-list-row">
            {filtered.map(activity => (
              <Col xs={24} sm={12} md={8} lg={6} key={activity._id}>
                <ActivityCard activity={activity} elderlyId={elderlyId} />
              </Col>
            ))}
          </Row>

        )}
      </Card>
    </div>
  );
};

export default ActivitiesList;