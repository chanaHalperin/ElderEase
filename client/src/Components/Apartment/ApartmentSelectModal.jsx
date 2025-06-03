import React, { useEffect, useState } from "react";
import { Modal, Row, Col, Spin, Empty } from "antd";
import ApartmentCard from "./ApartmentCard";
import ApartmentDetails from "./ApartmentDetails";
import axios from "axios";

const ApartmentSelectModal = ({ open, onSelect, onCancel, userId }) => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);

  // קבלת דירות פנויות מהשרת
  useEffect(() => {
    if (open) {
      setLoading(true);
      axios
        .get("http://localhost:8080/Apartment/getAll")
        .then((res) => {
          const available = res.data.filter(
            (a) => a.Status === "פנויה" || a.Status === "available"
          );
          setApartments(available);
        })
        .catch(() => setApartments([]))
        .finally(() => setLoading(false));
    }
  }, [open]);

  // פותח את ApartmentDetails במודל נוסף
  const handleShowDetails = (apartment) => {
    setSelectedApartment(apartment);
    setDetailsOpen(true);
  };

  // בחירת דירה מתוך ApartmentDetails
  const handleChooseApartment = (apartmentId) => {
    onSelect(apartmentId);
    setDetailsOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onCancel}
        footer={null}
        title="בחר דירה פנויה"
        width={900}
        destroyOnClose
      >
        {loading ? (
          <Spin size="large" style={{ display: "block", margin: "60px auto" }} />
        ) : apartments.length === 0 ? (
          <Empty description="אין דירות פנויות" />
        ) : (
          <Row gutter={[24, 24]} justify="center">
            {apartments.map((apartment) => (
              <Col xs={24} sm={12} md={8} key={apartment._id}>
                <ApartmentCard
                  apartment={apartment}
                  userId={userId}
                  onShowDetails={() => handleShowDetails(apartment)}
                />
              </Col>
            ))}
          </Row>
        )}
      </Modal>

      {/* ApartmentDetails מוצג כמודל נוסף מעל */}
      {detailsOpen && selectedApartment && (
        <Modal
          open={detailsOpen}
          onCancel={() => setDetailsOpen(false)}
          footer={null}
          width={700}
          destroyOnClose
        >
          <ApartmentDetails
            apartmentId={selectedApartment._id}
            userId={userId}
            onChoose={handleChooseApartment}
          />
        </Modal>
      )}
    </>
  );
};

export default ApartmentSelectModal;