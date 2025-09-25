import { Box, Container } from "@mui/material";
import React from "react";

type Props = {
  imageSrc: string;
  children: React.ReactNode;
  /** Brand element (logo + text) to show at the top-right, outside the form */
  brand?: React.ReactNode;
};

export default function AuthLayout({ imageSrc, children, brand }: Props) {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gridAutoRows: "1fr",
        overflow: "hidden", // prevent scroll on auth pages
        bgcolor: (t) => t.palette.background.default,
      }}
    >
      {/* Form (right on desktop, first on mobile) */}
      <Box
        sx={{
          order: { xs: 1, md: 2 },
          position: "relative",         // allow top-right brand positioning
          display: "grid",
          placeItems: "center",
          p: { xs: 3, md: 6 },
        }}
      >
        {/* Top-right brand (outside form) */}
        {brand && (
          <Box
            sx={{
              position: "absolute",
              top: { xs: 16, md: 15 },
              right: { xs: 16, md: 20 },
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {brand}
          </Box>
        )}

        <Container maxWidth="sm" sx={{ maxWidth: 440 }}>
          {children}
        </Container>
      </Box>

      {/* Image-only (left) */}
      <Box sx={{ order: { xs: 2, md: 1 }, p: { xs: 2, md: 1.5 }, display: "grid" }}>
        <Box
          sx={{
            borderRadius: 2,            // gentle curve, not too round
            overflow: "hidden",
            minHeight: { xs: "40vh", md: "100%" },
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Box>
    </Box>
  );
}


