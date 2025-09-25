import { Box, Button } from "@mui/material";

export default function GoogleButton({ label }: { label: string }) {
  return (
    <Button
      fullWidth
      variant="outlined"
      startIcon={
        <Box
          component="img"
          src="/src/assets/Google.png"   // <-- your logo asset
          alt="Google"
          sx={{ width: 32, height: 32 }}
        />
      }
      sx={{
        height: 48,
        borderRadius: 9999,
        borderWidth: 1.5,
        textTransform: "none",
      }}
    >
      {label}
    </Button>
  );
}
