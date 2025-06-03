import React from "react";
import { Checkbox, TimePicker, Row, Col } from "antd";
import dayjs from "dayjs";

const DaysOfCleaningForm = ({
  dayOptions,
  selectedDays,
  onDayChange,
  onTimeChange,
  hebrewDays,
}) => {
  const selectedDayKeys = Object.keys(selectedDays);

  return (
    <div>
      <Checkbox.Group
        options={dayOptions}
        value={selectedDayKeys}
        onChange={onDayChange}
        style={{ marginBottom: "1rem" }}
      />
      {selectedDayKeys.map((day) => (
        <Row key={day} gutter={16} style={{ marginTop: "0.5rem" }}>
          <Col span={12}>{hebrewDays?.[day] || day}</Col>
          <Col span={12}>
            <TimePicker
              value={selectedDays[day] ? dayjs(selectedDays[day], "HH:mm") : null}
              format="HH:mm"
              onChange={(value) => onTimeChange(day, value)}
            />
          </Col>
        </Row>
      ))}
    </div>
  );
};
export default DaysOfCleaningForm;