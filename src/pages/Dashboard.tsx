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
// import { useTheme } from "@mui/material/styles";
// import type { Theme } from "@mui/material/styles";
// import axios from "axios";
// import { useRef } from "react"; 

// // Modal component
// import { UpdateLoanModal } from "../components/UpdateLoanModal";

// // ======= API base (Vite only) =======
// const API_BASE: string =
//   (import.meta as any)?.env?.VITE_API_BASE ?? "http://3.110.216.196/api";

// // ======= types =======
// export type Tool = {
//   id: string;
//   name: string;
//   serial_no: string;
//   owner_name: string;
//   asset_tag: string;
//   category: string;
//   remarks: string | null;
// };

// export type Loan = {
//   id: string | number;
//   tool_id?: string;   
//   item_name: string;
//   serial_no: string;
//   issued_to: string;
//   issue_date: string;      // YYYY-MM-DD
//   return_by: string;       // YYYY-MM-DD (planned)
//   return_date?: string;    // YYYY-MM-DD (actual)  <-- used when status=Returned
//   location: string;
//   issued_by: string;
//   remarks: string | null;
//   status: "Issued" | "Returned" | "Overdue";
// };

// type EntryForm = {
//   itemName: string;
//   serialNo: string;
//   issuedTo: string;
//   issueDate: string;
//   returnBy: string;
//   location: string;
//   issuedBy: string;
//   remarks: string;
// };

// // Filters dropdowns (for the table header only)
// const ITEMS = ["All", "Laptop", "Access Point", "LAN Tester", "Crimping Tool", "HDMI Cable"] as const;
// const STATUSES = ["All", "Issued", "Returned", "Overdue"] as const;
// const BRAND_GREEN = "#78B83B";

// // ===== theme tokens for the table =====
// const tableTokens = (t: Theme) => {
//   const dark = t.palette.mode === "dark";
//   return {
//     headBg: dark ? "#0F0F0F" : "#F5F5F7",
//     rowBg: dark ? "#1C1C1E" : "#FFFFFF",
//     border: dark ? "#333" : "#E5E7EB",
//     headText: dark ? "#FFFFFF" : "#111827",
//     bodyText: dark ? "#E0E0E0" : "#111827",
//     scrollThumb: dark ? "#333" : "#CFCFCF",
//     statusReturned: "#22C55E",
//     statusIssued: "#78B83B",
//     statusOverdue: "#EA9A00",
//     pageSelectedBg: "#78B83B",
//     pageSelectedText: "#0F0F0F",
//   };
// };

// // Format "YYYY-MM-DD" (or any parseable date) -> "DD/MM/YYYY"
// const fmtDMY = (v?: string) => {
//   if (!v) return "—";
//   const iso = v.slice(0, 10);
//   const parts = iso.split("-");
//   if (parts.length === 3) {
//     const [yyyy, mm, dd] = parts;
//     return `${dd}/${mm}/${yyyy}`;
//   }
//   const d = new Date(v);
//   if (isNaN(d.getTime())) return "—";
//   const dd = String(d.getDate()).padStart(2, "0");
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const yyyy = String(d.getFullYear());
//   return `${dd}/${mm}/${yyyy}`;
// };

// const toolsRef = useRef<Tool[]>([]);

// // ===== API client =====
// const api = axios.create({ baseURL: API_BASE });

// const UI = {
//   card: {
//     sx: {
//       mx: { xs: 0, md: 0 },
//       px: { xs: 1, md: 1 },
//       py: { xs: 0.75, md: 0.75 },
//       height: { xs: "auto", md: "calc(100vh - 115px)" },
//       display: "flex",
//       flexDirection: "column",
//       overflow: "hidden",
//       borderRadius: 0.5,
//     },
//   },
//   headerRow: {
//     sx: {
//       mb: 0.5,
//       display: "flex",
//       justifyContent: "flex-end",
//       alignItems: "center",
//       flexWrap: "wrap",
//       gap: { xs: 1, sm: 1.25 },
//     },
//   },
//   selectSm: {
//     size: "small" as const,
//     sx: {
//       minWidth: { xs: 120, sm: 120 },
//       "& .MuiInputBase-root": { height: 25 },
//       "& .MuiSelect-select": { py: 0.25, px: 1 },
//     },
//     menu: { PaperProps: { sx: { bgcolor: "background.paper" } } },
//   },
//   table: {
//     sx: {
//       tableLayout: "fixed",
//       width: "100%",
//     },
//     headCell: (tt: ReturnType<typeof tableTokens>) => ({
//       color: tt.headText,
//       backgroundColor: tt.headBg,
//       borderBottom: `1px solid ${tt.border}`,
//       fontSize: 12,
//       lineHeight: 1.2,
//       whiteSpace: "nowrap",
//       padding: "5px 8px",
//       textAlign: "center" as const,
//     }),
//     bodyCell: (tt: ReturnType<typeof tableTokens>, isStatus: boolean, status: string) => ({
//       color: isStatus
//         ? status === "Returned"
//           ? tt.statusReturned
//           : status === "Overdue"
//           ? tt.statusOverdue
//           : tt.statusIssued
//         : tt.bodyText,
//       backgroundColor: tt.rowBg,
//       borderBottom: `1px solid ${tt.border}`,
//       fontSize: 12,
//       lineHeight: 1.2,
//       whiteSpace: "nowrap",
//       textOverflow: "ellipsis",
//       overflow: "hidden",
//       padding: "6px 10px",
//       textAlign: "center" as const,
//       verticalAlign: "middle" as const,
//     }),
//   },
// };

// // normalize loan row
// const normalizeLoan = (l: any): Loan => ({
//   id: l.id,
//   tool_id: l.tool_id ?? undefined, 
//   item_name: l.item_name ?? l.itemName ?? "",
//   serial_no: l.serial_no ?? "",
//   issued_to: l.issued_to ?? "",
//   issue_date: (l.issue_date || "").slice(0, 10),
//   return_by: (l.return_by || "").slice(0, 10),
//   return_date: (l.return_date || "").slice(0, 10), // <-- actual date (if returned)
//   location: l.location ?? "",
//   issued_by: l.issued_by ?? "",
//   remarks: l.remarks ?? null,
//   status: (l.status as Loan["status"]) ?? "Issued",
// });

// const normalizeLoansWithTools = (payload: any, toolList: Tool[]): Loan[] => {
//   const raw =
//     Array.isArray(payload?.items) ? payload.items :
//     Array.isArray(payload?.rows)  ? payload.rows  :
//     Array.isArray(payload?.data)  ? payload.data  :
//     Array.isArray(payload)        ? payload       : [];

//   return raw.map((l: any) => {
//     const base = normalizeLoan(l);
//     const t = l.tool_id ? toolList.find(tt => tt.id === l.tool_id) : undefined;
//     return {
//       ...base,
//       item_name: base.item_name || t?.name || "",
//       serial_no: base.serial_no || t?.serial_no || "",
//     };
//   });
// };

// export default function Dashboard() {
//   const theme = useTheme();
//   const tt = tableTokens(theme);
//   const [view, setView] = useState<"all" | "issue">("all");
//   const [itemFilter, setItemFilter] = useState<(typeof ITEMS)[number]>("All");
//   const [statusFilter, setStatusFilter] = useState<(typeof STATUSES)[number]>("All");

//   // data
//   const [tools, setTools] = useState<Tool[]>([]);
//   const [loans, setLoans] = useState<Loan[]>([]);
//   const [loadingLoans, setLoadingLoans] = useState(false);

//   // pagination
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState<10 | 20 | 50>(50);

//   // form state
//   const initialForm: EntryForm = {
//     itemName: "",
//     serialNo: "",
//     issuedTo: "",
//     issueDate: "",
//     returnBy: "",
//     location: "",
//     issuedBy: "",
//     remarks: "",
//   };
//   const [form, setForm] = useState<EntryForm>(initialForm);

//   // modal state
//   const [openEdit, setOpenEdit] = useState(false);
//   const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

//   const toolNames = useMemo(
//     () => [...new Set(tools.map((t) => t.name).filter(Boolean))].sort(),
//     [tools]
//   );

//   // load tools
//   useEffect(() => {
//     (async () => {
//       try {
//         const { data } = await api.get("/tools");
//         const arr = pickArray(data).map(normalizeTool);
//         setTools(arr);
//       } catch (e) {
//         console.error("load tools failed", e);
//         setTools([]);
//       }
//     })();
//   }, []);

//   const loadLoans = async () => {
//     setLoadingLoans(true);
//     try {
//       const { data } = await api.get("/loans");

//       const rawList =
//         Array.isArray(data?.items) ? data.items :
//         Array.isArray(data?.rows)  ? data.rows  :
//         Array.isArray(data?.data)  ? data.data  :
//         Array.isArray(data)        ? data       : [];

//       const rows: Loan[] = rawList.map((l: any) => {
//         const base = normalizeLoan(l);
//         const t = l.tool_id ? tools.find(tt => tt.id === l.tool_id) : undefined;
//         return {
//           ...base,
//           item_name: base.item_name || t?.name || "",
//           serial_no: base.serial_no || t?.serial_no || "",
//         };
//       });

//       setLoans(rows);
//     } catch (e) {
//       console.error("load loans failed", e);
//       setLoans([]);
//     } finally {
//       setLoadingLoans(false);
//     }
//   };

//   useEffect(() => {
//     loadLoans();
//   }, [tools]);


//   const latestPerTool = useMemo(() => {
//   // sort newest first by issue_date (YYYY-MM-DD compares lexicographically)
//   const sorted = [...loans].sort((a, b) =>
//     b.issue_date.localeCompare(a.issue_date)
//   );

//   const seen = new Set<string>();
//   const out: Loan[] = [];

//   for (const r of sorted) {
//     // prefer real tool_id; fall back to name+serial combo as a stable key
//     const key = r.tool_id || `${r.item_name}|${r.serial_no}`;
//     if (!seen.has(key)) {
//       out.push(r);
//       seen.add(key);
//     }
//   }
//   return out;
// }, [loans]);

//   // filter + paginate
//   useEffect(() => {
//     setPage(1);
//   }, [itemFilter, statusFilter, rowsPerPage]);
//   const filtered = useMemo(() => {
//   return latestPerTool.filter((r) => {
//     const okItem = itemFilter === "All" || r.item_name === itemFilter;
//     const okStatus = statusFilter === "All" || r.status === statusFilter;
//     return okItem && okStatus;
//   });
// }, [latestPerTool, itemFilter, statusFilter]);

//   const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
//   const paginated = useMemo(
//     () => filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage),
//     [filtered, page, rowsPerPage]
//   );

//   // form helpers
//   const field = { flex: "1 1 320px", minWidth: 0 };
//   const update =
//     (k: keyof EntryForm) =>
//     (e: React.ChangeEvent<HTMLInputElement> | any) =>
//       setForm((f) => ({ ...f, [k]: e.target?.value ?? e }));

//   const handleClear = () => setForm(initialForm);
//   const serialOptions = useMemo(
//     () => (Array.isArray(tools) ? tools.filter((t) => t.name === form.itemName).map((t) => t.serial_no) : []),
//     [tools, form.itemName]
//   );

//   const selectedTool = useMemo(
//     () => tools.find(t => t.name === form.itemName && t.serial_no === form.serialNo) || null,
//     [tools, form.itemName, form.serialNo]
//   );

//   // disable button unless we also have a matching tool_id
//   const disableIssue =
//     !form.itemName ||
//     !form.serialNo ||
//     !form.issuedTo ||
//     !form.issueDate ||
//     !form.returnBy ||
//     !form.location ||
//     !form.issuedBy ||
//     !selectedTool;

//   // Create a loan — block only if latest loan for this tool is not Returned
//   const issueItem = async () => {
//     if (!selectedTool) {
//       alert("Please pick a valid Item & Serial (no matching tool found).");
//       return;
//     }

//     try {
//       const resp = await api.get(`/loans`, {
//         params: { tool_id: selectedTool.id, pageSize: 1 } // API orders by issue_date DESC
//       });

//       const list =
//         Array.isArray(resp.data?.items) ? resp.data.items :
//         Array.isArray(resp.data?.rows)  ? resp.data.rows  :
//         Array.isArray(resp.data?.data)  ? resp.data.data  :
//         Array.isArray(resp.data)        ? resp.data       : [];

//       const last = list[0];

//       if (last && last.status !== "Returned") {
//         alert("This tool is currently issued. Return it first, then issue again.");
//         return;
//       }
//     } catch {
//       // Let backend enforce if something went wrong here
//     }

//     const payload = {
//       tool_id: selectedTool.id,
//       item_name: form.itemName,
//       serial_no: form.serialNo,
//       issued_to: form.issuedTo,
//       issue_date: form.issueDate,
//       return_by: form.returnBy, // tentative date
//       location: form.location,
//       issued_by: form.issuedBy,
//       remarks: form.remarks || null,
//       status: "Issued",
//     };

//     try {
//       const { data } = await api.post("/loans", payload, {
//         headers: { "Content-Type": "application/json" },
//       });

//       const createdRaw = data?.row ?? data?.loan ?? data;
//       const createdLoan =
//         createdRaw && createdRaw.id ? normalizeLoan(createdRaw) : null;

//       if (createdLoan) {
//         setLoans(prev => [createdLoan, ...prev]);
//       } else {
//         await loadLoans();
//       }

//       handleClear();
//       setView("all");
//       setPage(1);
//     } catch (e: any) {
//       console.error("issue failed", e?.response?.data ?? e);
//       alert(e?.response?.data?.error || "Failed to issue item.");
//     }
//   };

//   const openUpdate = (row: Loan) => {
//     setSelectedLoan(row);
//     setOpenEdit(true);
//   };

//   const onModalUpdated = async () => {
//     setOpenEdit(false);
//     await loadLoans();
//   };
//   const onModalDeleted = async () => {
//     setOpenEdit(false);
//     await loadLoans();
//   };

//   const pickArray = (p: any) => {
//     if (Array.isArray(p)) return p;
//     if (Array.isArray(p?.rows)) return p.rows;
//     if (Array.isArray(p?.data)) return p.data;
//     if (Array.isArray(p?.items)) return p.items;
//     return [];
//   };

//   const normalizeTool = (t: any): Tool => ({
//     id: t.id ?? t.tool_id ?? t.uuid ?? "",
//     name: t.name ?? t.item_name ?? t.tool_name ?? "",
//     serial_no: t.serial_no ?? t.serial ?? "",
//     owner_name: t.owner_name ?? t.owner ?? "",
//     asset_tag: t.asset_tag ?? t.assetTag ?? "",
//     category: t.category ?? t.type ?? "",
//     remarks: t.remarks ?? t.note ?? null,
//   });

//   return (
//     <Box>
//       <ToggleButtonGroup
//         value={view}
//         exclusive
//         onChange={(_, v) => v && setView(v)}
//         size="small"
//         sx={{
//           mb: 1,
//           borderRadius: 9999,
//           p: 0.25,
//           bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
//           "& .MuiToggleButton-root": {
//             textTransform: "none",
//             border: 0,
//             borderRadius: 9999,
//             px: 1,
//             py: 0.2,
//             color: "text.secondary",
//             "&.Mui-selected": {
//               bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)",
//               color: "text.primary",
//               "&:hover": {
//                 bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.14)",
//               },
//             },
//             "&:hover": { backgroundColor: "action.hover" },
//           },
//         }}
//       >
//         <ToggleButton value="all">All Entries</ToggleButton>
//         <ToggleButton value="issue">Issue New</ToggleButton>
//       </ToggleButtonGroup>

//       {/* ALL ITEMS */}
//       {view === "all" && (
//         <Box sx={{ mx: { xs: -1.5, md: -1.5 } }}>
//           <Paper variant="outlined" sx={UI.card.sx}>
//             <Box sx={UI.headerRow.sx}>
//               <FormControl size={UI.selectSm.size} sx={UI.selectSm.sx}>
//                 <InputLabel>Item Name</InputLabel>
//                 <Select
//                   label="Item Name"
//                   value={itemFilter}
//                   onChange={(e) => setItemFilter(e.target.value as any)}
//                   MenuProps={UI.selectSm.menu}
//                 >
//                   {ITEMS.map((it) => (
//                     <MenuItem key={it} value={it}>
//                       {it}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <FormControl size={UI.selectSm.size} sx={UI.selectSm.sx}>
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                   label="Status"
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value as any)}
//                   MenuProps={UI.selectSm.menu}
//                 >
//                   {STATUSES.map((s) => (
//                     <MenuItem key={s} value={s}>
//                       {s}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Box>

//             <Divider sx={{ mb: 0.5, borderColor: tt.border }} />

//             <TableContainer
//               sx={{
//                 flex: 1,
//                 overflow: "auto",
//                 "&::-webkit-scrollbar": { width: 8, height: 8 },
//                 "&::-webkit-scrollbar-thumb": { background: tt.scrollThumb, borderRadius: 4 },
//               }}
//             >
//               <Table stickyHeader sx={UI.table.sx}>
//                 <TableHead>
//                   <TableRow>
//                     {[
//                       "Sr No",
//                       "Item Name",
//                       "Serial No",
//                       "Issued To",
//                       "Issue Date",
//                       "Return By", // shows actual return_date when available
//                       "Location",
//                       "Issued By",
//                       "Remarks",
//                       "Status",
//                       "Action",
//                     ].map((col, i, arr) => (
//                       <TableCell
//                         key={col}
//                         sx={{
//                           ...UI.table.headCell(tt),
//                           borderTopLeftRadius: i === 0 ? 6 : 0,
//                           borderTopRightRadius: i === arr.length - 1 ? 6 : 0,
//                         }}
//                       >
//                         {col}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {loadingLoans ? (
//                     <TableRow>
//                       <TableCell colSpan={11} align="center" sx={{ py: 3 }}>
//                         Loading…
//                       </TableCell>
//                     </TableRow>
//                   ) : paginated.length ? (
//                     paginated.map((r, idx) => {
//                       const displayReturn = r.return_date || r.return_by; // <-- actual beats planned
//                       return (
//                         <TableRow key={r.id} hover>
//                           {[
//                             (page - 1) * rowsPerPage + idx + 1,
//                             r.item_name,
//                             r.serial_no,
//                             r.issued_to,
//                             // new Date(r.issue_date).toLocaleDateString(),
//                             // new Date(displayReturn).toLocaleDateString(),
//                             fmtDMY(r.issue_date),
// fmtDMY(displayReturn),
//                             r.location,
//                             r.issued_by,
//                             r.remarks || "—",
//                             r.status,
//                             "__ACTION__",
//                           ].map((cell, j) => {
//                             const isStatus = j === 9;
//                             return (
//                               <TableCell key={j} sx={UI.table.bodyCell(tt, isStatus, r.status)}>
//                                 {cell === "__ACTION__" ? (
//                                   <Button
//                                     size="small"
//                                     variant="contained"
//                                     sx={{
//                                       textTransform: "none",
//                                       fontSize: 12,
//                                       px: 1.25,
//                                       py: 0.25,
//                                       minWidth: 70,
//                                       bgcolor: "#FFC000",
//                                       color: "#000",
//                                       "&:hover": { bgcolor: "#D4A420" },
//                                     }}
//                                     onClick={() => openUpdate(r)}
//                                   >
//                                     Update
//                                   </Button>
//                                 ) : (
//                                   cell
//                                 )}
//                               </TableCell>
//                             );
//                           })}
//                         </TableRow>
//                       );
//                     })
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={11} align="center" sx={{ color: "text.secondary", py: 3 }}>
//                         No records found
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             <Box sx={{ mt: 0.75, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
//                 <Typography variant="body2" sx={{ color: "text.secondary" }}>
//                   Rows:
//                 </Typography>
//                 <FormControl size="small">
//                   <Select
//                     value={rowsPerPage}
//                     onChange={(e) => setRowsPerPage(e.target.value as 10 | 20 | 50)}
//                     sx={{ height: 32, "& .MuiSelect-select": { py: 0.25, minWidth: 52 } }}
//                   >
//                     {[10, 20, 50].map((n) => (
//                       <MenuItem key={n} value={n}>
//                         {n}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Box>

//               <Box sx={{ ml: "auto" }}>
//                 <Pagination
//                   count={pageCount}
//                   page={page}
//                   onChange={(_, v) => setPage(v)}
//                   size="small"
//                   shape="rounded"
//                   siblingCount={1}
//                   boundaryCount={1}
//                   sx={{
//                     "& .MuiPaginationItem-root": { color: theme.palette.text.primary, minWidth: 28, height: 28 },
//                     "& .Mui-selected": {
//                       bgcolor: tt.pageSelectedBg,
//                       color: tt.pageSelectedText,
//                       "&:hover": { bgcolor: tt.pageSelectedBg },
//                     },
//                   }}
//                 />
//               </Box>
//             </Box>
//           </Paper>
//         </Box>
//       )}

//       {/* ISSUE NEW */}
//       {view === "issue" && (
//         <Paper variant="outlined" sx={{ mx: { xs: 1, sm: 0 }, p: { xs: 1.5, sm: 2 } }}>
//           <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
//             <Typography variant="h6" sx={{ fontWeight: 700 }}>
//               Issue Item
//             </Typography>
//             <Button variant="outlined" onClick={handleClear} sx={{ borderRadius: 1 }}>
//               Clear
//             </Button>
//           </Stack>

//           <Stack spacing={2}>
//             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
//               {/* Item */}
//               <TextField
//                 select
//                 label="Select Item *"
//                 value={form.itemName}
//                 onChange={(e) => {
//                   setForm((f) => ({ ...f, itemName: e.target.value, serialNo: "" }));
//                 }}
//                 sx={field}
//                 SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: "background.paper" } } } }}
//               >
//                 <MenuItem value="" />
//                 {toolNames.map((nm) => (
//                   <MenuItem key={nm} value={nm}>
//                     {nm}
//                   </MenuItem>
//                 ))}
//               </TextField>

//               {/* Serial depends on item */}
//               <TextField
//                 select
//                 label="Serial No *"
//                 value={form.serialNo}
//                 onChange={update("serialNo")}
//                 sx={field}
//                 disabled={!form.itemName}
//                 SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: "background.paper" } } } }}
//               >
//                 <MenuItem value="" />
//                 {serialOptions.map((sn) => (
//                   <MenuItem key={sn} value={sn}>
//                     {sn}
//                   </MenuItem>
//                 ))}
//               </TextField>

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
//                     bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
//                     color: "text.disabled",
//                   },
//                 }}
//                 onClick={issueItem}
//               >
//                 Issue
//               </Button>
//             </Box>
//           </Stack>
//         </Paper>
//       )}

//       {/* Update / Delete modal */}
//       {selectedLoan && (
//         <UpdateLoanModal
//           open={openEdit}
//           onClose={() => setOpenEdit(false)}
//           loan={selectedLoan}
//           apiBase={API_BASE}
//           onUpdated={onModalUpdated}
//           onDeleted={onModalDeleted}
//         />
//       )}
//     </Box>
//   );
// }

// Dashboard.tsx
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
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import axios from "axios";

// Modal component
import { UpdateLoanModal } from "../components/UpdateLoanModal";

// ======= API base (Vite only) =======
const API_BASE: string =
  (import.meta as any)?.env?.VITE_API_BASE ?? "http://3.110.216.196/api";

// ======= types =======
export type Tool = {
  id: string;
  name: string;
  serial_no: string;
  owner_name: string;
  asset_tag: string;
  category: string;
  remarks: string | null;
};

export type Loan = {
  id: string | number;
  tool_id?: string;
  item_name: string;
  serial_no: string;
  issued_to: string;
  issue_date: string;      // YYYY-MM-DD
  return_by: string;       // YYYY-MM-DD (planned)
  return_date?: string;    // YYYY-MM-DD (actual)
  location: string;
  issued_by: string;
  remarks: string | null;
  status: "Issued" | "Returned" | "Overdue";
};

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

// Filters dropdowns (for the table header only)
const ITEMS = ["All", "Laptop", "Access Point", "LAN Tester", "Crimping Tool", "HDMI Cable"] as const;
const STATUSES = ["All", "Issued", "Returned", "Overdue"] as const;
const BRAND_GREEN = "#78B83B";

// ===== theme tokens for the table =====
const tableTokens = (t: Theme) => {
  const dark = t.palette.mode === "dark";
  return {
    headBg: dark ? "#0F0F0F" : "#F5F5F7",
    rowBg: dark ? "#1C1C1E" : "#FFFFFF",
    border: dark ? "#333" : "#E5E7EB",
    headText: dark ? "#FFFFFF" : "#111827",
    bodyText: dark ? "#E0E0E0" : "#111827",
    scrollThumb: dark ? "#333" : "#CFCFCF",
    statusReturned: "#22C55E",
    statusIssued: "#78B83B",
    statusOverdue: "#EA9A00",
    pageSelectedBg: "#78B83B",
    pageSelectedText: "#0F0F0F",
  };
};

// ===== API client =====
const api = axios.create({ baseURL: API_BASE });

const UI = {
  card: {
    sx: {
      mx: { xs: 0, md: 0 },
      px: { xs: 1, md: 1 },
      py: { xs: 0.75, md: 0.75 },
      height: { xs: "auto", md: "calc(100vh - 115px)" },
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      borderRadius: 0.5,
    },
  },
  headerRow: {
    sx: {
      mb: 0.5,
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      flexWrap: "wrap",
      gap: { xs: 1, sm: 1.25 },
    },
  },
  selectSm: {
    size: "small" as const,
    sx: {
      minWidth: { xs: 120, sm: 120 },
      "& .MuiInputBase-root": { height: 25 },
      "& .MuiSelect-select": { py: 0.25, px: 1 },
    },
    menu: { PaperProps: { sx: { bgcolor: "background.paper" } } },
  },
  table: {
    sx: { tableLayout: "fixed", width: "100%" },
    headCell: (tt: ReturnType<typeof tableTokens>) => ({
      color: tt.headText,
      backgroundColor: tt.headBg,
      borderBottom: `1px solid ${tt.border}`,
      fontSize: 12,
      lineHeight: 1.2,
      whiteSpace: "nowrap",
      padding: "5px 8px",
      textAlign: "center" as const,
    }),
    bodyCell: (tt: ReturnType<typeof tableTokens>, isStatus: boolean, status: string) => ({
      color: isStatus
        ? status === "Returned"
          ? tt.statusReturned
          : status === "Overdue"
          ? tt.statusOverdue
          : tt.statusIssued
        : tt.bodyText,
      backgroundColor: tt.rowBg,
      borderBottom: `1px solid ${tt.border}`,
      fontSize: 12,
      lineHeight: 1.2,
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      padding: "6px 10px",
      textAlign: "center" as const,
      verticalAlign: "middle" as const,
    }),
  },
};

// ---------- helpers ----------
const pickArray = (p: any) => {
  if (Array.isArray(p)) return p;
  if (Array.isArray(p?.rows)) return p.rows;
  if (Array.isArray(p?.data)) return p.data;
  if (Array.isArray(p?.items)) return p.items;
  return [];
};

const normalizeTool = (t: any): Tool => ({
  id: t.id ?? t.tool_id ?? t.uuid ?? "",
  name: t.name ?? t.item_name ?? t.tool_name ?? "",
  serial_no: t.serial_no ?? t.serial ?? "",
  owner_name: t.owner_name ?? t.owner ?? "",
  asset_tag: t.asset_tag ?? t.assetTag ?? "",
  category: t.category ?? t.type ?? "",
  remarks: t.remarks ?? t.note ?? null,
});

// normalize loan row
const normalizeLoan = (l: any): Loan => ({
  id: l.id,
  tool_id: l.tool_id ?? undefined,
  item_name: l.item_name ?? l.itemName ?? "",
  serial_no: l.serial_no ?? "",
  issued_to: l.issued_to ?? "",
  issue_date: (l.issue_date || "").slice(0, 10),
  return_by: (l.return_by || "").slice(0, 10),
  return_date: (l.return_date || "").slice(0, 10),
  location: l.location ?? "",
  issued_by: l.issued_by ?? "",
  remarks: l.remarks ?? null,
  status: (l.status as Loan["status"]) ?? "Issued",
});

// format YYYY-MM-DD -> DD/MM/YYYY
const fmtDMY = (v?: string) => {
  if (!v) return "—";
  const iso = v.slice(0, 10);
  const parts = iso.split("-");
  if (parts.length === 3) {
    const [yyyy, mm, dd] = parts;
    return `${dd}/${mm}/${yyyy}`;
  }
  const d = new Date(v);
  if (isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = String(d.getFullYear());
  return `${dd}/${mm}/${yyyy}`;
};

// normalize + enrich loans using a provided tool list
const normalizeLoansWithTools = (payload: any, toolList: Tool[]): Loan[] => {
  const raw =
    Array.isArray(payload?.items) ? payload.items :
    Array.isArray(payload?.rows)  ? payload.rows  :
    Array.isArray(payload?.data)  ? payload.data  :
    Array.isArray(payload)        ? payload       : [];

  return raw.map((l: any) => {
    const base = normalizeLoan(l);
    const t = l.tool_id ? toolList.find(tt => tt.id === l.tool_id) : undefined;
    return {
      ...base,
      item_name: base.item_name || t?.name || "",
      serial_no: base.serial_no || t?.serial_no || "",
    };
  });
};

export default function Dashboard() {
  const theme = useTheme();
  const tt = tableTokens(theme);

  // view toggle & filters
  const [view, setView] = useState<"all" | "issue">("all");
  const [itemFilter, setItemFilter] = useState<(typeof ITEMS)[number]>("All");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUSES)[number]>("All");

  // data
  const [tools, setTools] = useState<Tool[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loadingLoans, setLoadingLoans] = useState(false);

  // keep current tools in a ref to avoid reloading/flicker
  const toolsRef = useRef<Tool[]>([]);

  // pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<10 | 20 | 50>(50);

  // form state
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

  // modal state
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  const toolNames = useMemo(
    () => [...new Set(tools.map((t) => t.name).filter(Boolean))].sort(),
    [tools]
  );

  // ---- initial combined load (tools + loans) to prevent flicker ----
  useEffect(() => {
    (async () => {
      setLoadingLoans(true);
      try {
        const [{ data: tData }, { data: lData }] = await Promise.all([
          api.get("/tools"),
          api.get("/loans"),
        ]);

        const toolsArr = pickArray(tData).map(normalizeTool);
        toolsRef.current = toolsArr;
        setTools(toolsArr);

        const loansArr = normalizeLoansWithTools(lData, toolsRef.current);
        setLoans(loansArr);
      } catch (e) {
        console.error("initial load failed", e);
      } finally {
        setLoadingLoans(false);
      }
    })();
  }, []);

  // reuseable refresh (keep table while reloading)
  const loadLoans = async () => {
    setLoadingLoans(loans.length === 0);
    try {
      const { data } = await api.get("/loans");
      const rows = normalizeLoansWithTools(data, toolsRef.current);
      setLoans(rows);
    } catch (e) {
      console.error("load loans failed", e);
    } finally {
      setLoadingLoans(false);
    }
  };

  // “latest entry per tool” (by issue_date)
  const latestPerTool = useMemo(() => {
    const sorted = [...loans].sort((a, b) => b.issue_date.localeCompare(a.issue_date));
    const seen = new Set<string>();
    const out: Loan[] = [];
    for (const r of sorted) {
      const key = r.tool_id || `${r.item_name}|${r.serial_no}`;
      if (!seen.has(key)) {
        out.push(r);
        seen.add(key);
      }
    }
    return out;
  }, [loans]);

  // filter + paginate
  useEffect(() => {
    setPage(1);
  }, [itemFilter, statusFilter, rowsPerPage]);

  const filtered = useMemo(() => {
    return latestPerTool.filter((r) => {
      const okItem = itemFilter === "All" || r.item_name === itemFilter;
      const okStatus = statusFilter === "All" || r.status === statusFilter;
      return okItem && okStatus;
    });
  }, [latestPerTool, itemFilter, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = useMemo(
    () => filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  // form helpers
  const field = { flex: "1 1 320px", minWidth: 0 };
  const update =
    (k: keyof EntryForm) =>
    (e: React.ChangeEvent<HTMLInputElement> | any) =>
      setForm((f) => ({ ...f, [k]: e.target?.value ?? e }));

  const handleClear = () => setForm(initialForm);
  const serialOptions = useMemo(
    () => (Array.isArray(tools) ? tools.filter((t) => t.name === form.itemName).map((t) => t.serial_no) : []),
    [tools, form.itemName]
  );

  const selectedTool = useMemo(
    () => tools.find(t => t.name === form.itemName && t.serial_no === form.serialNo) || null,
    [tools, form.itemName, form.serialNo]
  );

  // disable button unless we also have a matching tool_id
  const disableIssue =
    !form.itemName ||
    !form.serialNo ||
    !form.issuedTo ||
    !form.issueDate ||
    !form.returnBy ||
    !form.location ||
    !form.issuedBy ||
    !selectedTool;

  // Create a loan — block only if latest loan for this tool is not Returned
  const issueItem = async () => {
    if (!selectedTool) {
      alert("Please pick a valid Item & Serial (no matching tool found).");
      return;
    }

    try {
      const resp = await api.get(`/loans`, {
        params: { tool_id: selectedTool.id, pageSize: 1 } // API orders by issue_date DESC
      });

      const list =
        Array.isArray(resp.data?.items) ? resp.data.items :
        Array.isArray(resp.data?.rows)  ? resp.data.rows  :
        Array.isArray(resp.data?.data)  ? resp.data.data  :
        Array.isArray(resp.data)        ? resp.data       : [];

      const last = list[0];

      if (last && last.status !== "Returned") {
        alert("This tool is currently issued. Return it first, then issue again.");
        return;
      }
    } catch {
      // Let backend enforce if something went wrong here
    }

    const payload = {
      tool_id: selectedTool.id,
      item_name: form.itemName,
      serial_no: form.serialNo,
      issued_to: form.issuedTo,
      issue_date: form.issueDate,   // YYYY-MM-DD
      return_by: form.returnBy,     // tentative date
      location: form.location,
      issued_by: form.issuedBy,
      remarks: form.remarks || null,
      status: "Issued",
    };

    try {
      const { data } = await api.post("/loans", payload, {
        headers: { "Content-Type": "application/json" },
      });

      const createdRaw = data?.row ?? data?.loan ?? data;
      const createdLoan =
        createdRaw && createdRaw.id ? normalizeLoan(createdRaw) : null;

      if (createdLoan) {
        setLoans(prev => [createdLoan, ...prev]);
      } else {
        await loadLoans();
      }

      handleClear();
      setView("all");
      setPage(1);
    } catch (e: any) {
      console.error("issue failed", e?.response?.data ?? e);
      alert(e?.response?.data?.error || "Failed to issue item.");
    }
  };

  const openUpdate = (row: Loan) => {
    setSelectedLoan(row);
    setOpenEdit(true);
  };

  const onModalUpdated = async () => {
    setOpenEdit(false);
    await loadLoans();
  };
  const onModalDeleted = async () => {
    setOpenEdit(false);
    await loadLoans();
  };

  return (
    <Box>
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
            px: 1,
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
        <ToggleButton value="all">All Entries</ToggleButton>
        <ToggleButton value="issue">Issue New</ToggleButton>
      </ToggleButtonGroup>

      {/* ALL ITEMS */}
      {view === "all" && (
        <Box sx={{ mx: { xs: -1.5, md: -1.5 } }}>
          <Paper variant="outlined" sx={UI.card.sx}>
            <Box sx={UI.headerRow.sx}>
              <FormControl size={UI.selectSm.size} sx={UI.selectSm.sx}>
                <InputLabel>Item Name</InputLabel>
                <Select
                  label="Item Name"
                  value={itemFilter}
                  onChange={(e) => setItemFilter(e.target.value as any)}
                  MenuProps={UI.selectSm.menu}
                >
                  {ITEMS.map((it) => (
                    <MenuItem key={it} value={it}>
                      {it}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size={UI.selectSm.size} sx={UI.selectSm.sx}>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  MenuProps={UI.selectSm.menu}
                >
                  {STATUSES.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Divider sx={{ mb: 0.5, borderColor: tt.border }} />

            <TableContainer
              sx={{
                flex: 1,
                overflow: "auto",
                "&::-webkit-scrollbar": { width: 8, height: 8 },
                "&::-webkit-scrollbar-thumb": { background: tt.scrollThumb, borderRadius: 4 },
              }}
            >
              <Table stickyHeader sx={UI.table.sx}>
                <TableHead>
                  <TableRow>
                    {[
                      "Sr No",
                      "Item Name",
                      "Serial No",
                      "Issued To",
                      "Issue Date",
                      "Return By", // shows actual return_date when available
                      "Location",
                      "Issued By",
                      "Remarks",
                      "Status",
                      "Action",
                    ].map((col, i, arr) => (
                      <TableCell
                        key={col}
                        sx={{
                          ...UI.table.headCell(tt),
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
                  {loadingLoans && loans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} align="center" sx={{ py: 3 }}>
                        Loading…
                      </TableCell>
                    </TableRow>
                  ) : paginated.length ? (
                    paginated.map((r, idx) => {
                      const displayReturn = r.return_date || r.return_by; // actual beats planned
                      return (
                        <TableRow key={r.id} hover>
                          {[
                            (page - 1) * rowsPerPage + idx + 1,
                            r.item_name,
                            r.serial_no,
                            r.issued_to,
                            fmtDMY(r.issue_date),
                            fmtDMY(displayReturn),
                            r.location,
                            r.issued_by,
                            r.remarks || "—",
                            r.status,
                            "__ACTION__",
                          ].map((cell, j) => {
                            const isStatus = j === 9;
                            return (
                              <TableCell key={j} sx={UI.table.bodyCell(tt, isStatus, r.status)}>
                                {cell === "__ACTION__" ? (
                                  <Button
                                    size="small"
                                    variant="contained"
                                    sx={{
                                      textTransform: "none",
                                      fontSize: 12,
                                      px: 1.25,
                                      py: 0.25,
                                      minWidth: 70,
                                      bgcolor: "#FFC000",
                                      color: "#000",
                                      "&:hover": { bgcolor: "#D4A420" },
                                    }}
                                    onClick={() => openUpdate(r)}
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
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={11} align="center" sx={{ color: "text.secondary", py: 3 }}>
                        No records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 0.75, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Rows:
                </Typography>
                <FormControl size="small">
                  <Select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(e.target.value as 10 | 20 | 50)}
                    sx={{ height: 32, "& .MuiSelect-select": { py: 0.25, minWidth: 52 } }}
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
                    "& .MuiPaginationItem-root": { color: theme.palette.text.primary, minWidth: 28, height: 28 },
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
        </Box>
      )}

      {/* ISSUE NEW */}
      {view === "issue" && (
        <Paper variant="outlined" sx={{ mx: { xs: 1, sm: 0 }, p: { xs: 1.5, sm: 2 } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Issue Item
            </Typography>
            <Button variant="outlined" onClick={handleClear} sx={{ borderRadius: 1 }}>
              Clear
            </Button>
          </Stack>

          <Stack spacing={2}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {/* Item */}
              <TextField
                select
                label="Select Item *"
                value={form.itemName}
                onChange={(e) => {
                  setForm((f) => ({ ...f, itemName: e.target.value, serialNo: "" }));
                }}
                sx={field}
                SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: "background.paper" } } } }}
              >
                <MenuItem value="" />
                {toolNames.map((nm) => (
                  <MenuItem key={nm} value={nm}>
                    {nm}
                  </MenuItem>
                ))}
              </TextField>

              {/* Serial depends on item */}
              <TextField
                select
                label="Serial No *"
                value={form.serialNo}
                onChange={update("serialNo")}
                sx={field}
                disabled={!form.itemName}
                SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: "background.paper" } } } }}
              >
                <MenuItem value="" />
                {serialOptions.map((sn) => (
                  <MenuItem key={sn} value={sn}>
                    {sn}
                  </MenuItem>
                ))}
              </TextField>

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
                    bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                    color: "text.disabled",
                  },
                }}
                onClick={issueItem}
              >
                Issue
              </Button>
            </Box>
          </Stack>
        </Paper>
      )}

      {/* Update / Delete modal */}
      {selectedLoan && (
        <UpdateLoanModal
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          loan={selectedLoan}
          apiBase={API_BASE}
          onUpdated={onModalUpdated}
          onDeleted={onModalDeleted}
        />
      )}
    </Box>
  );
}
