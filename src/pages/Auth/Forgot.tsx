import {
  Alert, Box, Button, Link, Snackbar, Stack, TextField, Typography, useTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./_AuthLayout";
import { resetPassword } from "aws-amplify/auth";

export default function Forgot() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const ctaSx = isDark
    ? { bgcolor: "#fff", color: "#000", "&:hover": { bgcolor: "#eaeaea" } }
    : { bgcolor: "#000", color: "#fff", "&:hover": { bgcolor: "#111" } };

  const messageFromError = (e: any) =>
    e?.message || e?.name || "Failed to send code. Please try again.";

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setErrorMsg("Enter your email."); return; }
    setLoading(true);
    try {
      await resetPassword({ username: email });
      setSuccessMsg("Verification code sent. Check your email.");
      setTimeout(() => {
        navigate(`/reset?email=${encodeURIComponent(email)}`, { replace: true });
      }, 700);
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
          Forgot password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: { xs: "center", md: "left" } }}>
          Enter your email and we’ll send you a verification code.
        </Typography>

        <Stack spacing={2} component="form" noValidate onSubmit={onSend}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            required
          />
          <Button type="submit" disabled={loading} fullWidth size="large" variant="contained"
                  sx={{ ...ctaSx, height: 48, borderRadius: 24, boxShadow: 2 }}>
            {loading ? "Sending..." : "Send Code"}
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
            Remember password?{" "}
            <Link href="/login" underline="hover" sx={{ fontWeight: 600 }}>Sign In</Link>
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
