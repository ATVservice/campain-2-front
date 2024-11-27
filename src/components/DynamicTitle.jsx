// DynamicTitle.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DynamicTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      "/": "כניסה",
      "/login": "התחברות",
      "/forgot-password": "שחזור סיסמה",
      "/reset-password": "איפוס סיסמה",
      "/alfon": "אלפון",
      "/menu": "תפריט",
      "/commitments": "התחייבויות",
      "/user-details": "פרטי משתמש",
      "/campains": "קמפיינים",
      "/memorial-Board": "לוח זיכרון",
      "/petty-cash": "קופה קטנה",
    };

    // מציאת כותרת מתאימה או ברירת מחדל
    const path = location.pathname.split("/")[1];
    const title = titles[`/${path}`] || "ברוך הבא";
    document.title = title;
  }, [location]);

  return null; // רכיב זה אינו מציג דבר
};

export default DynamicTitle;
