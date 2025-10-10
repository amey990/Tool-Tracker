// Login.tsx
import {
  Alert,
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
  Snackbar,
  useTheme,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./_AuthLayout";
import { signIn, resendSignUpCode } from "aws-amplify/auth";
import { useAuth } from "../../context/AuthContext";

import brandLogo from "/assets/logo1.png";
import loginPhoto from "/assets/login_photo.png";

export default function Login() {
  const theme = useTheme();
  const [show, setShow] = useState(false);
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const { refresh } = useAuth();

  // form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false); // not used yet, but kept for UI
  const [loading, setLoading] = useState(false);

  // toasts
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // if user is unconfirmed, show helper to re-send code
  const [unconfirmed, setUnconfirmed] = useState(false);

  const ctaSx = isDark
    ? { bgcolor: "#fff", color: "#000", "&:hover": { bgcolor: "#eaeaea" } }
    : { bgcolor: "#000", color: "#fff", "&:hover": { bgcolor: "#111" } };

  const messageFromError = (e: any): string => {
    const code = e?.name || e?.code;
    switch (code) {
      case "UserNotFoundException":
        return "No account found for that email.";
      case "NotAuthorizedException":
        return "Invalid email or password.";
      case "UserNotConfirmedException":
        return "Your email is not verified yet. Please check your inbox.";
      case "TooManyRequestsException":
        return "Too many attempts. Please try again in a moment.";
      default:
        return e?.message || "Sign-in failed. Please try again.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnconfirmed(false);

    // basic validation
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await signIn({ username: email, password });
      setSuccessMsg("Signed in successfully.");
      await refresh();
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const msg = messageFromError(err);
      setErrorMsg(msg);
      if (err?.name === "UserNotConfirmedException") {
        setUnconfirmed(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (!email) {
      setErrorMsg("Enter your email first, then click Resend.");
      return;
    }
    try {
      await resendSignUpCode({ username: email });
      setSuccessMsg("Verification email sent again. Check your inbox.");
    } catch (err: any) {
      setErrorMsg(err?.message || "Could not resend verification email.");
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
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            required
          />
          <TextField
            label="Password"
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            <FormControlLabel
              control={<Checkbox size="small" checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
              label="Remember me"
            />
            {/* <Link component="button" type="button" underline="hover" sx={{ color: "text.primary" }}>
              Forgot Password
            </Link> */}
            <Link href="/forgot" underline="hover" sx={{ color: "text.primary" }}>
  Forgot Password
</Link>
          </Stack>

          <Button
            type="submit"
            disabled={loading}
            fullWidth
            size="large"
            variant="contained"
            sx={{ ...ctaSx, height: 48, borderRadius: 24, boxShadow: 2 }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          {unconfirmed && (
            <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
              Didn’t get the email?{" "}
              <Link component="button" onClick={resendCode} underline="hover" sx={{ fontWeight: 600 }}>
                Resend verification
              </Link>
            </Typography>
          )}

          <Typography variant="body2" sx={{ mt: 3, textAlign: "center", color: "text.primary" }}>
            Don’t have an account?{" "}
            <Link href="/signup" underline="hover" sx={{ color: "text.primary", fontWeight: 600 }}>
              Sign Up
            </Link>
          </Typography>
        </Stack>
      </Box>

      {/* Toasts */}
      <Snackbar
        open={!!successMsg}
        autoHideDuration={2500}
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





