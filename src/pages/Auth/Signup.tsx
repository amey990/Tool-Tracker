// Signup.tsx
import {
  Alert,
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Snackbar,
  useTheme,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./_AuthLayout";
import { signUp } from "aws-amplify/auth";

import brandLogo from "/assets/logo1.png";
import loginPhoto from "/assets/login_photo.png";

export default function Signup() {
  const theme = useTheme();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  // form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [loading, setLoading] = useState(false);

  // toasts
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const ctaSx = isDark
    ? { bgcolor: "#fff", color: "#000", "&:hover": { bgcolor: "#eaeaea" } }
    : { bgcolor: "#000", color: "#fff", "&:hover": { bgcolor: "#111" } };

  const messageFromError = (e: any): string => {
    const code = e?.name || e?.code;
    switch (code) {
      case "UsernameExistsException":
        return "An account with this email already exists.";
      case "InvalidPasswordException":
        return "Password does not meet the policy requirements.";
      case "InvalidParameterException":
        return "Please check your details and try again.";
      default:
        return e?.message || "Sign-up failed. Please try again.";
    }
  };

  const validate = () => {
    if (!fullName || !email || !pwd || !pwd2) {
      setErrorMsg("Please fill all required fields.");
      return false;
    }
    if (pwd.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return false;
    }
    if (pwd !== pwd2) {
      setErrorMsg("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await signUp({
        username: email,
        password: pwd,
        options: {
          userAttributes: {
            email,
            name: fullName,
          },
          autoSignIn: false,
        },
      });

      // setSuccessMsg("Account created! We’ve sent a verification email. Please confirm and then sign in.");
      setSuccessMsg("Account created! We’ve sent a verification email. Please confirm.");
      // small delay so users can read, then go to login
      // setTimeout(() => navigate("/login", { replace: true }), 1200);
      
      setTimeout(() => navigate(`/confirm?email=${encodeURIComponent(email)}`, { replace: true }), 1200);
    } catch (err: any) {
      setErrorMsg(messageFromError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      // imageSrc={"/src/assets/login_photo.png"}
       imageSrc={loginPhoto}  
      brand={
        <>
          <Box
            component="img"
            // src="/src/assets/logo1.png"
            src={brandLogo}  
            alt="ToolTrail"
            sx={{ width: 60, height: 60, objectFit: "cover", display: "block" }}
          />
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

        <Stack spacing={2} component="form" noValidate onSubmit={handleSubmit}>
          <TextField label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value.trim())} required />

          <TextField
            label="Password"
            type={showPwd ? "text" : "password"}
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
            helperText="Minimum 8 characters, with upper/lower/number recommended."
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
            value={pwd2}
            onChange={(e) => setPwd2(e.target.value)}
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

          <Button
            type="submit"
            disabled={loading}
            fullWidth
            size="large"
            variant="contained"
            sx={{ ...ctaSx, height: 48, borderRadius: 24, boxShadow: 2 }}
          >
            {loading ? "Creating..." : "Create Account"}
          </Button>

          <Typography variant="body2" sx={{ mt: 3, textAlign: "center", color: "text.primary" }}>
            Already have an account?{" "}
            <Link href="/login" underline="hover" sx={{ color: "text.primary", fontWeight: 600 }}>
              Sign In
            </Link>
          </Typography>
        </Stack>
      </Box>

      {/* Toasts */}
      <Snackbar
        open={!!successMsg}
        autoHideDuration={3500}
        onClose={() => setSuccessMsg(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setSuccessMsg(null)} severity="success" variant="filled" sx={{ width: "100%" }}>
          {successMsg}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMsg}
        autoHideDuration={4000}
        onClose={() => setErrorMsg(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setErrorMsg(null)} severity="error" variant="filled" sx={{ width: "100%" }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </AuthLayout>
  );
}

