import React, { useEffect, useState } from "react";
import { Row, Col, Input, Select, Typography, Spin, Empty, Button, Statistic, Space } from "antd";
import { ReloadOutlined, HomeOutlined } from "@ant-design/icons";
import axios from "axios";
import ApartmentCard from "./ApartmentCard";

const { Title } = Typography;
const { Option } = Select;

const ApartmentList = () => {
  const [apartments, setApartments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [avgPrice, setAvgPrice] = useState(0);
  const [avgRooms, setAvgRooms] = useState(0);

  const fetchApartments = () => {
    setLoading(true);
    axios.get("http://localhost:8080/Apartment/getAll", { withCredentials: true })
      .then(res => {
        setApartments(res.data);
        setFiltered(res.data);
        setLoading(false);
        if (res.data.length > 0) {
          setAvgPrice(Math.round(res.data.reduce((sum, a) => sum + (a.MonthlyPrice || 0), 0) / res.data.length));
          setAvgRooms((res.data.reduce((sum, a) => sum + (a.NumOfRooms || 0), 0) / res.data.length).toFixed(1));
        } else {
          setAvgPrice(0);
          setAvgRooms(0);
        }
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  useEffect(() => {
    let data = [...apartments];
    if (search) 
      data = data.filter(a =>
        (a.Address && a.Address.includes(search)) ||
        (a.Owner && a.Owner.includes(search))
      );
    if (sort === "price") 
      data.sort((a, b) => (a.MonthlyPrice || 0) - (b.MonthlyPrice || 0));
    if (sort === "rooms") 
      data.sort((a, b) => (a.NumOfRooms || 0) - (b.NumOfRooms || 0));
    setFiltered(data);
  }, [search, sort, apartments]);

  return (
    <div className="apartment-list-bg">
      <div className="apartment-list-header">
        <Title level={2}><HomeOutlined style={{ color: "#1890ff", marginLeft: 8 }} />רשימת דירות</Title>
        <div className="apartment-list-filters">
          <Input
            placeholder="חפש כתובת או בעלים"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="apartment-list-search"
            allowClear
          />
          <Select
            value={sort}
            onChange={setSort}
            className="apartment-list-sort"
            style={{ minWidth: 120 }}
          >
            <Option value="default">מיון</Option>
            <Option value="price">מחיר</Option>
            <Option value="rooms">מס' חדרים</Option>
          </Select>
          <Button icon={<ReloadOutlined />} onClick={fetchApartments}>
            רענן
          </Button>
        </div>
        <Space size="large" style={{ margin: "18px 0" }}>
          <Statistic title="סה״כ דירות" value={filtered.length} />
          <Statistic title="מחיר ממוצע" value={avgPrice} suffix="₪" />
          <Statistic title="ממוצע חדרים" value={avgRooms} />
        </Space>
      </div>
      {loading ? (
        <div className="apartment-list-spin"><Spin size="large" /></div>
      ) : filtered.length === 0 ? (
        <Empty description="לא נמצאו דירות" />
      ) : (
        <Row gutter={[24, 24]} className="apartment-list-row" justify="center">
          {filtered.map((apartment) => (
            <Col xs={24} sm={12} md={8} lg={6} key={apartment._id}>
              <ApartmentCard apartment={apartment} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ApartmentList;