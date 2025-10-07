// import {
//   Box,
//   Button,
//   Divider,
//   MenuItem,
//   Paper,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { useState } from "react";
// import { useTheme } from "@mui/material/styles";

// const BRAND_GREEN = "#78B83B";
// const CATEGORIES = ["Laptop", "Network", "Measurement", "Accessory", "Other"] as const;

// type ToolForm = {
//   name: string;
//   serial: string;
//   owner: string;
//   assetTag: string;
//   category: (typeof CATEGORIES)[number] | "";
//   remarks: string;
// };

// export default function Tools() {
//   const theme = useTheme();

//   const initial: ToolForm = {
//     name: "",
//     serial: "",
//     owner: "",
//     assetTag: "",
//     category: "",
//     remarks: "",
//   };
//   const [form, setForm] = useState<ToolForm>(initial);

//   const update =
//     (k: keyof ToolForm) =>
//     (e: React.ChangeEvent<HTMLInputElement>) =>
//       setForm((f) => ({ ...f, [k]: e.target.value }));

//   const canSubmit =
//     form.name && form.serial && form.owner && form.assetTag && form.category;

//   const fieldSx = { flex: "1 1 320px", minWidth: 0 };

//   const clear = () => setForm(initial);

//   return (
//     <Box>
//       <Paper
//         variant="outlined"
//         sx={{
//           mx: { xs: 1, sm: 0 },
//           p: { xs: 1.5, sm: 2 },
//           borderRadius: 1,
//         }}
//       >
//         <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
//           <Box>
//             <Typography variant="h6" sx={{ fontWeight: 700 }}>
//               Tools &amp; Equipment
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Add a new tool or equipment item.
//             </Typography>
//           </Box>

//           <Button variant="outlined" onClick={clear} sx={{ borderRadius: 1, textTransform: "none" }}>
//             Clear
//           </Button>
//         </Stack>

//         <Divider sx={{ mb: 2 }} />

//         <Stack spacing={2}>
//           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
//             <TextField
//               label="Tool / Item Name *"
//               value={form.name}
//               onChange={update("name")}
//               sx={fieldSx}
//             />
//             <TextField
//               label="Serial Number *"
//               value={form.serial}
//               onChange={update("serial")}
//               sx={fieldSx}
//             />
//             <TextField
//               label="Owner Name *"
//               value={form.owner}
//               onChange={update("owner")}
//               sx={fieldSx}
//             />
//           </Box>

//           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
//             <TextField
//               label="Asset Tag *"
//               value={form.assetTag}
//               onChange={update("assetTag")}
//               sx={fieldSx}
//             />

//             {/* Category — vertically centered text */}
//             <TextField
//               select
//               label="Category *"
//               value={form.category}
//               onChange={update("category")}
//               sx={{
//                 ...fieldSx,
//                 height: 56,
//                 "& .MuiSelect-select": {
//                   height: 56,
//                   display: "flex",
//                   alignItems: "center",
                  
//                 },
//               }}
//               SelectProps={{
//                 MenuProps: { PaperProps: { sx: { bgcolor: "background.paper" } } },
//               }}
//             >
//               {CATEGORIES.map((c) => (
//                 <MenuItem key={c} value={c}>
//                   {c}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Box>

//           {/* Remarks (optional) */}
//          {/* Remarks — single line, vertically centered like other fields */}
// <TextField
//   label="Remarks"
//   value={form.remarks}
//   onChange={update("remarks")}
//   sx={{
//     width: "100%",
//     "& .MuiInputBase-root": { height: 56 },
//     "& .MuiInputBase-input": {
//       height: 56,
//       display: "flex",
//       alignItems: "center",
//       boxSizing: "border-box",
//       padding: "0 14px",
//     },
//   }}
// />

//           <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//             <Button
//               variant="contained"
//               disabled={!canSubmit}
//               sx={{
//                 minWidth: 140,
//                 borderRadius: 1,
//                 textTransform: "none",
//                 bgcolor: BRAND_GREEN,
//                 color: "#0F0F0F",
//                 "&:hover": { bgcolor: "#6EAD35" },
//                 "&.Mui-disabled": {
//                   bgcolor:
//                     theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
//                   color: "text.disabled",
//                 },
//               }}
//               onClick={() => console.log("Add tool:", form)}
//             >
//               Add Item
//             </Button>
//           </Box>
//         </Stack>
//       </Paper>
//     </Box>
//   );
// }


import {
  Alert,
  Box,
  Button,
  Divider,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { API_BASE } from "../config";

const BRAND_GREEN = "#78B83B";
const CATEGORIES = ["Laptop", "Network", "Measurement", "Accessory", "Other"] as const;

type ToolForm = {
  name: string;
  serial: string;
  owner: string;
  assetTag: string;
  category: (typeof CATEGORIES)[number] | "";
  remarks: string;
};

export default function Tools() {
  const theme = useTheme();

  const initial: ToolForm = {
    name: "",
    serial: "",
    owner: "",
    assetTag: "",
    category: "",
    remarks: "",
  };

  const [form, setForm] = useState<ToolForm>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const update =
    (k: keyof ToolForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const canSubmit =
    !!form.name && !!form.serial && !!form.owner && !!form.assetTag && !!form.category;

  const fieldSx = { flex: "1 1 320px", minWidth: 0 };

  const clear = () => setForm(initial);

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      // Map UI form -> API payload
      const payload = {
        name: form.name,
        serial_no: form.serial,
        owner_name: form.owner,
        asset_tag: form.assetTag,
        category: form.category,
        remarks: form.remarks || null,
      };

      const res = await fetch(`${API_BASE}/tools`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || res.statusText || "Failed to add tool");
      }

      setSuccessMsg("Tool added successfully");
      clear();
    } catch (err: any) {
      setErrorMsg(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Paper
        variant="outlined"
        sx={{
          mx: { xs: 1, sm: 0 },
          p: { xs: 1.5, sm: 2 },
          borderRadius: 1,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Tools &amp; Equipment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add a new tool or equipment item.
            </Typography>
          </Box>

          <Button variant="outlined" onClick={clear} sx={{ borderRadius: 1, textTransform: "none" }}>
            Clear
          </Button>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={2}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              label="Tool / Item Name *"
              value={form.name}
              onChange={update("name")}
              sx={fieldSx}
            />
            <TextField
              label="Serial Number *"
              value={form.serial}
              onChange={update("serial")}
              sx={fieldSx}
            />
            <TextField
              label="Owner Name *"
              value={form.owner}
              onChange={update("owner")}
              sx={fieldSx}
            />
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              label="Asset Tag *"
              value={form.assetTag}
              onChange={update("assetTag")}
              sx={fieldSx}
            />

            <TextField
              select
              label="Category *"
              value={form.category}
              onChange={update("category")}
              sx={{
                ...fieldSx,
                height: 56,
                "& .MuiSelect-select": {
                  height: 56,
                  display: "flex",
                  alignItems: "center",
                },
              }}
              SelectProps={{
                MenuProps: { PaperProps: { sx: { bgcolor: "background.paper" } } },
              }}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Remarks — single line, vertically centered like other fields */}
          <TextField
            label="Remarks"
            value={form.remarks}
            onChange={update("remarks")}
            sx={{
              width: "100%",
              "& .MuiInputBase-root": { height: 56 },
              "& .MuiInputBase-input": {
                height: 56,
                display: "flex",
                alignItems: "center",
                boxSizing: "border-box",
                padding: "0 14px",
              },
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              disabled={!canSubmit || submitting}
              sx={{
                minWidth: 140,
                borderRadius: 1,
                textTransform: "none",
                bgcolor: BRAND_GREEN,
                color: "#0F0F0F",
                "&:hover": { bgcolor: "#6EAD35" },
                "&.Mui-disabled": {
                  bgcolor:
                    theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                  color: "text.disabled",
                },
              }}
              onClick={handleSubmit}
            >
              {submitting ? "Adding..." : "Add Item"}
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* Notifications */}
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
    </Box>
  );
}
