// DynamicTitle.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DynamicTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      "/": "כניסה",
      "/login": "התחברות",
      "/user-profile": "אזור אישי",
      "/forgot-password": "שחזור סיסמה",
      "/reset-password": "איפוס סיסמה",
      "/alfon": "אלפון",
      "/add-person": "הוספת תורם",
      "/menu": "תפריט",
      "/commitments": "התחייבויות",
      "/commitment-details": "פרטי התחייבות",
      "/payments-without-commitment": "תשלומים ללא התחייבות",
      "/user-details": "פרטי משתמש",
      "/campains": "קמפיינים",
      "/campain": "ניהול קמפיין",
      "/edit-campain": "עריכת פרטי קמפיין",
      "/peopleincampain": "תורמים בקמפיין",
      "/memorial-board": "לוח הנצחה",
      "/petty-cash": "קופה קטנה",
      "/report-navigation": "דוחות",
      "/report-commitments": "דוח התחייבויות",
      "/report-payments": "דוח תשלומים",
    };

    // מציאת כותרת מתאימה או ברירת מחדל
    const path = location.pathname.split("/")[1];
    const title = titles[`/${path}`] || "ישיבת סאטמר";
    document.title = title;
  }, [location]);

  return null; // רכיב זה אינו מציג דבר
};

export default DynamicTitle;
