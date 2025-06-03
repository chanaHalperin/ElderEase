import React, { useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import QueueTable from './QueueTable';
import { useEnum } from "../../Enums/useEnum";

const QueuesByRole = ({ openNotification }) => {
  const { data: roles, loading, error } = useEnum("getRoles");
  const [openRole, setOpenRole] = useState(null);

  // הפוך את האובייקט למערך ערכים
   const rolesArr = roles && typeof roles === "object"
    ? Object.values(roles)
    : [];

  return (
    <div style={{ textAlign: "center", marginBottom: 32 }}>
      <style>
        {`
        .role-btn-custom {
          background: #f0f5ff;
          color: #223a5e;
          border: 2px solid #1890ff;
          border-radius: 22px;
          padding: 8px 22px;
          margin: 0 8px 18px 8px;
          font-size: 1.08rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
          box-shadow: 0 1px 4px #223a5e11;
          outline: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .role-btn-custom.active, .role-btn-custom:hover, .role-btn-custom:focus {
          background: #1890ff;
          color: #fff;
          box-shadow: 0 2px 8px #1890ff33;
        }
        .queue-table-card {
          max-width: 700px;
          margin: 0 auto 24px auto;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 2px 16px #223a5e11;
          padding: 24px 18px 18px 18px;
          animation: fadeIn 0.4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        `}
      </style>
      {loading && <div>טוען...</div>}
      {error && <div>שגיאה בטעינת התפקידים</div>}
      {rolesArr.map(role => (
        <button
          key={role}
          className={`role-btn-custom${openRole === role ? " active" : ""}`}
          onClick={() => setOpenRole(openRole === role ? null : role)}
        >
          <InfoCircleOutlined style={{ fontSize: "1.2em" }} />
          {role}
        </button>
      ))}

      {openRole && (
        <div className="queue-table-card">
          <QueueTable currentRole={openRole} openNotification={openNotification} />
        </div>
      )}
    </div>
  );
};

export default QueuesByRole;