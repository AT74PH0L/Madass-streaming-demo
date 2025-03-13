import React, { useContext } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // เพิ่ม props สำหรับ allowedRoles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const auth = useContext(AuthContext);

  if (!auth?.user) {
    return <Navigate to="/" replace />; // ถ้าไม่ได้ล็อกอินให้ redirect ไปหน้า login
  }

  // ตรวจสอบว่า role ของผู้ใช้ตรงกับ allowedRoles หรือไม่
  if (allowedRoles.length && !allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/" replace />; // ถ้าไม่มีสิทธิ์เข้าถึง ให้ redirect ไปหน้า login
  }

  return <>{children}</>;
};

export default ProtectedRoute;
