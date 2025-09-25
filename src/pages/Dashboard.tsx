// import {
//   Box,
//   Button,
//   Divider,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Pagination,
//   Paper,
//   Select,
//   Stack,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   ToggleButton,
//   ToggleButtonGroup,
//   Typography,
// } from "@mui/material";
// import { useEffect, useMemo, useState } from "react";

// type EntryForm = {
//   itemName: string;
//   serialNo: string;
//   issuedTo: string;
//   issueDate: string;  // yyyy-mm-dd
//   returnBy: string;   // yyyy-mm-dd
//   location: string;
//   issuedBy: string;
//   remarks: string;
// };

// type Row = {
//   id: number;
//   itemName: string;
//   serialNo: string;
//   issuedTo: string;
//   issueDate: string;
//   returnBy: string;
//   location: string;
//   issuedBy: string;
//   remarks: string;
//   status: "Issued" | "Returned" | "Overdue";
// };

// const ITEMS = ["All", "Laptop", "Access Point", "LAN Tester", "Crimping Tool", "HDMI Cable"] as const;
// const STATUSES = ["All", "Issued", "Returned", "Overdue"] as const;
// const BRAND_GREEN = "#78B83B";

// // demo rows
// const makeRows = (): Row[] => {
//   const base: Omit<Row, "id" | "serialNo" | "itemName" | "issuedTo" | "status"> = {
//     issuedBy: "fe1@example.com",
//     issueDate: "2025-09-10",
//     returnBy: "2025-09-11",
//     location: "Lab-1",
//     remarks: "N/A",
//   };
//   const pool: Array<Pick<Row, "itemName" | "issuedTo" | "status">> = [
//     { itemName: "Laptop",       issuedTo: "Amey",   status: "Issued"   },
//     { itemName: "Access Point", issuedTo: "Priya",  status: "Returned" },
//     { itemName: "LAN Tester",   issuedTo: "Jin",    status: "Overdue"  },
//     { itemName: "Crimping Tool",issuedTo: "Fatima", status: "Issued"   },
//     { itemName: "HDMI Cable",   issuedTo: "Amey",   status: "Returned" },
//   ];
//   const out: Row[] = [];
//   for (let i = 1; i <= 48; i++) {
//     const p = pool[i % pool.length];
//     out.push({
//       id: i,
//       itemName: p.itemName,
//       serialNo: `SN-${1000 + i}`,
//       issuedTo: p.issuedTo,
//       status: p.status,
//       ...base,
//       issueDate: new Date(2025, 8, 10 + (i % 20)).toISOString().slice(0, 10),
//       returnBy: new Date(2025, 8, 11 + (i % 20)).toISOString().slice(0, 10),
//       location: ["Lab-1", "Lab-2", "Store", "HQ"][i % 4],
//       issuedBy: `fe${(i % 4) + 1}@example.com`,
//       remarks: i % 3 === 0 ? "—" : "N/A",
//     });
//   }
//   return out;
// };

// export default function Dashboard() {
//   // view toggle
//   const [view, setView] = useState<"all" | "issue">("all");

//   // filters
//   const [itemFilter, setItemFilter] = useState<(typeof ITEMS)[number]>("All");
//   const [statusFilter, setStatusFilter] = useState<(typeof STATUSES)[number]>("All");

//   // table data / paging
//   const [rows] = useState<Row[]>(() => makeRows());
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   useEffect(() => setPage(1), [itemFilter, statusFilter, rowsPerPage]);

//   const filtered = useMemo(
//     () => rows.filter(r =>
//       (itemFilter === "All" || r.itemName === itemFilter) &&
//       (statusFilter === "All" || r.status === statusFilter)
//     ),
//     [rows, itemFilter, statusFilter]
//   );

//   const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
//   const paginated = useMemo(
//     () => filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage),
//     [filtered, page, rowsPerPage]
//   );

//   // form (Issue New)
//   const initialForm: EntryForm = {
//     itemName: "", serialNo: "", issuedTo: "",
//     issueDate: "", returnBy: "", location: "",
//     issuedBy: "", remarks: "",
//   };
//   const [form, setForm] = useState<EntryForm>(initialForm);
//   const update =
//     (k: keyof EntryForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
//       setForm(f => ({ ...f, [k]: e.target.value }));
//   const handleClear = () => setForm(initialForm);
//   const disableIssue =
//     !form.itemName || !form.serialNo || !form.issuedTo ||
//     !form.issueDate || !form.returnBy || !form.location || !form.issuedBy;

//   const field = { flex: "1 1 320px", minWidth: 0 };

//   return (
//     <Box>
//       {/* Toggle */}
//       <ToggleButtonGroup
//         value={view}
//         exclusive
//         onChange={(_, v) => v && setView(v)}
//         size="small"
//         sx={{
//           mb: 1,
//           borderRadius: 9999,
//           p: 0.25,
//           bgcolor: (t) => t.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
//           "& .MuiToggleButton-root": {
//             textTransform: "none",
//             border: 0,
//             borderRadius: 9999,
//             px: 2, py: 0.2, color: "text.secondary",
//             "&.Mui-selected": {
//               bgcolor: (t) => t.palette.mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)",
//               color: "text.primary",
//               "&:hover": {
//                 bgcolor: (t) => t.palette.mode === "dark" ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.14)",
//               },
//             },
//             "&:hover": { backgroundColor: "action.hover" },
//           },
//         }}
//       >
//         <ToggleButton value="all">All items</ToggleButton>
//         <ToggleButton value="issue">Issue New</ToggleButton>
//       </ToggleButtonGroup>

//       {/* ===================== ALL ITEMS ===================== */}
//       {view === "all" && (
//         <Paper
//           variant="outlined"
//           sx={{
//             mx: { xs: 1, sm: 0 },
//             p: { xs: 1.5, sm: 2 },
//             height: { xs: "calc(100vh - 190px)", md: "calc(100vh - 120px)" },
//             display: "flex",
//             flexDirection: "column",
//             overflow: "hidden",
//           }}
//         >
//           {/* Header row + filters */}
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
//             <Typography variant="h6" sx={{ fontWeight: 700 }}>All Items</Typography>

//             <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
//               <FormControl size="small" sx={{ minWidth: 220 }}>
//                 <InputLabel>Item Name</InputLabel>
//                 <Select
//                   label="Item Name"
//                   value={itemFilter}
//                   onChange={e => setItemFilter(e.target.value as any)}
//                 >
//                   {ITEMS.map(it => <MenuItem key={it} value={it}>{it}</MenuItem>)}
//                 </Select>
//               </FormControl>

//               <FormControl size="small" sx={{ minWidth: 160 }}>
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                   label="Status"
//                   value={statusFilter}
//                   onChange={e => setStatusFilter(e.target.value as any)}
//                 >
//                   {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
//                 </Select>
//               </FormControl>
//             </Box>
//           </Box>

//           <Divider sx={{ mb: 1 }} />

//           {/* Table */}
//           <TableContainer
//             sx={{
//               flex: 1,
//               overflowX: "auto",
//               overflowY: "auto",
//               "&::-webkit-scrollbar": { width: 8, height: 8 },
//               "&::-webkit-scrollbar-thumb": {
//                 background: (t) => t.palette.mode === "dark" ? "#333" : "#ccc",
//                 borderRadius: 4,
//               },
//             }}
//           >
//             <Table stickyHeader sx={{ minWidth: 1320 }}>
//               <TableHead>
//                 <TableRow>
//                   {[
//                     "Sr No",
//                     "Item Name",
//                     "Serial No",
//                     "Issued To",
//                     "Issue Date",
//                     "Return By",
//                     "Location",
//                     "Issued By",
//                     "Remarks",
//                     "Status",
//                     "Action",
//                   ].map((col, i, arr) => (
//                     <TableCell
//                       key={col}
//                       sx={{
//                         color: "#fff",
//                         backgroundColor: "#0F0F0F",
//                         borderBottom: "1px solid #333",
//                         fontSize: 13,
//                         whiteSpace: "nowrap",
//                         padding: "12px 16px",
//                         textAlign: "center",
//                         borderTopLeftRadius: i === 0 ? 6 : 0,
//                         borderTopRightRadius: i === arr.length - 1 ? 6 : 0,
//                       }}
//                     >
//                       {col}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {paginated.length ? (
//                   paginated.map((r, idx) => (
//                     <TableRow key={r.id} hover>
//                       {/* data cells */}
//                       {[
//                         (page - 1) * rowsPerPage + idx + 1,
//                         r.itemName,
//                         r.serialNo,
//                         r.issuedTo,
//                         new Date(r.issueDate).toLocaleDateString(),
//                         new Date(r.returnBy).toLocaleDateString(),
//                         r.location,
//                         r.issuedBy,
//                         r.remarks,
//                         r.status,
//                       ].map((cell, j) => (
//                         <TableCell
//                           key={j}
//                           sx={{
//                             color: j === 9
//                               ? (r.status === "Returned" ? "#22C55E" : r.status === "Overdue" ? "#FFB020" : "#22C55E")
//                               : "#E0E0E0",
//                             backgroundColor: "#1C1C1E",
//                             borderBottom: "1px solid #333",
//                             fontSize: 13,
//                             whiteSpace: "nowrap",
//                             textAlign: "center",
//                             verticalAlign: "middle",
//                             padding: "12px 16px",
//                           }}
//                         >
//                           {cell}
//                         </TableCell>
//                       ))}

//                       {/* Action column */}
//                       <TableCell
//                         sx={{
//                           backgroundColor: "#1C1C1E",
//                           borderBottom: "1px solid #333",
//                           textAlign: "center",
//                           whiteSpace: "nowrap",
//                           padding: "6px 8px",
//                         }}
//                       >
//                         <Button
//                           size="small"
//                           variant="contained"
//                           sx={{
//                             backgroundColor: "#FFC000",
//                             color: "#000",
//                             textTransform: "none",
//                             fontSize: 12,
//                             px: 1.5,
//                             py: 0.5,
//                             minWidth: 84,
//                             "&:hover": { bgcolor: "#D4A420" },
//                           }}
//                           onClick={() => {
//                             // open your update modal / navigate
//                             console.log("Update row:", r.id);
//                           }}
//                         >
//                           Update
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={11} align="center" sx={{ color: "text.secondary", py: 4 }}>
//                       No records found
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           {/* Footer row BELOW the horizontal scroller */}
//           <Box
//             sx={{
//               mt: 1,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             {/* Rows-per-page selector */}
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//               <Typography variant="body2" sx={{ color: "text.secondary" }}>
//                 Rows:
//               </Typography>
//               <FormControl size="small" sx={{ minWidth: 92 }}>
//                 <Select
//                   value={rowsPerPage}
//                   onChange={(e) => setRowsPerPage(Number(e.target.value))}
//                 >
//                   {[10, 20, 50].map(n => (
//                     <MenuItem key={n} value={n}>{n}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Box>

//             {/* Pagination (right) */}
//             <Pagination
//               count={pageCount}
//               page={page}
//               onChange={(_, v) => setPage(v)}
//               size="small"
//               shape="rounded"
//               siblingCount={1}
//               boundaryCount={1}
//               sx={{
//                 "& .MuiPaginationItem-root": { color: "#fff" },
//                 "& .Mui-selected": { backgroundColor: "#22C55E", color: "#000" },
//               }}
//             />
//           </Box>
//         </Paper>
//       )}

//       {/* ===================== ISSUE NEW ===================== */}
//       {view === "issue" && (
//         <Paper variant="outlined" sx={{ mx: { xs: 1, sm: 0 }, p: { xs: 1.5, sm: 2 } }}>
//           <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
//             <Typography variant="h6" sx={{ fontWeight: 700 }}>
//               Issue New Item
//             </Typography>
//             <Button variant="outlined" onClick={handleClear} sx={{ borderRadius: 1 }}>
//               Clear
//             </Button>
//           </Stack>

//           <Stack spacing={2}>
//             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
//               <TextField
//                 select
//                 SelectProps={{ native: true }}
//                 label="Select Item *"
//                 value={form.itemName}
//                 onChange={update("itemName")}
//                 sx={field}
//               >
//                 <option value="" />
//                 {ITEMS.filter(i => i !== "All").map((opt) => (
//                   <option key={opt} value={opt}>{opt}</option>
//                 ))}
//               </TextField>
//               <TextField label="Serial No *" value={form.serialNo} onChange={update("serialNo")} sx={field} />
//               <TextField label="Issuing To *" value={form.issuedTo} onChange={update("issuedTo")} sx={field} />
//             </Box>

//             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
//               <TextField
//                 label="Issue Date *"
//                 type="date"
//                 InputLabelProps={{ shrink: true }}
//                 value={form.issueDate}
//                 onChange={update("issueDate")}
//                 sx={field}
//               />
//               <TextField
//                 label="Return By *"
//                 type="date"
//                 InputLabelProps={{ shrink: true }}
//                 value={form.returnBy}
//                 onChange={update("returnBy")}
//                 sx={field}
//               />
//               <TextField label="Location *" value={form.location} onChange={update("location")} sx={field} />
//             </Box>

//             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
//               <TextField label="Issued By *" value={form.issuedBy} onChange={update("issuedBy")} sx={field} />
//               <TextField label="Remarks" value={form.remarks} onChange={update("remarks")} sx={field} />
//             </Box>

//             <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//               <Button
//                 variant="contained"
//                 disabled={disableIssue}
//                 sx={{
//                   minWidth: 140,
//                   borderRadius: 1,
//                   bgcolor: BRAND_GREEN,
//                   color: "#0F0F0F",
//                   "&:hover": { bgcolor: "#6EAD35" },
//                   "&.Mui-disabled": {
//                     bgcolor: (t) =>
//                       t.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
//                     color: "text.disabled",
//                   },
//                 }}
//                 onClick={() => console.log("Issue request:", form)}
//               >
//                 Issue
//               </Button>
//             </Box>
//           </Stack>
//         </Paper>
//       )}
//     </Box>
//   );
// }


import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import type { Theme } from '@mui/material/styles';

/* ===== types & demo data (unchanged) ===== */
type EntryForm = {
  itemName: string;
  serialNo: string;
  issuedTo: string;
  issueDate: string;
  returnBy: string;
  location: string;
  issuedBy: string;
  remarks: string;
};
type Row = {
  id: number;
  itemName: string;
  serialNo: string;
  issuedTo: string;
  issueDate: string;
  returnBy: string;
  location: string;
  issuedBy: string;
  remarks: string;
  status: "Issued" | "Returned" | "Overdue";
};
const ITEMS = ["All", "Laptop", "Access Point", "LAN Tester", "Crimping Tool", "HDMI Cable"] as const;
const STATUSES = ["All", "Issued", "Returned", "Overdue"] as const;
const BRAND_GREEN = "#78B83B";

const makeRows = (): Row[] => {
  const base: Omit<Row, "id" | "serialNo" | "itemName" | "issuedTo" | "status"> = {
    issuedBy: "fe1@example.com",
    issueDate: "2025-09-10",
    returnBy: "2025-09-11",
    location: "Lab-1",
    remarks: "N/A",
  };
  const pool: Array<Pick<Row, "itemName" | "issuedTo" | "status">> = [
    { itemName: "Laptop", issuedTo: "Amey", status: "Issued" },
    { itemName: "Access Point", issuedTo: "Priya", status: "Returned" },
    { itemName: "LAN Tester", issuedTo: "Jin", status: "Overdue" },
    { itemName: "Crimping Tool", issuedTo: "Fatima", status: "Issued" },
    { itemName: "HDMI Cable", issuedTo: "Amey", status: "Returned" },
  ];
  const out: Row[] = [];
  for (let i = 1; i <= 48; i++) {
    const p = pool[i % pool.length];
    out.push({
      id: i,
      itemName: p.itemName,
      serialNo: `SN-${1000 + i}`,
      issuedTo: p.issuedTo,
      status: p.status,
      ...base,
      issueDate: new Date(2025, 8, 10 + (i % 20)).toISOString().slice(0, 10),
      returnBy: new Date(2025, 8, 11 + (i % 20)).toISOString().slice(0, 10),
      location: ["Lab-1", "Lab-2", "Store", "HQ"][i % 4],
      issuedBy: `fe${(i % 4) + 1}@example.com`,
      remarks: i % 3 === 0 ? "—" : "N/A",
    });
  }
  return out;
};

/* ===== theme tokens for table ===== */
const tableTokens = (t: Theme) => {
  const dark = t.palette.mode === 'dark';
  return {
    headBg: dark ? '#0F0F0F' : '#F5F5F7',
    rowBg:  dark ? '#1C1C1E' : '#FFFFFF',
    border: dark ? '#333'    : '#E5E7EB',
    headText: dark ? '#FFFFFF' : '#111827',
    bodyText: dark ? '#E0E0E0' : '#111827',
    scrollThumb: dark ? '#333' : '#CFCFCF',
    statusReturned: '#22C55E',
    statusIssued:   '#78B83B',
    statusOverdue:  '#EA9A00',
    pageSelectedBg: '#78B83B',
    pageSelectedText: '#0F0F0F',
  };
};

export default function Dashboard() {
  const theme = useTheme();
  const tt = tableTokens(theme);

  /* =========== view toggle & filters (unchanged) =========== */
  const [view, setView] = useState<"all" | "issue">("all");
  const [itemFilter, setItemFilter] = useState<(typeof ITEMS)[number]>("All");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUSES)[number]>("All");

  const [rows] = useState<Row[]>(() => makeRows());

  // pagination with selectable rows per page
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<10 | 20 | 50>(50);

  useEffect(() => {
    setPage(1);
  }, [itemFilter, statusFilter, rowsPerPage]);

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const okItem = itemFilter === "All" || r.itemName === itemFilter;
        const okStatus = statusFilter === "All" || r.status === statusFilter;
        return okItem && okStatus;
      }),
    [rows, itemFilter, statusFilter]
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = useMemo(
    () => filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  /* =========== form (unchanged) =========== */
  const initialForm: EntryForm = {
    itemName: "",
    serialNo: "",
    issuedTo: "",
    issueDate: "",
    returnBy: "",
    location: "",
    issuedBy: "",
    remarks: "",
  };
  const [form, setForm] = useState<EntryForm>(initialForm);
  const update =
    (k: keyof EntryForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));
  const handleClear = () => setForm(initialForm);
  const disableIssue =
    !form.itemName ||
    !form.serialNo ||
    !form.issuedTo ||
    !form.issueDate ||
    !form.returnBy ||
    !form.location ||
    !form.issuedBy;

  const field = { flex: "1 1 320px", minWidth: 0 };

  return (
    <Box>
      {/* Toggle (compact pill) */}
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={(_, v) => v && setView(v)}
        size="small"
        sx={{
          mb: 1,
          borderRadius: 9999,
          p: 0.25,
          bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
          "& .MuiToggleButton-root": {
            textTransform: "none",
            border: 0,
            borderRadius: 9999,
            px: 2,
            py: 0.2,
            color: "text.secondary",
            "&.Mui-selected": {
              bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)",
              color: "text.primary",
              "&:hover": {
                bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.14)",
              },
            },
            "&:hover": { backgroundColor: "action.hover" },
          },
        }}
      >
        <ToggleButton value="all">All items</ToggleButton>
        <ToggleButton value="issue">Issue New</ToggleButton>
      </ToggleButtonGroup>

      {/* ===================== ALL ITEMS ===================== */}
      {view === "all" && (
        <Paper
          variant="outlined"
          sx={{
            mx: { xs: 1, sm: 0 },
            p: { xs: 1.5, sm: 1 },
            height: { xs: "calc(100vh - 190px)", md: "calc(100vh - 120px)" },
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header row */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              All Items
            </Typography>

            <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
              <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel>Item Name</InputLabel>
                <Select
                  label="Item Name"
                  value={itemFilter}
                  onChange={(e) => setItemFilter(e.target.value as any)}
                  MenuProps={{ PaperProps: { sx: { bgcolor: "background.paper" } } }}
                >
                  {ITEMS.map((it) => (
                    <MenuItem key={it} value={it}>
                      {it}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  MenuProps={{ PaperProps: { sx: { bgcolor: "background.paper" } } }}
                >
                  {STATUSES.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Divider sx={{ mb: 1, borderColor: tt.border }} />

          {/* Table with theme-aware styles */}
          <TableContainer
            sx={{
              flex: 1,
              overflowX: "auto",
              overflowY: "auto",
              "&::-webkit-scrollbar": { width: 8, height: 8 },
              "&::-webkit-scrollbar-thumb": { background: tt.scrollThumb, borderRadius: 4 },
            }}
          >
            <Table stickyHeader sx={{ minWidth: 1280 }}>
              <TableHead>
                <TableRow>
                  {[
                    "Sr No",
                    "Item Name",
                    "Serial No",
                    "Issued To",
                    "Issue Date",
                    "Return By",
                    "Location",
                    "Issued By",
                    "Remarks",
                    "Status",
                    "Action",
                  ].map((col, i, arr) => (
                    <TableCell
                      key={col}
                      sx={{
                        color: tt.headText,
                        backgroundColor: tt.headBg,
                        borderBottom: `1px solid ${tt.border}`,
                        fontSize: 13,
                        whiteSpace: "nowrap",
                        padding: "12px 16px",
                        textAlign: "center",
                        borderTopLeftRadius: i === 0 ? 6 : 0,
                        borderTopRightRadius: i === arr.length - 1 ? 6 : 0,
                      }}
                    >
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {paginated.length ? (
                  paginated.map((r, idx) => (
                    <TableRow key={r.id} hover>
                      {[
                        (page - 1) * rowsPerPage + idx + 1,
                        r.itemName,
                        r.serialNo,
                        r.issuedTo,
                        new Date(r.issueDate).toLocaleDateString(),
                        new Date(r.returnBy).toLocaleDateString(),
                        r.location,
                        r.issuedBy,
                        r.remarks,
                        r.status,
                        "__ACTION__",
                      ].map((cell, j) => {
                        const isStatus = j === 9;
                        return (
                          <TableCell
                            key={j}
                            sx={{
                              color: isStatus
                                ? r.status === "Returned"
                                  ? tt.statusReturned
                                  : r.status === "Overdue"
                                  ? tt.statusOverdue
                                  : tt.statusIssued
                                : tt.bodyText,
                              backgroundColor: tt.rowBg,
                              borderBottom: `1px solid ${tt.border}`,
                              fontSize: 13,
                              whiteSpace: "nowrap",
                              textAlign: "center",
                              verticalAlign: "middle",
                              padding: "12px 16px",
                            }}
                          >
                            {cell === "__ACTION__" ? (
                              <Button
                                size="small"
                                variant="contained"
                                sx={{
                                  textTransform: "none",
                                  fontSize: 12,
                                  px: 1.5,
                                  py: 0.5,
                                  minWidth: 80,
                                  bgcolor: "#FFC000",
                                  color: "#000",
                                  "&:hover": { bgcolor: "#D4A420" },
                                }}
                                onClick={() => console.log("Update row", r.id)}
                              >
                                Update
                              </Button>
                            ) : (
                              cell
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} align="center" sx={{ color: "text.secondary", py: 4 }}>
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Bottom controls: rows-per-page (left) + pagination (right) under the horizontal bar */}
          <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Rows:
              </Typography>
              <FormControl size="small">
                <Select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(e.target.value as 10 | 20 | 50)}
                  sx={{
                    height: 36,
                    "& .MuiSelect-select": { py: 0.5, minWidth: 56 },
                  }}
                >
                  {[10, 20, 50].map((n) => (
                    <MenuItem key={n} value={n}>
                      {n}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ ml: "auto" }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, v) => setPage(v)}
                size="small"
                shape="rounded"
                siblingCount={1}
                boundaryCount={1}
                sx={{
                  "& .MuiPaginationItem-root": { color: theme.palette.text.primary },
                  "& .Mui-selected": {
                    bgcolor: tt.pageSelectedBg,
                    color: tt.pageSelectedText,
                    "&:hover": { bgcolor: tt.pageSelectedBg },
                  },
                }}
              />
            </Box>
          </Box>
        </Paper>
      )}

      {/* ===================== ISSUE NEW ===================== */}
      {view === "issue" && (
        <Paper variant="outlined" sx={{ mx: { xs: 1, sm: 0 }, p: { xs: 1.5, sm: 2 } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Issue New Item
            </Typography>
            <Button variant="outlined" onClick={handleClear} sx={{ borderRadius: 1 }}>
              Clear
            </Button>
          </Stack>

          <Stack spacing={2}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <TextField
                select
                SelectProps={{ native: true }}
                label="Select Item *"
                value={form.itemName}
                onChange={update("itemName")}
                sx={field}
              >
                <option value="" />
                {ITEMS.filter((i) => i !== "All").map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </TextField>
              <TextField label="Serial No *" value={form.serialNo} onChange={update("serialNo")} sx={field} />
              <TextField label="Issuing To *" value={form.issuedTo} onChange={update("issuedTo")} sx={field} />
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <TextField
                label="Issue Date *"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={form.issueDate}
                onChange={update("issueDate")}
                sx={field}
              />
              <TextField
                label="Return By *"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={form.returnBy}
                onChange={update("returnBy")}
                sx={field}
              />
              <TextField label="Location *" value={form.location} onChange={update("location")} sx={field} />
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <TextField label="Issued By *" value={form.issuedBy} onChange={update("issuedBy")} sx={field} />
              <TextField label="Remarks" value={form.remarks} onChange={update("remarks")} sx={field} />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                disabled={disableIssue}
                sx={{
                  minWidth: 140,
                  borderRadius: 1,
                  bgcolor: BRAND_GREEN,
                  color: "#0F0F0F",
                  "&:hover": { bgcolor: "#6EAD35" },
                  "&.Mui-disabled": {
                    bgcolor:
                      theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                    color: "text.disabled",
                  },
                }}
                onClick={() => console.log("Issue request:", form)}
              >
                Issue
              </Button>
            </Box>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
