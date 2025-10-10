// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AppThemeProvider } from "./theme";
// import MainLayout from "./components/MainLayout";

// import Dashboard from "./pages/Dashboard";
// import Tools from "./pages/Tools";
// import Logs from "./pages/Logs";
// import UserProfile from "./pages/UserProfile";

// import Login from "./pages/Auth/Login";
// import Signup from "./pages/Auth/Signup";

// export default function App() {
//   return (
//     <AppThemeProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Navigate to="/login" replace />} />

//           {/* Auth (no layout) */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />

//           {/* App (with layout) */}
//           <Route element={<MainLayout />}>
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/tools" element={<Tools />} />
//             <Route path="/logs" element={<Logs />} />
//             <Route path="/users/:id" element={<UserProfile />} />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </AppThemeProvider>
//   );
// }


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppThemeProvider } from "./theme";
import MainLayout from "./components/MainLayout";
import type { ReactNode } from "react";
import Dashboard from "./pages/Dashboard";
import Tools from "./pages/Tools";
import Logs from "./pages/Logs";
import UserProfile from "./pages/UserProfile";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

import Forgot from "./pages/Auth/Forgot";
import Reset from "./pages/Auth/Reset";

import Confirm from "./pages/Auth/Confirm"; // <- new

function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;                // or a loader
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <AppThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Default landing – you can also make this smart if you want */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth (no layout) */}
          <Route
            path="/login"
            element={
              <RedirectIfAuthed>
                <Login />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectIfAuthed>
                <Signup />
              </RedirectIfAuthed>
            }
          />

          <Route path="/confirm" element={<Confirm />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset" element={<Reset />} />


          {/* App (with layout) – protected */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/users/:id" element={<UserProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppThemeProvider>
  );
}

