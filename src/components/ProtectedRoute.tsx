// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import type { ReactNode } from "react";

// export default function ProtectedRoute({ children }: { children: ReactNode }) {
//   const { user, loading } = useAuth();
//   if (loading) return null; // or a loader
//   return user ? children : <Navigate to="/login" replace />;
// }


import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

// If you prefer, return a spinner instead of null while loading
export default function ProtectedRoute({ children }: { children: ReactNode  }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}
