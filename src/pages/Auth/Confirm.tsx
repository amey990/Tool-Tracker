// src/pages/Auth/Confirm.tsx
import {
  Alert,
  Box,
  Button,
  Link,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "./_AuthLayout";
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";

import brandLogo from "/assets/logo1.png";
import loginPhoto from "/assets/login_photo.png";

export default function Confirm() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const { search } = useLocation();

  // prefill email from ?email=
  const qsEmail = useMemo(() => {
    const p = new URLSearchParams(search);
    return (p.get("email") || "").trim();
  }, [search]);

  const [email, setEmail] = useState(qsEmail);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // toasts
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => setEmail(qsEmail), [qsEmail]);

  const ctaSx = isDark
    ? { bgcolor: "#fff", color: "#000", "&:hover": { bgcolor: "#eaeaea" } }
    : { bgcolor: "#000", color: "#fff", "&:hover": { bgcolor: "#111" } };

  const messageFromError = (e: any) => {
    const code = e?.name || e?.code;
    switch (code) {
      case "CodeMismatchException":
        return "The confirmation code is incorrect.";
      case "ExpiredCodeException":
        return "This code has expired. Please request a new one.";
      case "LimitExceededException":
        return "Too many attempts. Try again later.";
      case "UserNotFoundException":
        return "No account found for that email.";
      default:
        return e?.message || "Confirmation failed. Please try again.";
    }
  };

  const onConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !code) {
      setErrorMsg("Enter both email and the confirmation code.");
      return;
    }
    setLoading(true);
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      setSuccessMsg("Email verified! You can sign in now.");
      setTimeout(() => navigate("/login", { replace: true }), 1000);
    } catch (err: any) {
      setErrorMsg(messageFromError(err));
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (!email) {
      setErrorMsg("Enter your email first, then click Resend.");
      return;
    }
    setLoading(true);
    try {
      await resendSignUpCode({ username: email });
      setSuccessMsg("Verification email sent again. Please check your inbox.");
    } catch (err: any) {
      setErrorMsg(messageFromError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
    //   imageSrc={"/src/assets/login_photo.png"}
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
          Confirm your email
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: { xs: "center", md: "left" } }}>
          We’ve sent a 6-digit code to your email. Enter it below to verify your account.
        </Typography>

        <Stack spacing={2} component="form" noValidate onSubmit={onConfirm}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            required
          />
          <TextField
            label="Confirmation Code"
            value={code}
            onChange={(e) => setCode(e.target.value.trim())}
            inputProps={{ inputMode: "numeric", maxLength: 8 }}
            required
          />

          <Button
            type="submit"
            disabled={loading}
            fullWidth
            size="large"
            variant="contained"
            sx={{ ...ctaSx, height: 48, borderRadius: 24, boxShadow: 2 }}
          >
            {loading ? "Confirming..." : "Confirm Email"}
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
            Didn’t receive the code?{" "}
            <Link component="button" onClick={onResend} underline="hover" sx={{ fontWeight: 600 }}>
              Resend
            </Link>
          </Typography>

          <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
            Already confirmed?{" "}
            <Link href="/login" underline="hover" sx={{ fontWeight: 600 }}>
              Sign In
            </Link>
          </Typography>
        </Stack>
      </Box>

      {/* Toasts */}
      <Snackbar
        open={!!successMsg}
        autoHideDuration={3000}
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
