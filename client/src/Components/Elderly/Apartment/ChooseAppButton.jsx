import { Button } from "antd";

const ChooseAppButton = () => {
   // פונקציה לעדכון הדירה לזקן
   const handleSelectApartment = ({apartmentId,elderlyId}) => {  

    axios.patch(`http://localhost:8080/Elderly/updateApartmentForElderly/${elderlyId}`, {
      apartmentId: apartmentId
    })
      .then(response => {
        message.success('הדירה נבחרה הצלחה');
      })
      .catch(() => {
        message.error('שגיאה בבחירת הדירה');
      });
  };

  return (
 <>
 {/* כפתור "בחירת דירה" */}
 <Button
            type="primary"
            style={{ marginTop: '20px' }}
            onClick={handleSelectApartment}
          >
            בחר דירה
          </Button>
 </>
  );
}
export default ChooseAppButton;