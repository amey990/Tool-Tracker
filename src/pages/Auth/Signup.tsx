// import {
//   Box,
//   Button,
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
// import AuthLayout from "./_AuthLayout";

// export default function Signup() {
//   const theme = useTheme();
//   const [showPwd, setShowPwd] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const isDark = theme.palette.mode === "dark";

//   const ctaSx = isDark
//     ? { bgcolor: "#fff", color: "#000", "&:hover": { bgcolor: "#eaeaea" } }
//     : { bgcolor: "#000", color: "#fff", "&:hover": { bgcolor: "#111" } };

//   return (
//     <AuthLayout
//       imageSrc={"/src/assets/login_photo.png"}
//       brand={
//         <>
//           <Box
//             component="img"
//             src="/src/assets/logo1.png"
//             alt="ToolTrail"
//             sx={{
//               width: 60,
//               height: 60,
//               objectFit: "cover",
//               display: "block",
//             }}
//           />
//           <Typography fontSize={23} fontWeight={700} color="#000">
//             ToolTrail
//           </Typography>
//         </>
//       }
//     >
//       {/* Pull the form closer to the image on desktop to reduce the gap */}
//       <Box sx={{ ml: { md: -4 } }}>
//         <Typography variant="h4" sx={{ mb: 1, textAlign: { xs: "center", md: "left" } }}>
//           Create Account
//         </Typography>
//         <Typography
//           variant="body2"
//           color="text.secondary"
//           sx={{ mb: 3, textAlign: { xs: "center", md: "left" } }}
//         >
//           Enter your details to get started.
//         </Typography>

//         <Stack spacing={2} component="form" noValidate>
//           <TextField label="Full Name" required />
//           <TextField label="Email" type="email" required />

//           <TextField
//             label="Password"
//             type={showPwd ? "text" : "password"}
//             required
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={() => setShowPwd((s) => !s)}
//                     edge="end"
//                     aria-label="toggle password visibility"
//                   >
//                     {showPwd ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />

//           <TextField
//             label="Confirm Password"
//             type={showConfirm ? "text" : "password"}
//             required
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={() => setShowConfirm((s) => !s)}
//                     edge="end"
//                     aria-label="toggle confirm password visibility"
//                   >
//                     {showConfirm ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />

//           <Typography variant="caption" color="text.secondary">
//             By creating an account, you agree to our Terms & Privacy.
//           </Typography>

//           <Button
//             type="submit"
//             fullWidth
//             size="large"
//             variant="contained"
//             sx={{ ...ctaSx, height: 48, borderRadius: 24, boxShadow: 2 }}
//           >
//             Create Account
//           </Button>

//           <Typography variant="body2" sx={{ mt: 3, textAlign: "center", color: "#000" }}>
//             Already have an account?{" "}
//             <Link href="/login" underline="hover" sx={{ color: "#000", fontWeight: 600 }}>
//               Sign In
//             </Link>
//           </Typography>
//         </Stack>
//       </Box>
//     </AuthLayout>
//   );
// }


// Signup.tsx
import {
  Box,
  Button,
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
import AuthLayout from "./_AuthLayout";

export default function Signup() {
  const theme = useTheme();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const isDark = theme.palette.mode === "dark";

  const ctaSx = isDark
    ? { bgcolor: "#fff", color: "#000", "&:hover": { bgcolor: "#eaeaea" } }
    : { bgcolor: "#000", color: "#fff", "&:hover": { bgcolor: "#111" } };

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
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: { xs: "center", md: "left" } }}>
          Enter your details to get started.
        </Typography>

        <Stack spacing={2} component="form" noValidate>
          <TextField label="Full Name" required />
          <TextField label="Email" type="email" required />

          <TextField
            label="Password"
            type={showPwd ? "text" : "password"}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPwd((s) => !s)} edge="end" aria-label="toggle password visibility">
                    {showPwd ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirm Password"
            type={showConfirm ? "text" : "password"}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirm((s) => !s)}
                    edge="end"
                    aria-label="toggle confirm password visibility"
                  >
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Typography variant="caption" color="text.secondary">
            By creating an account, you agree to our Terms & Privacy.
          </Typography>

          <Button type="submit" fullWidth size="large" variant="contained" sx={{ ...ctaSx, height: 48, borderRadius: 24, boxShadow: 2 }}>
            Create Account
          </Button>

          {/* Theme-aware footer text + link */}
          <Typography variant="body2" sx={{ mt: 3, textAlign: "center", color: "text.primary" }}>
            Already have an account?{" "}
            <Link href="/login" underline="hover" sx={{ color: "text.primary", fontWeight: 600 }}>
              Sign In
            </Link>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
}
