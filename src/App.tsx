// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AppThemeProvider } from "./theme";
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
//           {/* Redirect root to login */}
//           <Route path="/" element={<Navigate to="/login" replace />} />

//           {/* Auth */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />

//           {/* App pages (each page manages its own layout for now) */}
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/tools" element={<Tools />} />
//           <Route path="/logs" element={<Logs />} />
//           <Route path="/users/:id" element={<UserProfile />} />
//         </Routes>
//       </BrowserRouter>
//     </AppThemeProvider>
//   );
// }



import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppThemeProvider } from "./theme";
import MainLayout from "./components/MainLayout";

import Dashboard from "./pages/Dashboard";
import Tools from "./pages/Tools";
import Logs from "./pages/Logs";
import UserProfile from "./pages/UserProfile";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

export default function App() {
  return (
    <AppThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth (no layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* App (with layout) */}
          <Route element={<MainLayout />}>
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
