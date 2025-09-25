import { Box, Paper, Typography } from "@mui/material";

export default function UserProfile() {
  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h6">User Profile</Typography>
        <Typography variant="body2" color="text.secondary">
          Simple profile/details page.
        </Typography>
      </Paper>
    </Box>
  );
}
