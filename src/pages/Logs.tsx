// // Logs.tsx — real data version (no demo rows)
// import {
//   Box,
//   Divider,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Pagination,
//   Paper,
//   Select,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@mui/material";
// import { useEffect, useMemo, useState } from "react";
// import { useTheme } from "@mui/material/styles";
// import type { Theme } from "@mui/material/styles";
// import axios from "axios";

// /* ========= API base ========= */
// const API_BASE: string =
//   (import.meta as any)?.env?.VITE_API_BASE ?? "http://3.110.216.196/api";
// const api = axios.create({ baseURL: API_BASE });

// /* ========= types ========= */
// type Tool = {
//   id: string;
//   name: string;
//   serial_no: string;
//   owner_name: string;
//   asset_tag: string;
//   category: string;
//   remarks: string | null;
// };

// type Loan = {
//   id: string | number;
//   item_name: string;
//   serial_no: string;
//   issued_to: string;
//   issue_date: string;  // YYYY-MM-DD
//   return_by: string;   // YYYY-MM-DD
//   location: string;
//   issued_by: string;
//   remarks: string | null;
//   status: "Issued" | "Returned" | "Overdue";
//   tool_id?: string;
// };

// /* ========= theme tokens / compact UI like Dashboard ========= */
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
//   const iso = v.slice(0, 10);              // try fast-path for YYYY-MM-DD
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


// const UI = {
//   bleedWrap: { mx: { xs: -1.5, md: -1.5 } },
//   card: {
//     sx: {
//       mx: 0,
//       px: { xs: 1, md: 1 },
//       py: { xs: 0.75, md: 0.75 },
//       height: { xs: "auto", md: "calc(100vh - 80px)" },
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
//       justifyContent: "space-between",
//       alignItems: "center",
//       flexWrap: "wrap",
//       gap: { xs: 1, sm: 1.25 },
//     },
//   },
//   filtersRight: {
//     sx: { display: "flex", gap: 1, marginLeft: "auto", alignItems: "center", flexWrap: "wrap" },
//   },
//   selectSm: {
//     size: "small" as const,
//     sx: {
//       minWidth: { xs: 120, sm: 140 },
//       "& .MuiInputBase-root": { height: 28 },
//       "& .MuiSelect-select": { py: 0.25, px: 1 },
//     },
//     menu: { PaperProps: { sx: { bgcolor: "background.paper" } } },
//   },
//   table: {
//     sx: { tableLayout: "fixed", width: "100%" },
//     headCell: (tt: ReturnType<typeof tableTokens>) => ({
//       color: tt.headText,
//       backgroundColor: tt.headBg,
//       borderBottom: `1px solid ${tt.border}`,
//       fontSize: 12,
//       lineHeight: 1.2,
//       whiteSpace: "nowrap",
//       padding: "6px 10px",
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
//       padding: "7px 10px",
//       textAlign: "center" as const,
//       verticalAlign: "middle" as const,
//     }),
//   },
// };

// /* ========= helpers ========= */
// const pickArray = (p: any) => {
//   if (Array.isArray(p)) return p;
//   if (Array.isArray(p?.items)) return p.items;
//   if (Array.isArray(p?.rows)) return p.rows;
//   if (Array.isArray(p?.data)) return p.data;
//   return [];
// };

// const normalizeTool = (t: any): Tool => ({
//   id: t.id ?? t.tool_id ?? t.uuid ?? "",
//   name: t.name ?? t.item_name ?? t.tool_name ?? "",
//   serial_no: t.serial_no ?? t.serial ?? "",
//   owner_name: t.owner_name ?? t.owner ?? "",
//   asset_tag: t.asset_tag ?? t.assetTag ?? "",
//   category: t.category ?? t.type ?? "",
//   remarks: t.remarks ?? t.note ?? null,
// });

// const normalizeLoan = (l: any): Loan => ({
//   id: l.id,
//   item_name: l.item_name ?? l.itemName ?? "",
//   serial_no: l.serial_no ?? "",
//   issued_to: l.issued_to ?? "",
//   issue_date: (l.issue_date || "").slice(0, 10),
//   return_by: (l.return_by || "").slice(0, 10),
//   location: l.location ?? "",
//   issued_by: l.issued_by ?? "",
//   remarks: l.remarks ?? null,
//   status: (l.status as Loan["status"]) ?? "Issued",
//   tool_id: l.tool_id ?? l.toolId,
// });

// /* ========= component ========= */
// export default function Logs() {
//   const theme = useTheme();
//   const tt = tableTokens(theme);

//   const [tools, setTools] = useState<Tool[]>([]);
//   const [loans, setLoans] = useState<Loan[]>([]);
//   const [loading, setLoading] = useState(false);

//   // filters
//   const [itemFilter, setItemFilter] = useState<string>("All");
//   const [statusFilter, setStatusFilter] = useState<Loan["status"] | "All">("All");

//   // pagination
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState<10 | 20 | 50>(50);
//   useEffect(() => setPage(1), [itemFilter, statusFilter, rowsPerPage]);

//   // load tools then loans (so we can enrich names/serials if API omits them)
//   useEffect(() => {
//     (async () => {
//       try {
//         const { data } = await api.get("/tools");
//         setTools(pickArray(data).map(normalizeTool));
//       } catch {
//         setTools([]);
//       }
//     })();
//   }, []);

//   const loadLoans = async () => {
//     setLoading(true);
//     try {
//       const { data } = await api.get("/loans"); // backend returns all by default
//       const raw = pickArray(data);
//       const rows = raw.map((l: any) => {
//         const base = normalizeLoan(l);
//         const t = l.tool_id ? tools.find((x) => x.id === l.tool_id) : undefined;
//         return {
//           ...base,
//           item_name: base.item_name || t?.name || "",
//           serial_no: base.serial_no || t?.serial_no || "",
//         };
//       });
//       setLoans(rows);
//     } catch {
//       setLoans([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadLoans();
//     // re-normalize if tools arrive later
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [tools]);

//   // dynamic item list from data
//   // const itemNames = useMemo(
//   //   () => ["All", ...Array.from(new Set(loans.map((l) => l.item_name).filter(Boolean))).sort()],
//   //   [loans]
//   // );


//   const itemNames = useMemo(() => {
//   const s = new Set<string>();
//   tools.forEach(t => t.name && s.add(t.name));
//   loans.forEach(l => l.item_name && s.add(l.item_name));
//   return ["All", ...Array.from(s).sort()];
// }, [tools, loans]);

//   // filter + paginate
//   const filtered = useMemo(() => {
//     return loans.filter((r) => {
//       const okItem = itemFilter === "All" || r.item_name === itemFilter;
//       const okStatus = statusFilter === "All" || r.status === statusFilter;
//       return okItem && okStatus;
//     });
//   }, [loans, itemFilter, statusFilter]);

//   const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
//   const paginated = useMemo(
//     () => filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage),
//     [filtered, page, rowsPerPage]
//   );

//   return (
//     <Box>
//       <Box sx={UI.bleedWrap}>
//         <Paper variant="outlined" sx={UI.card.sx}>
//           {/* Header */}
//           <Box sx={UI.headerRow.sx}>
//             <Typography variant="h6" sx={{ fontWeight: 700 }}>
//               All items History
//             </Typography>

//             <Box sx={UI.filtersRight.sx}>
//               <FormControl size={UI.selectSm.size} sx={UI.selectSm.sx}>
//                 <InputLabel>Item Name</InputLabel>
//               <Select
//                 label="Item Name"
//                 value={itemFilter}
//                 onChange={(e) => setItemFilter(e.target.value as string)}
//                 MenuProps={UI.selectSm.menu}
//               >
//                 {itemNames.map((it) => (
//                   <MenuItem key={it} value={it}>
//                     {it}
//                   </MenuItem>
//                 ))}
//               </Select>

//               </FormControl>

//               <FormControl size={UI.selectSm.size} sx={UI.selectSm.sx}>
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                   label="Status"
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value as any)}
//                   MenuProps={UI.selectSm.menu}
//                 >
//                   {(["All", "Issued", "Returned", "Overdue"] as const).map((s) => (
//                     <MenuItem key={s} value={s}>
//                       {s}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Box>
//           </Box>

//           <Divider sx={{ mb: 0.5, borderColor: tt.border }} />

//           {/* Table */}
//           <TableContainer
//             sx={{
//               flex: 1,
//               overflow: "auto",
//               "&::-webkit-scrollbar": { width: 8, height: 8 },
//               "&::-webkit-scrollbar-thumb": { background: tt.scrollThumb, borderRadius: 4 },
//             }}
//           >
//             <Table stickyHeader sx={UI.table.sx}>
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
//                   ].map((col, i, arr) => (
//                     <TableCell
//                       key={col}
//                       sx={{
//                         ...UI.table.headCell(tt),
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
//                 {loading ? (
//                   <TableRow>
//                     <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
//                       Loading…
//                     </TableCell>
//                   </TableRow>
//                 ) : paginated.length ? (
//                   paginated.map((r, idx) => (
//                     <TableRow key={r.id} hover>
//                       {[
//                         (page - 1) * rowsPerPage + idx + 1,
//                         r.item_name,
//                         r.serial_no,
//                         r.issued_to,
//                         // new Date(r.issue_date).toLocaleDateString(),
//                         // new Date(r.return_by).toLocaleDateString(),
//                         fmtDMY(r.issue_date),
// fmtDMY(r.return_by),
//                         r.location,
//                         r.issued_by,
//                         r.remarks ?? "—",
//                         r.status,
//                       ].map((cell, j) => {
//                         const isStatus = j === 9;
//                         return (
//                           <TableCell key={j} sx={UI.table.bodyCell(tt, isStatus, r.status)}>
//                             {cell}
//                           </TableCell>
//                         );
//                       })}
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={10} align="center" sx={{ color: "text.secondary", py: 3 }}>
//                       No records found
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           {/* Bottom controls */}
//           <Box sx={{ mt: 0.75, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
//               <Typography variant="body2" sx={{ color: "text.secondary" }}>
//                 Rows:
//               </Typography>
//               <FormControl size="small">
//                 <Select
//                   value={rowsPerPage}
//                   onChange={(e) => setRowsPerPage(e.target.value as 10 | 20 | 50)}
//                   sx={{ height: 32, "& .MuiSelect-select": { py: 0.25, minWidth: 52 } }}
//                 >
//                   {[10, 20, 50].map((n) => (
//                     <MenuItem key={n} value={n}>
//                       {n}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Box>

//             <Box sx={{ ml: "auto" }}>
//               <Pagination
//                 count={pageCount}
//                 page={page}
//                 onChange={(_, v) => setPage(v)}
//                 size="small"
//                 shape="rounded"
//                 siblingCount={1}
//                 boundaryCount={1}
//                 sx={{
//                   "& .MuiPaginationItem-root": { color: theme.palette.text.primary, minWidth: 28, height: 28 },
//                   "& .Mui-selected": {
//                     bgcolor: tt.pageSelectedBg,
//                     color: tt.pageSelectedText,
//                     "&:hover": { bgcolor: tt.pageSelectedBg },
//                   },
//                 }}
//               />
//             </Box>
//           </Box>
//         </Paper>
//       </Box>
//     </Box>
//   );
// }





// Logs.tsx — Issuing-history (all entries) aligned to new schema
// import {
//   Box,
//   Divider,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Pagination,
//   Paper,
//   Select,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@mui/material";
// import { useEffect, useMemo, useState } from "react";
// import { useTheme } from "@mui/material/styles";
// import type { Theme } from "@mui/material/styles";
// import axios from "axios";

// /* ========= API base ========= */
// const API_BASE: string =
//   (import.meta as any)?.env?.VITE_API_BASE ?? "http://3.110.216.196/api";
// const api = axios.create({ baseURL: API_BASE });

// /* ========= types (schema-aligned) ========= */
// type Tool = {
//   id: number;
//   item_name: string;
//   serial_no: string;
//   category: string | null;
// };

// type Loan = {
//   id: number;
//   item_name: string;
//   serial_no: string;
//   category: string | null;
//   assigned_pm: string;
//   project: string;
//   assign_to: string;
//   assign_date: string;      // YYYY-MM-DD
//   return_by: string;        // YYYY-MM-DD
//   return_date: string | null; // YYYY-MM-DD or null
//   status: "issued" | "returned" | "overdue" | "lost";
//   remarks: string | null;
//   tool_id?: number | null;
// };

// /* ========= tokens / compact UI ========= */
// const tableTokens = (t: Theme) => {
//   const dark = t.palette.mode === "dark";
//   return {
//     headBg: dark ? "#0F0F0F" : "#F5F5F7",
//     rowBg: dark ? "#1C1C1E" : "#FFFFFF",
//     border: dark ? "#333" : "#E5E7EB",
//     headText: dark ? "#FFFFFF" : "#111827",
//     bodyText: dark ? "#E0E0E0" : "#111827",
//     scrollThumb: dark ? "#333" : "#CFCFCF",
//     statusIssued: "#78B83B",
//     statusReturned: "#22C55E",
//     statusOverdue: "#EA9A00",
//     statusLost: "#EF4444",
//     pageSelectedBg: "#78B83B",
//     pageSelectedText: "#0F0F0F",
//   };
// };

// // Format YYYY-MM-DD (or parseable date) -> DD/MM/YYYY
// const fmtDMY = (v?: string | null) => {
//   if (!v) return "—";
//   const iso = v.slice(0, 10);
//   const [y, m, d] = iso.split("-");
//   if (y && m && d) return `${d}/${m}/${y}`;
//   const dt = new Date(v);
//   if (isNaN(dt.getTime())) return "—";
//   return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
// };

// const UI = {
//   bleedWrap: { mx: { xs: -1.5, md: -1.5 } },
//   card: {
//     sx: {
//       mx: 0,
//       px: { xs: 1, md: 1 },
//       py: { xs: 0.75, md: 0.75 },
//       height: { xs: "auto", md: "calc(100vh - 80px)" },
//       display: "flex",
//       flexDirection: "column" as const,
//       overflow: "hidden",
//       borderRadius: 0.5,
//     },
//   },
//   headerRow: {
//     sx: {
//       mb: 0.5,
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       flexWrap: "wrap" as const,
//       gap: { xs: 1, sm: 1.25 },
//     },
//   },
//   filtersRight: {
//     sx: {
//       display: "flex",
//       gap: 1,
//       marginLeft: "auto",
//       alignItems: "center",
//       flexWrap: "wrap",
//     },
//   },
//   selectSm: {
//     size: "small" as const,
//     sx: {
//       minWidth: { xs: 120, sm: 140 },
//       "& .MuiInputBase-root": { height: 28 },
//       "& .MuiSelect-select": { py: 0.25, px: 1 },
//     },
//     menu: { PaperProps: { sx: { bgcolor: "background.paper" } } },
//   },
//   table: {
//     sx: { tableLayout: "fixed" as const, width: "100%" },
//     headCell: (tt: ReturnType<typeof tableTokens>) => ({
//       color: tt.headText,
//       backgroundColor: tt.headBg,
//       borderBottom: `1px solid ${tt.border}`,
//       fontSize: 12,
//       lineHeight: 1.2,
//       whiteSpace: "nowrap" as const,
//       padding: "6px 10px",
//       textAlign: "center" as const,
//     }),
//     bodyCell: (
//       tt: ReturnType<typeof tableTokens>,
//       status?: Loan["status"]
//     ) => ({
//       color:
//         status === "returned"
//           ? tt.statusReturned
//           : status === "overdue"
//           ? tt.statusOverdue
//           : status === "lost"
//           ? tt.statusLost
//           : tt.bodyText,
//       backgroundColor: tt.rowBg,
//       borderBottom: `1px solid ${tt.border}`,
//       fontSize: 12,
//       lineHeight: 1.2,
//       whiteSpace: "nowrap" as const,
//       textOverflow: "ellipsis" as const,
//       overflow: "hidden" as const,
//       padding: "7px 10px",
//       textAlign: "center" as const,
//       verticalAlign: "middle" as const,
//     }),
//   },
// };

// /* ========= helpers ========= */
// const pickArray = (p: any) => {
//   if (Array.isArray(p)) return p;
//   if (Array.isArray(p?.items)) return p.items;
//   if (Array.isArray(p?.rows)) return p.rows;
//   if (Array.isArray(p?.data)) return p.data;
//   return [];
// };

// const normalizeTool = (t: any): Tool => ({
//   id: Number(t.id ?? 0),
//   item_name: t.item_name ?? t.name ?? "",
//   serial_no: t.serial_no ?? t.serial ?? "",
//   category: t.category ?? null,
// });

// const normalizeLoan = (l: any): Loan => ({
//   id: Number(l.id),
//   item_name: l.item_name ?? "",
//   serial_no: l.serial_no ?? "",
//   category: l.category ?? null,
//   assigned_pm: l.assigned_pm ?? "",
//   project: l.project ?? "",
//   assign_to: l.assign_to ?? "",
//   assign_date: String(l.assign_date || "").slice(0, 10),
//   return_by: String(l.return_by || "").slice(0, 10),
//   return_date: l.return_date ? String(l.return_date).slice(0, 10) : null,
//   status: (l.status as Loan["status"]) ?? "issued",
//   remarks: l.remarks ?? null,
//   tool_id: l.tool_id ?? null,
// });

// /* ========= component ========= */
// export default function Logs() {
//   const theme = useTheme();
//   const tt = tableTokens(theme);

//   const [tools, setTools] = useState<Tool[]>([]);
//   const [loans, setLoans] = useState<Loan[]>([]);
//   const [loading, setLoading] = useState(false);

//   // filters
//   const [itemFilter, setItemFilter] = useState<string>("All");
//   const [statusFilter, setStatusFilter] = useState<Loan["status"] | "All">("All");

//   // pagination
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState<10 | 20 | 50>(50);
//   useEffect(() => setPage(1), [itemFilter, statusFilter, rowsPerPage]);

//   // load tools first (for item list + enrichment fallback), then loans
//   useEffect(() => {
//     (async () => {
//       try {
//         const { data } = await api.get("/tools");
//         setTools(pickArray(data).map(normalizeTool));
//       } catch {
//         setTools([]);
//       }
//     })();
//   }, []);

//   const loadLoans = async () => {
//     setLoading(true);
//     try {
//       const { data } = await api.get("/loans"); // backend: full history
//       const rows = pickArray(data).map((l: any) => {
//         const base = normalizeLoan(l);
//         // fallback enrichment if API row omitted info
//         if ((!base.item_name || !base.serial_no) && base.tool_id) {
//           const t = tools.find((x) => x.id === base.tool_id);
//           return {
//             ...base,
//             item_name: base.item_name || t?.item_name || "",
//             serial_no: base.serial_no || t?.serial_no || "",
//             category: base.category ?? t?.category ?? null,
//           };
//         }
//         return base;
//       });
//       setLoans(rows);
//     } catch {
//       setLoans([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadLoans();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [tools]);

//   // dynamic item list (from tools + loans)
//   const itemNames = useMemo(() => {
//     const s = new Set<string>();
//     tools.forEach((t) => t.item_name && s.add(t.item_name));
//     loans.forEach((l) => l.item_name && s.add(l.item_name));
//     return ["All", ...Array.from(s).sort()];
//   }, [tools, loans]);

//   // filter + paginate
//   const filtered = useMemo(() => {
//     return loans.filter((r) => {
//       const okItem = itemFilter === "All" || r.item_name === itemFilter;
//       const okStatus = statusFilter === "All" || r.status === statusFilter;
//       return okItem && okStatus;
//     });
//   }, [loans, itemFilter, statusFilter]);

//   const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
//   const paginated = useMemo(
//     () => filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage),
//     [filtered, page, rowsPerPage]
//   );

//   return (
//     <Box>
//       <Box sx={UI.bleedWrap}>
//         <Paper variant="outlined" sx={UI.card.sx}>
//           {/* Header */}
//           <Box sx={UI.headerRow.sx}>
//             <Typography variant="h6" sx={{ fontWeight: 700 }}>
//               All items History
//             </Typography>

//             <Box sx={UI.filtersRight.sx}>
//               <FormControl size={UI.selectSm.size} sx={UI.selectSm.sx}>
//                 <InputLabel>Item Name</InputLabel>
//                 <Select
//                   label="Item Name"
//                   value={itemFilter}
//                   onChange={(e) => setItemFilter(e.target.value as string)}
//                   MenuProps={UI.selectSm.menu}
//                 >
//                   {itemNames.map((it) => (
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
//                   {(["All", "issued", "returned", "overdue", "lost"] as const).map((s) => (
//                     <MenuItem key={s} value={s}>
//                       {s}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Box>
//           </Box>

//           <Divider sx={{ mb: 0.5, borderColor: tt.border }} />

//           {/* Table */}
//           <TableContainer
//             sx={{
//               flex: 1,
//               overflow: "auto",
//               "&::-webkit-scrollbar": { width: 8, height: 8 },
//               "&::-webkit-scrollbar-thumb": { background: tt.scrollThumb, borderRadius: 4 },
//             }}
//           >
//             <Table stickyHeader sx={UI.table.sx}>
//               <TableHead>
//                 <TableRow>
//                   {[
//                     "Sr No",
//                     "Item Name",
//                     "Serial No",
//                     "Category",
//                     "Assigned PM",
//                     "Project",
//                     "Assign To",
//                     "Assign Date",
//                     "Return By",
//                     "Return Date",
//                     "Status",
//                     "Remarks",
//                   ].map((col, i, arr) => (
//                     <TableCell
//                       key={col}
//                       sx={{
//                         ...UI.table.headCell(tt),
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
//                 {loading ? (
//                   <TableRow>
//                     <TableCell colSpan={12} align="center" sx={{ py: 3 }}>
//                       Loading…
//                     </TableCell>
//                   </TableRow>
//                 ) : paginated.length ? (
//                   paginated.map((r, idx) => (
//                     <TableRow key={r.id} hover>
//                       {[
//                         (page - 1) * rowsPerPage + idx + 1,
//                         r.item_name,
//                         r.serial_no,
//                         r.category || "—",
//                         r.assigned_pm,
//                         r.project,
//                         r.assign_to,
//                         fmtDMY(r.assign_date),
//                         fmtDMY(r.return_by),
//                         fmtDMY(r.return_date),
//                         r.status,
//                         r.remarks ?? "—",
//                       ].map((cell, j) => (
//                         <TableCell
//                           key={j}
//                           sx={UI.table.bodyCell(tt, j === 10 ? (r.status as Loan["status"]) : undefined)}
//                         >
//                           {cell}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={12} align="center" sx={{ color: "text.secondary", py: 3 }}>
//                       No records found
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           {/* Bottom controls */}
//           <Box sx={{ mt: 0.75, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
//               <Typography variant="body2" sx={{ color: "text.secondary" }}>
//                 Rows:
//               </Typography>
//               <FormControl size="small">
//                 <Select
//                   value={rowsPerPage}
//                   onChange={(e) => setRowsPerPage(e.target.value as 10 | 20 | 50)}
//                   sx={{ height: 32, "& .MuiSelect-select": { py: 0.25, minWidth: 52 } }}
//                 >
//                   {[10, 20, 50].map((n) => (
//                     <MenuItem key={n} value={n}>
//                       {n}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Box>

//             <Box sx={{ ml: "auto" }}>
//               <Pagination
//                 count={pageCount}
//                 page={page}
//                 onChange={(_, v) => setPage(v)}
//                 size="small"
//                 shape="rounded"
//                 siblingCount={1}
//                 boundaryCount={1}
//                 sx={{
//                   "& .MuiPaginationItem-root": { color: theme.palette.text.primary, minWidth: 28, height: 28 },
//                   "& .Mui-selected": {
//                     bgcolor: tt.pageSelectedBg,
//                     color: tt.pageSelectedText,
//                     "&:hover": { bgcolor: tt.pageSelectedBg },
//                   },
//                 }}
//               />
//             </Box>
//           </Box>
//         </Paper>
//       </Box>
//     </Box>
//   );
// }







///

// import {
//   Box,
//   Divider,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Pagination,
//   Paper,
//   Select,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@mui/material";
// import { useEffect, useMemo, useState } from "react";
// import { useTheme } from "@mui/material/styles";
// import type { Theme } from "@mui/material/styles";
// import axios from "axios";

// /* ========= API base ========= */
// const API_BASE: string =
//   (import.meta as any)?.env?.VITE_API_BASE ?? "http://3.110.216.196/api";
// const api = axios.create({ baseURL: API_BASE });

// /* ========= types ========= */
// type LogRow = {
//   id: number;
//   item_name: string;
//   serial_no: string | null;
//   category: string | null;
//   assigned_pm: string | null;
//   project: string | null;
//   assign_to: string | null;
//   assign_date: string | null;
//   return_by: string | null;
//   return_date: string | null;
//   status: "issued" | "returned" | "overdue" | "lost";
//   remarks: string | null;
//   tool_id?: number | null;
//   qty?: number | null;
//   created_at?: string | null;
// };

// /* ========= theme tokens ========= */
// const tableTokens = (t: Theme) => {
//   const dark = t.palette.mode === "dark";
//   return {
//     headBg: dark ? "#0F0F0F" : "#F5F5F7",
//     rowBg: dark ? "#1C1C1E" : "#FFFFFF",
//     border: dark ? "#333" : "#E5E7EB",
//     headText: dark ? "#FFFFFF" : "#111827",
//     bodyText: dark ? "#E0E0E0" : "#111827",
//     scrollThumb: dark ? "#333" : "#CFCFCF",
//     statusIssued: "#78B83B",
//     statusReturned: "#22C55E",
//     statusOverdue: "#EA9A00",
//     statusLost: "#EF4444",
//     pageSelectedBg: "#78B83B",
//     pageSelectedText: "#0F0F0F",
//   };
// };

// /* ========= utils ========= */
// const fmtDMY = (v?: string | null) => {
//   if (!v) return "—";
//   const iso = v.slice(0, 10);
//   const [y, m, d] = iso.split("-");
//   if (y && m && d) return `${d}/${m}/${y}`;
//   const dt = new Date(v);
//   if (isNaN(dt.getTime())) return "—";
//   return `${String(dt.getDate()).padStart(2, "0")}/${String(
//     dt.getMonth() + 1
//   ).padStart(2, "0")}/${dt.getFullYear()}`;
// };

// const pickArray = (p: any) => {
//   if (Array.isArray(p)) return p;
//   if (Array.isArray(p?.rows)) return p.rows;
//   if (Array.isArray(p?.items)) return p.items;
//   if (Array.isArray(p?.data)) return p.data;
//   return [];
// };

// /* ========= component ========= */
// export default function Logs() {
//   const theme = useTheme();
//   const tt = tableTokens(theme);

//   const [logs, setLogs] = useState<LogRow[]>([]);
//   const [loading, setLoading] = useState(false);

//   // filters
//   const [itemFilter, setItemFilter] = useState("All");
//   const [statusFilter, setStatusFilter] = useState<LogRow["status"] | "All">(
//     "All"
//   );

//   // pagination
//   const [page, setPage] = useState(1);
//   const [pageCount, setPageCount] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState<10 | 20 | 50>(50);

//   useEffect(() => {
//     setPage(1);
//   }, [itemFilter, statusFilter, rowsPerPage]);

//   const loadLogs = async () => {
//     setLoading(true);
//     try {
//       const params: any = { page, pageSize: rowsPerPage };
//       if (statusFilter !== "All") params.status = statusFilter;
//       if (itemFilter !== "All") params.q = itemFilter;

//       const { data } = await api.get("/logs", { params });
//       const rows = pickArray(data);
//       setLogs(rows);
//       if (data.total && data.pageSize)
//         setPageCount(Math.ceil(data.total / data.pageSize));
//       else setPageCount(1);
//     } catch (e) {
//       console.error("Failed to load logs:", e);
//       setLogs([]);
//       setPageCount(1);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadLogs();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page, rowsPerPage, itemFilter, statusFilter]);

//   // unique item list
//   const itemNames = useMemo(() => {
//     const s = new Set<string>();
//     logs.forEach((l) => l.item_name && s.add(l.item_name));
//     return ["All", ...Array.from(s).sort()];
//   }, [logs]);

//   return (
//     <Box>
//       <Box sx={{ mx: { xs: -1.5, md: -1.5 } }}>
//         <Paper
//           variant="outlined"
//           sx={{
//             mx: 0,
//             px: 1,
//             py: 0.75,
//             height: { xs: "auto", md: "calc(100vh - 80px)" },
//             display: "flex",
//             flexDirection: "column",
//             overflow: "hidden",
//             borderRadius: 0.5,
//           }}
//         >
//           {/* Header */}
//           <Box
//             sx={{
//               mb: 0.5,
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               flexWrap: "wrap",
//               gap: 1,
//             }}
//           >
//             <Typography variant="h6" sx={{ fontWeight: 700 }}>
//               Logs / Change History
//             </Typography>

//             <Box sx={{ display: "flex", gap: 1, ml: "auto", flexWrap: "wrap" }}>
//               <FormControl size="small" sx={{ minWidth: 140 }}>
//                 <InputLabel>Item Name</InputLabel>
//                 <Select
//                   label="Item Name"
//                   value={itemFilter}
//                   onChange={(e) => setItemFilter(e.target.value as string)}
//                 >
//                   {itemNames.map((n) => (
//                     <MenuItem key={n} value={n}>
//                       {n}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <FormControl size="small" sx={{ minWidth: 120 }}>
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                   label="Status"
//                   value={statusFilter}
//                   onChange={(e) =>
//                     setStatusFilter(e.target.value as LogRow["status"] | "All")
//                   }
//                 >
//                   {["All", "issued", "returned", "overdue", "lost"].map((s) => (
//                     <MenuItem key={s} value={s}>
//                       {s}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Box>
//           </Box>

//           <Divider sx={{ mb: 0.5, borderColor: tt.border }} />

//           {/* Table */}
//           <TableContainer
//             sx={{
//               flex: 1,
//               overflow: "auto",
//               "&::-webkit-scrollbar": { width: 8, height: 8 },
//               "&::-webkit-scrollbar-thumb": {
//                 background: tt.scrollThumb,
//                 borderRadius: 4,
//               },
//             }}
//           >
//             <Table stickyHeader sx={{ tableLayout: "fixed", width: "100%" }}>
//               <TableHead>
//                 <TableRow>
//                   {[
//                     "Sr No",
//                     "Item Name",
//                     "Serial No",
//                     "Category",
//                     "Assign To",
//                     "Status",
//                     "Qty",
//                     "Change Summary",
//                     "Assign Date",
//                     "Return By",
//                     "Return Date",
//                     "Created At",
//                   ].map((col, i) => (
//                     <TableCell
//                       key={col}
//                       sx={{
//                         color: tt.headText,
//                         backgroundColor: tt.headBg,
//                         borderBottom: `1px solid ${tt.border}`,
//                         fontSize: 12,
//                         lineHeight: 1.2,
//                         whiteSpace: "nowrap",
//                         padding: "6px 10px",
//                         textAlign: "center",
//                       }}
//                     >
//                       {col}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {loading ? (
//                   <TableRow>
//                     <TableCell colSpan={12} align="center" sx={{ py: 3 }}>
//                       Loading…
//                     </TableCell>
//                   </TableRow>
//                 ) : logs.length ? (
//                   logs.map((r, idx) => (
//                     <TableRow key={r.id} hover>
//                       {[
//                         (page - 1) * rowsPerPage + idx + 1,
//                         r.item_name,
//                         r.serial_no || "—",
//                         r.category || "—",
//                         r.assign_to || "—",
//                         r.status,
//                         r.qty ?? "—",
//                         r.remarks ?? "—",
//                         fmtDMY(r.assign_date),
//                         fmtDMY(r.return_by),
//                         fmtDMY(r.return_date),
//                         fmtDMY(r.created_at),
//                       ].map((cell, j) => (
//                         <TableCell
//                           key={j}
//                           sx={{
//                             color:
//                               j === 5
//                                 ? r.status === "returned"
//                                   ? tt.statusReturned
//                                   : r.status === "overdue"
//                                   ? tt.statusOverdue
//                                   : r.status === "lost"
//                                   ? tt.statusLost
//                                   : tt.statusIssued
//                                 : tt.bodyText,
//                             backgroundColor: tt.rowBg,
//                             borderBottom: `1px solid ${tt.border}`,
//                             fontSize: 12,
//                             textAlign: "center",
//                             whiteSpace: "nowrap",
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                           }}
//                         >
//                           {cell}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell
//                       colSpan={12}
//                       align="center"
//                       sx={{ color: "text.secondary", py: 3 }}
//                     >
//                       No records found
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           {/* Pagination */}
//           <Box
//             sx={{
//               mt: 0.75,
//               display: "flex",
//               alignItems: "center",
//               flexWrap: "wrap",
//               gap: 1,
//             }}
//           >
//             <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
//               <Typography variant="body2" sx={{ color: "text.secondary" }}>
//                 Rows:
//               </Typography>
//               <FormControl size="small">
//                 <Select
//                   value={rowsPerPage}
//                   onChange={(e) =>
//                     setRowsPerPage(e.target.value as 10 | 20 | 50)
//                   }
//                   sx={{
//                     height: 32,
//                     "& .MuiSelect-select": { py: 0.25, minWidth: 52 },
//                   }}
//                 >
//                   {[10, 20, 50].map((n) => (
//                     <MenuItem key={n} value={n}>
//                       {n}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Box>

//             <Box sx={{ ml: "auto" }}>
//               <Pagination
//                 count={pageCount}
//                 page={page}
//                 onChange={(_, v) => setPage(v)}
//                 size="small"
//                 shape="rounded"
//                 siblingCount={1}
//                 boundaryCount={1}
//                 sx={{
//                   "& .MuiPaginationItem-root": {
//                     color: theme.palette.text.primary,
//                     minWidth: 28,
//                     height: 28,
//                   },
//                   "& .Mui-selected": {
//                     bgcolor: tt.pageSelectedBg,
//                     color: tt.pageSelectedText,
//                     "&:hover": { bgcolor: tt.pageSelectedBg },
//                   },
//                 }}
//               />
//             </Box>
//           </Box>
//         </Paper>
//       </Box>
//     </Box>
//   );
// }


//pp/
import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import axios from "axios";

/* ========= API base ========= */
const API_BASE: string =
  (import.meta as any)?.env?.VITE_API_BASE ?? "http://3.110.216.196/api";
const api = axios.create({ baseURL: API_BASE });

/* ========= types ========= */
type LogRow = {
  id: number;
  item_name: string;
  serial_no: string | null;
  category: string | null;
  assigned_pm: string | null;
  project: string | null;
  assign_to: string | null;
  assign_date: string | null;
  return_by: string | null;
  return_date: string | null;
  status: "issued" | "returned" | "overdue" | "lost";
  remarks: string | null;
  tool_id?: number | null;
  qty?: number | null;
  created_at?: string | null;
};

/* ========= theme tokens ========= */
const tableTokens = (t: Theme) => {
  const dark = t.palette.mode === "dark";
  return {
    headBg: dark ? "#0F0F0F" : "#F5F5F7",
    rowBg: dark ? "#1C1C1E" : "#FFFFFF",
    border: dark ? "#333" : "#E5E7EB",
    headText: dark ? "#FFFFFF" : "#111827",
    bodyText: dark ? "#E0E0E0" : "#111827",
    scrollThumb: dark ? "#333" : "#CFCFCF",
    statusIssued: "#78B83B",
    statusReturned: "#22C55E",
    statusOverdue: "#EA9A00",
    statusLost: "#EF4444",
    pageSelectedBg: "#78B83B",
    pageSelectedText: "#0F0F0F",
  };
};

/* ========= utils ========= */
const fmtDMY = (v?: string | null) => {
  if (!v) return "—";
  const iso = v.slice(0, 10);
  const [y, m, d] = iso.split("-");
  if (y && m && d) return `${d}/${m}/${y}`;
  const dt = new Date(v);
  if (isNaN(dt.getTime())) return "—";
  return `${String(dt.getDate()).padStart(2, "0")}/${String(
    dt.getMonth() + 1
  ).padStart(2, "0")}/${dt.getFullYear()}`;
};

const pickArray = (p: any) => {
  if (Array.isArray(p)) return p;
  if (Array.isArray(p?.rows)) return p.rows;
  if (Array.isArray(p?.items)) return p.items;
  if (Array.isArray(p?.data)) return p.data;
  return [];
};

/* ========= component ========= */
export default function Logs() {
  const theme = useTheme();
  const tt = tableTokens(theme);

  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(false);

  // filters
  const [itemFilter, setItemFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<LogRow["status"] | "All">(
    "All"
  );

  // pagination
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<10 | 20 | 50>(50);

  useEffect(() => {
    setPage(1);
  }, [itemFilter, statusFilter, rowsPerPage]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const params: any = { page, pageSize: rowsPerPage };
      if (statusFilter !== "All") params.status = statusFilter;
      if (itemFilter !== "All") params.q = itemFilter;

      const { data } = await api.get("/logs", { params });
      const rows = pickArray(data);
      setLogs(rows);
      if (data.total && data.pageSize)
        setPageCount(Math.ceil(data.total / data.pageSize));
      else setPageCount(1);
    } catch (e) {
      console.error("Failed to load logs:", e);
      setLogs([]);
      setPageCount(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, itemFilter, statusFilter]);

  // unique item list
  const itemNames = useMemo(() => {
    const s = new Set<string>();
    logs.forEach((l) => l.item_name && s.add(l.item_name));
    return ["All", ...Array.from(s).sort()];
  }, [logs]);

  return (
    <Box>
      <Box sx={{ mx: { xs: -1.5, md: -1.5 } }}>
        <Paper
          variant="outlined"
          sx={{
            mx: 0,
            px: 1,
            py: 0.75,
            height: { xs: "auto", md: "calc(100vh - 80px)" },
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: 0.5,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              mb: 0.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Logs / Change History
            </Typography>

            <Box sx={{ display: "flex", gap: 1, ml: "auto", flexWrap: "wrap" }}>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Item Name</InputLabel>
                <Select
                  label="Item Name"
                  value={itemFilter}
                  onChange={(e) => setItemFilter(e.target.value as string)}
                >
                  {itemNames.map((n) => (
                    <MenuItem key={n} value={n}>
                      {n}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as LogRow["status"] | "All")
                  }
                >
                  {["All", "issued", "returned", "overdue", "lost"].map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Divider sx={{ mb: 0.5, borderColor: tt.border }} />

          {/* Table */}
          <TableContainer
            sx={{
              flex: 1,
              overflowX: "auto",
              overflowY: "auto",
              "&::-webkit-scrollbar": { width: 8, height: 8 },
              "&::-webkit-scrollbar-thumb": {
                background: tt.scrollThumb,
                borderRadius: 4,
              },
            }}
          >
            <Table stickyHeader sx={{ tableLayout: "fixed", width: "100%", minWidth: 1600 }}>
              <TableHead>
                <TableRow>
                  {[
                    { label: "Sr No", width: 70 },
                    { label: "Item Name", width: 140 },
                    { label: "Serial No", width: 120 },
                    { label: "Category", width: 130 },
                    { label: "Assign To", width: 130 },
                    { label: "Status", width: 100 },
                    { label: "Qty", width: 80 },
                    { label: "Change Summary", width: 160 },
                    { label: "Assign Date", width: 130 },
                    { label: "Return By", width: 130 },
                    { label: "Return Date", width: 130 },
                    { label: "Created At", width: 130 },
                  ].map((col, i, arr) => (
                    <TableCell
                      key={col.label}
                      sx={{
                        color: tt.headText,
                        backgroundColor: tt.headBg,
                        borderBottom: `1px solid ${tt.border}`,
                        fontSize: 12,
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        padding: "6px 10px",
                        textAlign: "center",
                        width: col.width,
                        minWidth: col.width,
                        maxWidth: col.width,
                        borderTopLeftRadius: i === 0 ? 6 : 0,
                        borderTopRightRadius: i === arr.length - 1 ? 6 : 0,
                      }}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ py: 3 }}>
                      Loading…
                    </TableCell>
                  </TableRow>
                ) : logs.length ? (
                  logs.map((r, idx) => {
                    const columns = [
                      { value: (page - 1) * rowsPerPage + idx + 1, width: 70 },
                      { value: r.item_name, width: 140 },
                      { value: r.serial_no || "—", width: 120 },
                      { value: r.category || "—", width: 130 },
                      { value: r.assign_to || "—", width: 130 },
                      { value: r.status, width: 100 },
                      { value: r.qty ?? "—", width: 80 },
                      { value: r.remarks ?? "—", width: 160 },
                      { value: fmtDMY(r.assign_date), width: 130 },
                      { value: fmtDMY(r.return_by), width: 130 },
                      { value: fmtDMY(r.return_date), width: 130 },
                      { value: fmtDMY(r.created_at), width: 130 },
                    ];

                    return (
                      <TableRow key={r.id} hover>
                        {columns.map((col, j) => (
                          <TableCell
                            key={j}
                            sx={{
                              color:
                                j === 5
                                  ? r.status === "returned"
                                    ? tt.statusReturned
                                    : r.status === "overdue"
                                    ? tt.statusOverdue
                                    : r.status === "lost"
                                    ? tt.statusLost
                                    : tt.statusIssued
                                  : tt.bodyText,
                              backgroundColor: tt.rowBg,
                              borderBottom: `1px solid ${tt.border}`,
                              fontSize: 12,
                              textAlign: "center",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              padding: "7px 10px",
                              width: col.width,
                              minWidth: col.width,
                              maxWidth: col.width,
                            }}
                          >
                            {col.value}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={12}
                      align="center"
                      sx={{ color: "text.secondary", py: 3 }}
                    >
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box
            sx={{
              mt: 0.75,
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Rows:
              </Typography>
              <FormControl size="small">
                <Select
                  value={rowsPerPage}
                  onChange={(e) =>
                    setRowsPerPage(e.target.value as 10 | 20 | 50)
                  }
                  sx={{
                    height: 32,
                    "& .MuiSelect-select": { py: 0.25, minWidth: 52 },
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
                  "& .MuiPaginationItem-root": {
                    color: theme.palette.text.primary,
                    minWidth: 28,
                    height: 28,
                  },
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
    </Box>
  );
}