import {
  Alert, Box, Button, Link, Snackbar, Stack, TextField, Typography, InputAdornment, IconButton, useTheme,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "./_AuthLayout";
import { confirmResetPassword } from "aws-amplify/auth";

export default function Reset() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const { search } = useLocation();

  const qsEmail = useMemo(() => {
    const p = new URLSearchParams(search);
    return (p.get("email") || "").trim();
  }, [search]);

  const [email, setEmail] = useState(qsEmail);
  const [code, setCode] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [loading, setLoading] = useState(false);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => setEmail(qsEmail), [qsEmail]);

  const ctaSx = isDark
    ? { bgcolor: "#fff", color: "#000", "&:hover": { bgcolor: "#eaeaea" } }
    : { bgcolor: "#000", color: "#fff", "&:hover": { bgcolor: "#111" } };

  const messageFromError = (e: any) => {
    const code = e?.name || e?.code;
    switch (code) {
      case "CodeMismatchException": return "The confirmation code is incorrect.";
      case "ExpiredCodeException": return "This code has expired. Request a new one.";
      case "InvalidPasswordException": return "Password doesn’t meet policy requirements.";
      case "UserNotFoundException": return "No account found for that email.";
      default: return e?.message || "Could not reset password. Please try again.";
    }
  };

  const onReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !code || !pwd || !pwd2) {
      setErrorMsg("Fill all fields."); return;
    }
    if (pwd !== pwd2) {
      setErrorMsg("Passwords do not match."); return;
    }
    setLoading(true);
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: pwd,
      });
      setSuccessMsg("Password changed successfully. Sign in with your new password.");
      setTimeout(() => navigate("/login", { replace: true }), 1000);
    } catch (err: any) {
      setErrorMsg(messageFromError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      imageSrc={"/src/assets/login_photo.png"}
      brand={
        <>
          <Box component="img" src="/src/assets/logo1.png" alt="ToolTrail"
               sx={{ width: 60, height: 60, objectFit: "cover", display: "block" }} />
          <Typography fontSize={23} fontWeight={700} color="text.primary">ToolTrail</Typography>
        </>
      }
    >
      <Box sx={{ ml: { md: -4 } }}>
        <Typography variant="h4" sx={{ mb: 1, textAlign: { xs: "center", md: "left" } }}>
          Reset password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: { xs: "center", md: "left" } }}>
          Enter the verification code we emailed you, then set a new password.
        </Typography>

        <Stack spacing={2} component="form" noValidate onSubmit={onReset}>
          <TextField label="Email" type="email" value={email}
                     onChange={(e) => setEmail(e.target.value.trim())} required />

          <TextField label="Verification Code" value={code}
                     onChange={(e) => setCode(e.target.value.trim())}
                     inputProps={{ inputMode: "numeric", maxLength: 8 }} required />

          <TextField
            label="New Password"
            type={showPwd ? "text" : "password"}
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPwd((s) => !s)} edge="end">
                    {showPwd ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirm Password"
            type={showPwd2 ? "text" : "password"}
            value={pwd2}
            onChange={(e) => setPwd2(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPwd2((s) => !s)} edge="end">
                    {showPwd2 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button type="submit" disabled={loading} fullWidth size="large" variant="contained"
                  sx={{ ...ctaSx, height: 48, borderRadius: 24, boxShadow: 2 }}>
            {loading ? "Saving..." : "Save New Password"}
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
            Back to{" "}
            <Link href="/login" underline="hover" sx={{ fontWeight: 600 }}>
              Sign In
            </Link>
          </Typography>
        </Stack>
      </Box>

      <Snackbar open={!!successMsg} autoHideDuration={3000}
        onClose={() => setSuccessMsg(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={() => setSuccessMsg(null)} severity="success" variant="filled" sx={{ width: "100%" }}>
          {successMsg}
        </Alert>
      </Snackbar>

      <Snackbar open={!!errorMsg} autoHideDuration={4000}
        onClose={() => setErrorMsg(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={() => setErrorMsg(null)} severity="error" variant="filled" sx={{ width: "100%" }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </AuthLayout>
  );
}
