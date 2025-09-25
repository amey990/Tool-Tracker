

// import {
//   Box,
//   Button,
//   Checkbox,
//   FormControlLabel,
//   Link,
//   Stack,
//   TextField,
//   Typography,
//   InputAdornment,
//   IconButton,
//   useTheme,
// } from "@mui/material";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";   // <-- add this
// import AuthLayout from "./_AuthLayout";
// import GoogleButton from "./_GoogleButton";

// export default function Login() {
//   const theme = useTheme();
//   const [show, setShow] = useState(false);
//   const isDark = theme.palette.mode === "dark";
//   const navigate = useNavigate();                 // <-- add this

//   const ctaSx = isDark
//     ? { bgcolor: "#fff", color: "#000", "&:hover": { bgcolor: "#eaeaea" } }
//     : { bgcolor: "#000", color: "#fff", "&:hover": { bgcolor: "#111" } };

//   // simple client-side submit -> go to dashboard
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     navigate("/dashboard");                       // <-- go to dashboard
//   };

//   return (
//     <AuthLayout
//       imageSrc={"/src/assets/login_photo.png"}
//       brand={
//         <>
//           <Box component="img" 
//           src="/src/assets/logo1.png" 
//           alt="ToolTrail" 
//           sx={{ width: 60, 
//           height: 60, 
//           objectFit: "cover", 
//           display: "block" }} />
//           <Typography fontSize={23} fontWeight={700} color="#000">ToolTrail</Typography>
//         </>
//       }
//     >
//       <Box sx={{ ml: { md: -4 } }}>
//         <Typography variant="h4" sx={{ mb: 1, textAlign: { xs: "center", md: "left" } }}>
//           Welcome Back
//         </Typography>
//         <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: { xs: "center", md: "left" } }}>
//           Enter your email and password to access your account.
//         </Typography>

//         {/* add onSubmit here */}
//         <Stack spacing={2} component="form" noValidate onSubmit={handleSubmit}>
//           <TextField label="Email" type="email" required />
//           <TextField
//             label="Password"
//             type={show ? "text" : "password"}
//             required
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={() => setShow((s) => !s)} edge="end" aria-label="toggle password visibility">
//                     {show ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />

//           <Stack direction="row" alignItems="center" justifyContent="space-between">
//             <FormControlLabel control={<Checkbox size="small" />} label="Remember me" />
//             <Link component="button" type="button" underline="hover" sx={{ color: "#000" }}>
//               Forgot Password
//             </Link>
//           </Stack>

//           <Button type="submit" fullWidth size="large" variant="contained" sx={{ ...ctaSx, height: 48, borderRadius: 24, boxShadow: 2 }}>
//             Sign In
//           </Button>

//           <GoogleButton label="Sign in with Google" />

//           <Typography variant="body2" sx={{ mt: 3, textAlign: "center", color: "#000" }}>
//             Don’t have an account? <Link href="/signup" underline="hover" sx={{ color: "#000", fontWeight: 600 }}>Sign Up</Link>
//           </Typography>
//         </Stack>
//       </Box>
//     </AuthLayout>
//   );
// }

// Login.tsx
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  useTheme,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./_AuthLayout";
import GoogleButton from "./_GoogleButton";

export default function Login() {
  const theme = useTheme();
  const [show, setShow] = useState(false);
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const ctaSx = isDark
    ? { bgcolor: "#fff", color: "#000", "&:hover": { bgcolor: "#eaeaea" } }
    : { bgcolor: "#000", color: "#fff", "&:hover": { bgcolor: "#111" } };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <AuthLayout
      imageSrc={"/src/assets/login_photo.png"}
      brand={
        <>
          <Box
            component="img"
            src="/src/assets/logo1.png"
            alt="ToolTrail"
            sx={{ width: 60, height: 60, objectFit: "cover", display: "block" }}
          />
          {/* Theme-aware brand text */}
          <Typography fontSize={23} fontWeight={700} color="text.primary">
            ToolTrail
          </Typography>
        </>
      }
    >
      <Box sx={{ ml: { md: -4 } }}>
        <Typography variant="h4" sx={{ mb: 1, textAlign: { xs: "center", md: "left" } }}>
          Welcome Back
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, textAlign: { xs: "center", md: "left" } }}
        >
          Enter your email and password to access your account.
        </Typography>

        <Stack spacing={2} component="form" noValidate onSubmit={handleSubmit}>
          <TextField label="Email" type="email" required />
          <TextField
            label="Password"
            type={show ? "text" : "password"}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShow((s) => !s)} edge="end" aria-label="toggle password visibility">
                    {show ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <FormControlLabel control={<Checkbox size="small" />} label="Remember me" />
            {/* Theme-aware link */}
            <Link component="button" type="button" underline="hover" sx={{ color: "text.primary" }}>
              Forgot Password
            </Link>
          </Stack>

          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            sx={{ ...ctaSx, height: 48, borderRadius: 24, boxShadow: 2 }}
          >
            Sign In
          </Button>

          <GoogleButton label="Sign in with Google" />

          {/* Theme-aware footer text + link */}
          <Typography variant="body2" sx={{ mt: 3, textAlign: "center", color: "text.primary" }}>
            Don’t have an account?{" "}
            <Link href="/signup" underline="hover" sx={{ color: "text.primary", fontWeight: 600 }}>
              Sign Up
            </Link>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
}


