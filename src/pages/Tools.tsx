
// import {
//   Alert,
//   Box,
//   Button,
//   Divider,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Modal,
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
//   Snackbar,
// } from "@mui/material";
// import { useEffect, useMemo, useState } from "react";
// import { useTheme } from "@mui/material/styles";
// import type { Theme } from "@mui/material/styles";
// import axios from "axios";
// import { API_BASE } from "../config";

// /* =================== UI tokens =================== */
// const BRAND_GREEN = "#78B83B";
// const CATEGORIES = ["Power Tool", "Laptop", "Network", "Measurement", "Accessory", "Other"] as const;

// const tableTokens = (t: Theme) => {
//   const dark = t.palette.mode === "dark";
//   return {
//     headBg: dark ? "#0F0F0F" : "#F5F5F7",
//     rowBg: dark ? "#1C1C1E" : "#FFFFFF",
//     border: dark ? "#333" : "#E5E7EB",
//     headText: dark ? "#FFFFFF" : "#111827",
//     bodyText: dark ? "#E0E0E0" : "#111827",
//     scrollThumb: dark ? "#333" : "#CFCFCF",
//     pageSelectedBg: "#78B83B",
//     pageSelectedText: "#0F0F0F",
//   };
// };

// const UI = {
//   card: {
//     sx: {
//       mx: { xs: 0, md: 0 },
//       px: { xs: 1, md: 1 },
//       py: { xs: 0.75, md: 0.75 },
//       height: { xs: "auto", md: "calc(100vh - 115px)" },
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
//       justifyContent: "flex-end",
//       alignItems: "center",
//       flexWrap: "wrap" as const,
//       gap: { xs: 1, sm: 1.25 },
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
//     sx: {
//       tableLayout: "fixed" as const,
//       width: "100%",
//     },
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
//     bodyCell: (tt: ReturnType<typeof tableTokens>) => ({
//       color: tt.bodyText,
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

// /* =================== Types =================== */
// type Tool = {
//   id: number;
//   item_name: string;
//   make: string | null;
//   model: string | null;
//   description: string | null;
//   serial_no: string;
//   category: string | null;
//   location: string | null;
//   purchase_date: string | null; // yyyy-mm-dd
// };

// type ToolForm = {
//   item_name: string;
//   make: string;
//   model: string;
//   description: string;
//   serial_no: string;
//   category: (typeof CATEGORIES)[number] | "";
//   location: string;
//   purchase_date: string; // yyyy-mm-dd
// };

// const normalizeTool = (t: any): Tool => ({
//   id: Number(t.id ?? t.tool_id ?? 0),
//   item_name: t.item_name ?? t.name ?? "",
//   make: t.make ?? null,
//   model: t.model ?? null,
//   description: t.description ?? null,
//   serial_no: t.serial_no ?? t.serial ?? "",
//   category: t.category ?? null,
//   location: t.location ?? null,
//   purchase_date: t.purchase_date ?? null,
// });

// const api = axios.create({ baseURL: API_BASE });

// /* =================== Update Modal =================== */
// function UpdateToolModal({
//   open,
//   onClose,
//   tool,
//   onSaved,
//   onDeleted,
//   setErrorMsg,
//   setSuccessMsg,
// }: {
//   open: boolean;
//   onClose: () => void;
//   tool: Tool | null;
//   onSaved: () => void;
//   onDeleted: () => void;
//   setErrorMsg: (m: string | null) => void;
//   setSuccessMsg: (m: string | null) => void;
// }) {
//   const [form, setForm] = useState<ToolForm>({
//     item_name: tool?.item_name ?? "",
//     make: tool?.make ?? "",
//     model: tool?.model ?? "",
//     description: tool?.description ?? "",
//     serial_no: tool?.serial_no ?? "",
//     category: ((tool?.category as ToolForm["category"]) ?? "") as any,
//     location: tool?.location ?? "",
//     purchase_date: tool?.purchase_date ?? "",
//   });

//   useEffect(() => {
//     setForm({
//       item_name: tool?.item_name ?? "",
//       make: tool?.make ?? "",
//       model: tool?.model ?? "",
//       description: tool?.description ?? "",
//       serial_no: tool?.serial_no ?? "",
//       category: ((tool?.category as ToolForm["category"]) ?? "") as any,
//       location: tool?.location ?? "",
//       purchase_date: tool?.purchase_date ?? "",
//     });
//   }, [tool]);

//   const setField =
//     (k: keyof ToolForm) =>
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       setForm((f) => ({ ...f, [k]: e.target.value }));
//     };

//   // const handleSave = async () => {
//   //   if (!tool) return;
//   //   try {
//   //     const payload = {
//   //       item_name: form.item_name,
//   //       make: form.make || null,
//   //       model: form.model || null,
//   //       description: form.description || null,
//   //       serial_no: form.serial_no, // usually read-only, but backend allows update
//   //       category: form.category || null,
//   //       location: form.location || null,
//   //       purchase_date: form.purchase_date || null,
//   //     };
//   //     // await api.put(`/tools/${tool.id}`, payload);
//   //     // await api.patch(`/tools/${tool.id}`, payload);
//   //      const cleanId = String(tool?.id ?? "").match(/^\d+/)?.[0] ?? tool?.id;
//   //      await api.patch(`/tools/${cleanId}`, payload);

//   //     setSuccessMsg("Tool updated");
//   //     onSaved();
//   //     onClose();
//   //   } catch (err: any) {
//   //     setErrorMsg(err?.response?.data?.error || "Failed to update tool");
//   //   }
//   // };

//   const handleSave = async () => {
//   if (!tool) return;
//   try {
//     const payload = {
//       item_name: form.item_name,
//       make: form.make || null,
//       model: form.model || null,
//       description: form.description || null,
//       serial_no: form.serial_no,
//       category: form.category || null,
//       location: form.location || null,
//       purchase_date: form.purchase_date || null,
//     };
//     const cleanId = String(tool.id ?? "").match(/^\d+/)?.[0] ?? tool.id;
//     await api.patch(`/tools/${cleanId}`, payload);   // PATCH instead of PUT
//     setSuccessMsg("Tool updated");
//     onSaved();
//     onClose();
//   } catch (err: any) {
//     setErrorMsg(err?.response?.data?.error || "Failed to update tool");
//   }
// };

//   // const handleDelete = async () => {
//   //   if (!tool) return;
//   //   const ok = window.confirm("Delete this tool permanently?");
//   //   if (!ok) return;
//   //   try {
//   //     // await api.delete(`/tools/${tool.id}`);
//   //      const cleanId = String(tool?.id ?? "").match(/^\d+/)?.[0] ?? tool?.id;
//   //     await api.delete(`/tools/${cleanId}`);
//   //     setSuccessMsg("Tool deleted");
//   //     onDeleted();
//   //     onClose();
//   //   } catch (err: any) {
//   //     setErrorMsg(err?.response?.data?.error || "Failed to delete tool");
//   //   }
//   // };


//   const handleDelete = async () => {
//   if (!tool) return;
//   const ok = window.confirm("Delete this tool permanently?");
//   if (!ok) return;
//   try {
//     const cleanId = String(tool.id ?? "").match(/^\d+/)?.[0] ?? tool.id;
//     await api.delete(`/tools/${cleanId}`);
//     setSuccessMsg("Tool deleted");
//     onDeleted();
//     onClose();
//   } catch (err: any) {
//     setErrorMsg(err?.response?.data?.error || "Failed to delete tool");
//   }
// };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: 820,
//           bgcolor: "#1C1C1E",
//           color: "#fff",
//           borderRadius: 1,
//           p: 3,
//           boxShadow: 24,
//           outline: "none",
//         }}
//       >
//         <Typography variant="h6" gutterBottom>
//           Update Tool
//         </Typography>

//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr",
//             gap: 2,
//             mb: 3,
//           }}
//         >
//           <TextField
//             label="Item Name"
//             size="small"
//             value={form.item_name}
//             onChange={setField("item_name")}
//             InputLabelProps={{ sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//           />
//           {/* <TextField
//             label="Serial No"
//             size="small"
//             value={form.serial_no}
//             onChange={setField("serial_no")}
//             InputLabelProps={{ sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//           /> */}

//           <TextField
//           label="Serial No"
//           size="small"
//           value={form.serial_no}

//           InputLabelProps={{ sx: { color: "#aaa" } }}

//         InputProps={{ readOnly: true }}
//         sx={{ bgcolor: "#28282B", input: { color: "#fff", cursor: "not-allowed" } }}
//         />
//           <TextField
//             label="Make"
//             size="small"
//             value={form.make}
//             onChange={setField("make")}
//             InputLabelProps={{ sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//           />
//           <TextField
//             label="Model"
//             size="small"
//             value={form.model}
//             onChange={setField("model")}
//             InputLabelProps={{ sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//           />
//           <TextField
//             label="Category"
//             select
//             size="small"
//             value={form.category}
//             // onChange={setField("category")}
//             onChange={(e) => setForm(f => ({ ...f, category: e.target.value as ToolForm["category"] }))}
//             InputLabelProps={{ sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", "& .MuiSelect-select": { color: "#fff" } }}
//             SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: "background.paper" } } } }}
//           >
//             {CATEGORIES.map((c) => (
//               <MenuItem key={c} value={c}>
//                 {c}
//               </MenuItem>
//             ))}
//           </TextField>
//           <TextField
//             label="Location"
//             size="small"
//             value={form.location}
//             onChange={setField("location")}
//             InputLabelProps={{ sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//           />
//           <TextField
//             label="Purchase Date"
//             type="date"
//             size="small"
//             value={form.purchase_date || ""}
//             onChange={setField("purchase_date")}
//             InputLabelProps={{ shrink: true, sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//           />
//           <TextField
//             label="Description"
//             size="small"
//             value={form.description}
//             onChange={setField("description")}
//             InputLabelProps={{ sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//           />
//         </Box>

//         <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//           <Button
//             variant="outlined"
//             onClick={handleDelete}
//             sx={{
//               color: "#EF4444",
//               borderColor: "#EF4444",
//               "&:hover": { backgroundColor: "rgba(239,68,68,0.1)" },
//             }}
//           >
//             Delete
//           </Button>

//           <Box>
//             <Button onClick={onClose} sx={{ mr: 1, color: "#aaa" }}>
//               Cancel
//             </Button>
//             <Button
//               variant="contained"
//               onClick={handleSave}
//               sx={{ bgcolor: "#22C55E", "&:hover": { bgcolor: "#16A34A" } }}
//             >
//               Save
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//     </Modal>
//   );
// }

// /* =================== Main Page =================== */
// export default function Tools() {
//   const theme = useTheme();
//   const tt = tableTokens(theme);

//   const [view, setView] = useState<"list" | "add">("list");
//   const [tools, setTools] = useState<Tool[]>([]);
//   const [loading, setLoading] = useState(false);

//   // pagination
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState<10 | 20 | 50>(50);

//   // filters
//   const [categoryFilter, setCategoryFilter] = useState<"All" | (typeof CATEGORIES)[number]>("All");

//   // add form state
//   const initial: ToolForm = {
//     item_name: "",
//     make: "",
//     model: "",
//     description: "",
//     serial_no: "",
//     category: "",
//     location: "",
//     purchase_date: "",
//   };
//   const [form, setForm] = useState<ToolForm>(initial);
//   const [submitting, setSubmitting] = useState(false);
//   const [successMsg, setSuccessMsg] = useState<string | null>(null);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);

//   // update modal
//   const [editOpen, setEditOpen] = useState(false);
//   const [selected, setSelected] = useState<Tool | null>(null);

//   const fieldSx = { flex: "1 1 320px", minWidth: 0 };
//   const updateField =
//     (k: keyof ToolForm) =>
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       setForm((f) => ({ ...f, [k]: e.target.value }));
//     };

//   const canSubmit =
//     !!form.item_name && !!form.serial_no && !!form.category;

//   const loadTools = async () => {
//     setLoading(true);
//     try {
//       const { data } = await api.get("/tools");
//       const arr =
//         Array.isArray(data?.rows) ? data.rows :
//         Array.isArray(data?.items) ? data.items :
//         Array.isArray(data?.data) ? data.data :
//         Array.isArray(data) ? data : [];
//       setTools(arr.map(normalizeTool));
//     } catch {
//       setTools([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadTools();
//   }, []);

//   // filter + paginate
//   const filtered = useMemo(
//     () => tools.filter((t) => categoryFilter === "All" || t.category === categoryFilter),
//     [tools, categoryFilter]
//   );

//   const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
//   const paginated = useMemo(
//     () => filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage),
//     [filtered, page, rowsPerPage]
//   );

//   useEffect(() => setPage(1), [categoryFilter, rowsPerPage]);

//   const clearAddForm = () => setForm(initial);

//   const handleAdd = async () => {
//     if (!canSubmit || submitting) return;
//     setSubmitting(true);
//     setErrorMsg(null);
//     try {
//       const payload = {
//         item_name: form.item_name,
//         make: form.make || null,
//         model: form.model || null,
//         description: form.description || null,
//         serial_no: form.serial_no,
//         category: form.category || null,
//         location: form.location || null,
//         purchase_date: form.purchase_date || null,
//       };
//       await api.post("/tools", payload);
//       setSuccessMsg("Tool added successfully");
//       clearAddForm();
//       setView("list");
//       await loadTools();
//     } catch (err: any) {
//       setErrorMsg(err?.response?.data?.error || "Failed to add tool");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const openEdit = (t: Tool) => {
//     setSelected(t);
//     setEditOpen(true);
//   };

//   const onSaved = async () => {
//     await loadTools();
//   };

//   const onDeleted = async () => {
//     await loadTools();
//   };

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
//                 bgcolor:
//                   theme.palette.mode === "dark" ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.14)",
//               },
//             },
//             "&:hover": { backgroundColor: "action.hover" },
//           },
//         }}
//       >
//         <ToggleButton value="list">All Tools</ToggleButton>
//         <ToggleButton value="add">Add New Tool</ToggleButton>
//       </ToggleButtonGroup>

//       {/* LIST VIEW */}
//       {view === "list" && (
//         <Box sx={{ mx: { xs: -1.5, md: -1.5 } }}>
//           <Paper variant="outlined" sx={UI.card.sx}>
//             <Box sx={UI.headerRow.sx}>
//               <FormControl size={UI.selectSm.size} sx={UI.selectSm.sx}>
//                 <InputLabel>Category</InputLabel>
//                 <Select
//                   label="Category"
//                   value={categoryFilter}
//                   onChange={(e) => setCategoryFilter(e.target.value as any)}
//                   MenuProps={UI.selectSm.menu}
//                 >
//                   {(["All", ...CATEGORIES] as const).map((c) => (
//                     <MenuItem key={c} value={c}>
//                       {c}
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
//                       "Make",
//                       "Model",
//                       "Description",
//                       "Serial No",
//                       "Category",
//                       "Location",
//                       "Purchase Date",
//                       "Action",
//                     ].map((h, i, arr) => (
//                       <TableCell
//                         key={h}
//                         sx={{
//                           ...UI.table.headCell(tt),
//                           borderTopLeftRadius: i === 0 ? 6 : 0,
//                           borderTopRightRadius: i === arr.length - 1 ? 6 : 0,
//                         }}
//                       >
//                         {h}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {loading ? (
//                     <TableRow>
//                       <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
//                         Loading…
//                       </TableCell>
//                     </TableRow>
//                   ) : paginated.length ? (
//                     paginated.map((t, idx) => (
//                       <TableRow key={t.id} hover>
//                         {[
//                           (page - 1) * rowsPerPage + idx + 1,
//                           t.item_name,
//                           t.make || "—",
//                           t.model || "—",
//                           t.description || "—",
//                           t.serial_no,
//                           t.category || "—",
//                           t.location || "—",
//                           t.purchase_date || "—",
//                           "__ACTION__",
//                         ].map((cell, j) => (
//                           <TableCell key={j} sx={UI.table.bodyCell(tt)}>
//                             {cell === "__ACTION__" ? (
//                               <Button
//                                 size="small"
//                                 variant="contained"
//                                 sx={{
//                                   textTransform: "none",
//                                   fontSize: 12,
//                                   px: 1.25,
//                                   py: 0.25,
//                                   minWidth: 70,
//                                   bgcolor: "#FFC000",
//                                   color: "#000",
//                                   "&:hover": { bgcolor: "#D4A420" },
//                                 }}
//                                 onClick={() => openEdit(t)}
//                               >
//                                 Update
//                               </Button>
//                             ) : (
//                               cell
//                             )}
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={10} align="center" sx={{ color: "text.secondary", py: 3 }}>
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
//                     "& .MuiPaginationItem-root": {
//                       color: theme.palette.text.primary,
//                       minWidth: 28,
//                       height: 28,
//                     },
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

//       {/* ADD VIEW */}
//       {view === "add" && (
//         <Paper variant="outlined" sx={{ mx: { xs: 1, sm: 0 }, p: { xs: 1.5, sm: 2 }, borderRadius: 1 }}>
//           <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
//             <Box>
//               <Typography variant="h6" sx={{ fontWeight: 700 }}>
//                 Tools &amp; Equipment
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Add a new tool or equipment item.
//               </Typography>
//             </Box>

//             <Button variant="outlined" onClick={() => setForm(initial)} sx={{ borderRadius: 1, textTransform: "none" }}>
//               Clear
//             </Button>
//           </Stack>

//           <Divider sx={{ mb: 2 }} />

//           <Stack spacing={2}>
//             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
//               <TextField label="Item Name *" value={form.item_name} onChange={updateField("item_name")} sx={fieldSx} />
//               <TextField label="Serial No *" value={form.serial_no} onChange={updateField("serial_no")} sx={fieldSx} />
//               <TextField label="Make" value={form.make} onChange={updateField("make")} sx={fieldSx} />
//               <TextField label="Model" value={form.model} onChange={updateField("model")} sx={fieldSx} />
//             </Box>

//             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
//               <TextField
//                 select
//                 label="Category"
//                 value={form.category}
//                 onChange={updateField("category")}
//                 sx={{
//                   ...fieldSx,
//                   height: 56,
//                   "& .MuiSelect-select": { height: 56, display: "flex", alignItems: "center" },
//                 }}
//                 SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: "background.paper" } } } }}
//               >
//                 {CATEGORIES.map((c) => (
//                   <MenuItem key={c} value={c}>
//                     {c}
//                   </MenuItem>
//                 ))}
//               </TextField>
//               <TextField label="Location" value={form.location} onChange={updateField("location")} sx={fieldSx} />
//               <TextField
//                 label="Purchase Date"
//                 type="date"
//                 value={form.purchase_date}
//                 onChange={updateField("purchase_date")}
//                 InputLabelProps={{ shrink: true }}
//                 sx={fieldSx}
//               />
//             </Box>

//             <TextField
//               label="Description"
//               value={form.description}
//               onChange={updateField("description")}
//               sx={{
//                 width: "100%",
//                 "& .MuiInputBase-root": { height: 56 },
//                 "& .MuiInputBase-input": {
//                   height: 56,
//                   display: "flex",
//                   alignItems: "center",
//                   boxSizing: "border-box",
//                   padding: "0 14px",
//                 },
//               }}
//             />

//             <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//               <Button
//                 variant="contained"
//                 disabled={!canSubmit || submitting}
//                 sx={{
//                   minWidth: 140,
//                   borderRadius: 1,
//                   textTransform: "none",
//                   bgcolor: BRAND_GREEN,
//                   color: "#0F0F0F",
//                   "&:hover": { bgcolor: "#6EAD35" },
//                   "&.Mui-disabled": {
//                     bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
//                     color: "text.disabled",
//                   },
//                 }}
//                 onClick={async () => {
//                   await handleAdd();
//                 }}
//               >
//                 {submitting ? "Adding..." : "Add Item"}
//               </Button>
//             </Box>
//           </Stack>
//         </Paper>
//       )}

//       {/* Update Modal */}
//       <UpdateToolModal
//         open={editOpen}
//         onClose={() => setEditOpen(false)}
//         tool={selected}
//         onSaved={onSaved}
//         onDeleted={onDeleted}
//         setErrorMsg={setErrorMsg}
//         setSuccessMsg={setSuccessMsg}
//       />

//       {/* Toasts */}
//       <Snackbar
//         open={!!successMsg}
//         autoHideDuration={2500}
//         onClose={() => setSuccessMsg(null)}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert onClose={() => setSuccessMsg(null)} severity="success" variant="filled" sx={{ width: "100%" }}>
//           {successMsg}
//         </Alert>
//       </Snackbar>

//       <Snackbar
//         open={!!errorMsg}
//         autoHideDuration={4000}
//         onClose={() => setErrorMsg(null)}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert onClose={() => setErrorMsg(null)} severity="error" variant="filled" sx={{ width: "100%" }}>
//           {errorMsg}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }


import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
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
  Snackbar,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import axios from "axios";
import { API_BASE } from "../config";

/* =================== utils =================== */
// Convert anything date-ish to YYYY-MM-DD for <input type="date">
const toISODate = (v?: string | null): string => {
  if (!v) return "";
  // accept Date.toString/ISO/timestampish → normalize
  const s = String(v);
  // "2025-11-06" already good
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  const d = new Date(s);
  if (Number.isFinite(d.getTime())) {
    const y = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  }
  return "";
};

// Display helper: YYYY-MM-DD → DD-MM-YYYY
const isoToDMY = (v?: string | null): string => {
  const s = toISODate(v);
  if (!s) return "—";
  const [y, m, d] = s.split("-");
  return `${d}-${m}-${y}`;
};

/* =================== UI tokens =================== */
const BRAND_GREEN = "#78B83B";
const CATEGORIES = ["Power Tool", "Laptop", "Network", "Measurement", "Accessory", "Other"] as const;

const tableTokens = (t: Theme) => {
  const dark = t.palette.mode === "dark";
  return {
    headBg: dark ? "#0F0F0F" : "#F5F5F7",
    rowBg: dark ? "#1C1C1E" : "#FFFFFF",
    border: dark ? "#333" : "#E5E7EB",
    headText: dark ? "#FFFFFF" : "#111827",
    bodyText: dark ? "#E0E0E0" : "#111827",
    scrollThumb: dark ? "#333" : "#CFCFCF",
    pageSelectedBg: "#78B83B",
    pageSelectedText: "#0F0F0F",
  };
};

const UI = {
  card: {
    sx: {
      mx: { xs: 0, md: 0 },
      px: { xs: 1, md: 1 },
      py: { xs: 0.75, md: 0.75 },
      height: { xs: "auto", md: "calc(100vh - 115px)" },
      display: "flex",
      flexDirection: "column" as const,
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
      flexWrap: "wrap" as const,
      gap: { xs: 1, sm: 1.25 },
    },
  },
  selectSm: {
    size: "small" as const,
    sx: {
      minWidth: { xs: 120, sm: 140 },
      "& .MuiInputBase-root": { height: 28 },
      "& .MuiSelect-select": { py: 0.25, px: 1 },
    },
    menu: { PaperProps: { sx: { bgcolor: "background.paper" } } },
  },
  table: {
    sx: { tableLayout: "fixed" as const, width: "100%" },
    headCell: (tt: ReturnType<typeof tableTokens>) => ({
      color: tt.headText,
      backgroundColor: tt.headBg,
      borderBottom: `1px solid ${tt.border}`,
      fontSize: 12,
      lineHeight: 1.2,
      whiteSpace: "nowrap" as const,
      padding: "6px 10px",
      textAlign: "center" as const,
    }),
    bodyCell: (tt: ReturnType<typeof tableTokens>) => ({
      color: tt.bodyText,
      backgroundColor: tt.rowBg,
      borderBottom: `1px solid ${tt.border}`,
      fontSize: 12,
      lineHeight: 1.2,
      whiteSpace: "nowrap" as const,
      textOverflow: "ellipsis" as const,
      overflow: "hidden" as const,
      padding: "7px 10px",
      textAlign: "center" as const,
      verticalAlign: "middle" as const,
    }),
  },
};

/* =================== Types =================== */
type Tool = {
  id: number;
  item_name: string;
  make: string | null;
  model: string | null;
  description: string | null;
  serial_no: string;
  category: string | null;
  location: string | null;
  purchase_date: string | null; // normalized to yyyy-mm-dd in normalizeTool
};

type ToolForm = {
  item_name: string;
  make: string;
  model: string;
  description: string;
  serial_no: string;
  category: (typeof CATEGORIES)[number] | "";
  location: string;
  purchase_date: string; // yyyy-mm-dd
};

const normalizeTool = (t: any): Tool => ({
  id: Number(t.id ?? t.tool_id ?? 0),
  item_name: t.item_name ?? t.name ?? "",
  make: t.make ?? null,
  model: t.model ?? null,
  description: t.description ?? null,
  serial_no: t.serial_no ?? t.serial ?? "",
  category: t.category ?? null,
  location: t.location ?? null,
  purchase_date: toISODate(t.purchase_date ?? null) || null, // ensure YYYY-MM-DD
});

const api = axios.create({ baseURL: API_BASE });

/* =================== Update Modal =================== */
function UpdateToolModal({
  open,
  onClose,
  tool,
  onSaved,
  onDeleted,
  setErrorMsg,
  setSuccessMsg,
}: {
  open: boolean;
  onClose: () => void;
  tool: Tool | null;
  onSaved: () => void;
  onDeleted: () => void;
  setErrorMsg: (m: string | null) => void;
  setSuccessMsg: (m: string | null) => void;
}) {
  const [form, setForm] = useState<ToolForm>({
    item_name: tool?.item_name ?? "",
    make: tool?.make ?? "",
    model: tool?.model ?? "",
    description: tool?.description ?? "",
    serial_no: tool?.serial_no ?? "",
    category: ((tool?.category as ToolForm["category"]) ?? "") as any,
    location: tool?.location ?? "",
    purchase_date: toISODate(tool?.purchase_date ?? null), // auto-fill
  });

  useEffect(() => {
    setForm({
      item_name: tool?.item_name ?? "",
      make: tool?.make ?? "",
      model: tool?.model ?? "",
      description: tool?.description ?? "",
      serial_no: tool?.serial_no ?? "",
      category: ((tool?.category as ToolForm["category"]) ?? "") as any,
      location: tool?.location ?? "",
      purchase_date: toISODate(tool?.purchase_date ?? null),
    });
  }, [tool]);

  const setField =
    (k: keyof ToolForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
    };

  const handleSave = async () => {
    if (!tool) return;
    try {
      const payload = {
        item_name: form.item_name,
        make: form.make || null,
        model: form.model || null,
        description: form.description || null,
        serial_no: form.serial_no, // read-only in UI but allowed by API
        category: form.category || null,
        location: form.location || null,
        purchase_date: form.purchase_date || null, // must be yyyy-mm-dd
      };
      const cleanId = String(tool.id ?? "").match(/^\d+/)?.[0] ?? tool.id;
      await api.patch(`/tools/${cleanId}`, payload);
      setSuccessMsg("Tool updated");
      onSaved();
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error || "Failed to update tool");
    }
  };

  const handleDelete = async () => {
    if (!tool) return;
    const ok = window.confirm("Delete this tool permanently?");
    if (!ok) return;
    try {
      const cleanId = String(tool.id ?? "").match(/^\d+/)?.[0] ?? tool.id;
      await api.delete(`/tools/${cleanId}`);
      setSuccessMsg("Tool deleted");
      onDeleted();
      onClose();
    } catch (err: any) {
      // surface backend 409 details if present
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to delete tool";
      setErrorMsg(msg);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 820,
          bgcolor: "#1C1C1E",
          color: "#fff",
          borderRadius: 1,
          p: 3,
          boxShadow: 24,
          outline: "none",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Update Tool
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            label="Item Name"
            size="small"
            value={form.item_name}
            onChange={setField("item_name")}
            InputLabelProps={{ sx: { color: "#aaa" } }}
            sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
          />

          <TextField
            label="Serial No"
            size="small"
            value={form.serial_no}
            InputLabelProps={{ sx: { color: "#aaa" } }}
            InputProps={{ readOnly: true }}
            sx={{ bgcolor: "#28282B", input: { color: "#fff", cursor: "not-allowed" } }}
          />

          <TextField
            label="Make"
            size="small"
            value={form.make}
            onChange={setField("make")}
            InputLabelProps={{ sx: { color: "#aaa" } }}
            sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
          />
          <TextField
            label="Model"
            size="small"
            value={form.model}
            onChange={setField("model")}
            InputLabelProps={{ sx: { color: "#aaa" } }}
            sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
          />

          <TextField
            label="Category"
            select
            size="small"
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value as ToolForm["category"] }))
            }
            InputLabelProps={{ sx: { color: "#aaa" } }}
            sx={{ bgcolor: "#28282B", "& .MuiSelect-select": { color: "#fff" } }}
            SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: "background.paper" } } } }}
          >
            {CATEGORIES.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Location"
            size="small"
            value={form.location}
            onChange={setField("location")}
            InputLabelProps={{ sx: { color: "#aaa" } }}
            sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
          />

          {/* keep native date input for good UX; it needs YYYY-MM-DD */}
          <TextField
            label="Purchase Date"
            type="date"
            size="small"
            value={form.purchase_date || ""}
            onChange={setField("purchase_date")}
            InputLabelProps={{ shrink: true, sx: { color: "#aaa" } }}
            sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
          />

          <TextField
            label="Description"
            size="small"
            value={form.description}
            onChange={setField("description")}
            InputLabelProps={{ sx: { color: "#aaa" } }}
            sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            onClick={handleDelete}
            sx={{
              color: "#EF4444",
              borderColor: "#EF4444",
              "&:hover": { backgroundColor: "rgba(239,68,68,0.1)" },
            }}
          >
            Delete
          </Button>

          <Box>
            <Button onClick={onClose} sx={{ mr: 1, color: "#aaa" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{ bgcolor: "#22C55E", "&:hover": { bgcolor: "#16A34A" } }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

/* =================== Main Page =================== */
export default function Tools() {
  const theme = useTheme();
  const tt = tableTokens(theme);

  const [view, setView] = useState<"list" | "add">("list");
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);

  // pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<10 | 20 | 50>(50);

  // filters
  const [categoryFilter, setCategoryFilter] = useState<"All" | (typeof CATEGORIES)[number]>("All");

  // add form state
  const initial: ToolForm = {
    item_name: "",
    make: "",
    model: "",
    description: "",
    serial_no: "",
    category: "",
    location: "",
    purchase_date: "",
  };
  const [form, setForm] = useState<ToolForm>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // update modal
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<Tool | null>(null);

  const fieldSx = { flex: "1 1 320px", minWidth: 0 };
  const updateField =
    (k: keyof ToolForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
    };

  const canSubmit = !!form.item_name && !!form.serial_no && !!form.category;

  const loadTools = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/tools");
      const arr =
        Array.isArray(data?.rows) ? data.rows :
        Array.isArray(data?.items) ? data.items :
        Array.isArray(data?.data) ? data.data :
        Array.isArray(data) ? data : [];
      setTools(arr.map(normalizeTool));
    } catch (e: any) {
      setTools([]);
      setErrorMsg(e?.response?.data?.error || "Failed to load tools");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTools();
  }, []);

  // filter + paginate
  const filtered = useMemo(
    () => tools.filter((t) => categoryFilter === "All" || t.category === categoryFilter),
    [tools, categoryFilter]
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = useMemo(
    () => filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  useEffect(() => setPage(1), [categoryFilter, rowsPerPage]);

  const clearAddForm = () => setForm(initial);

  const handleAdd = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const payload = {
        item_name: form.item_name,
        make: form.make || null,
        model: form.model || null,
        description: form.description || null,
        serial_no: form.serial_no,
        category: form.category || null,
        location: form.location || null,
        purchase_date: form.purchase_date || null, // yyyy-mm-dd
      };
      await api.post("/tools", payload);
      setSuccessMsg("Tool added successfully");
      clearAddForm();
      setView("list");
      await loadTools();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error || "Failed to add tool");
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (t: Tool) => {
    setSelected(t);
    setEditOpen(true);
  };

  const onSaved = async () => {
    await loadTools();
  };

  const onDeleted = async () => {
    await loadTools();
  };

  return (
    <Box>
      {/* Toggle */}
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
                bgcolor:
                  theme.palette.mode === "dark" ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.14)",
              },
            },
            "&:hover": { backgroundColor: "action.hover" },
          },
        }}
      >
        <ToggleButton value="list">All Tools</ToggleButton>
        <ToggleButton value="add">Add New Tool</ToggleButton>
      </ToggleButtonGroup>

      {/* LIST VIEW */}
      {view === "list" && (
        <Box sx={{ mx: { xs: -1.5, md: -1.5 } }}>
          <Paper variant="outlined" sx={UI.card.sx}>
            <Box sx={UI.headerRow.sx}>
              <FormControl size={UI.selectSm.size} sx={UI.selectSm.sx}>
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  MenuProps={UI.selectSm.menu}
                >
                  {(["All", ...CATEGORIES] as const).map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
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
                      "Make",
                      "Model",
                      "Description",
                      "Serial No",
                      "Category",
                      "Location",
                      "Purchase Date",
                      "Action",
                    ].map((h, i, arr) => (
                      <TableCell
                        key={h}
                        sx={{
                          ...UI.table.headCell(tt),
                          borderTopLeftRadius: i === 0 ? 6 : 0,
                          borderTopRightRadius: i === arr.length - 1 ? 6 : 0,
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                        Loading…
                      </TableCell>
                    </TableRow>
                  ) : paginated.length ? (
                    paginated.map((t, idx) => (
                      <TableRow key={t.id} hover>
                        {[
                          (page - 1) * rowsPerPage + idx + 1,
                          t.item_name,
                          t.make || "—",
                          t.model || "—",
                          t.description || "—",
                          t.serial_no,
                          t.category || "—",
                          t.location || "—",
                          isoToDMY(t.purchase_date), // << display DD-MM-YYYY
                          "__ACTION__",
                        ].map((cell, j) => (
                          <TableCell key={j} sx={UI.table.bodyCell(tt)}>
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
                                onClick={() => openEdit(t)}
                              >
                                Update
                              </Button>
                            ) : (
                              cell
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ color: "text.secondary", py: 3 }}>
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
      )}

      {/* ADD VIEW */}
      {view === "add" && (
        <Paper variant="outlined" sx={{ mx: { xs: 1, sm: 0 }, p: { xs: 1.5, sm: 2 }, borderRadius: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Tools &amp; Equipment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add a new tool or equipment item.
              </Typography>
            </Box>

            <Button variant="outlined" onClick={() => setForm(initial)} sx={{ borderRadius: 1, textTransform: "none" }}>
              Clear
            </Button>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <TextField label="Item Name *" value={form.item_name} onChange={updateField("item_name")} sx={fieldSx} />
              <TextField label="Serial No *" value={form.serial_no} onChange={updateField("serial_no")} sx={fieldSx} />
              <TextField label="Make" value={form.make} onChange={updateField("make")} sx={fieldSx} />
              <TextField label="Model" value={form.model} onChange={updateField("model")} sx={fieldSx} />
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <TextField
                select
                label="Category"
                value={form.category}
                onChange={updateField("category")}
                sx={{
                  ...fieldSx,
                  height: 56,
                  "& .MuiSelect-select": { height: 56, display: "flex", alignItems: "center" },
                }}
                SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: "background.paper" } } } }}
              >
                {CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
              <TextField label="Location" value={form.location} onChange={updateField("location")} sx={fieldSx} />
              <TextField
                label="Purchase Date"
                type="date"
                value={form.purchase_date}
                onChange={updateField("purchase_date")}
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />
            </Box>

            <TextField
              label="Description"
              value={form.description}
              onChange={updateField("description")}
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
                    bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                    color: "text.disabled",
                  },
                }}
                onClick={async () => {
                  await handleAdd();
                }}
              >
                {submitting ? "Adding..." : "Add Item"}
              </Button>
            </Box>
          </Stack>
        </Paper>
      )}

      {/* Update Modal */}
      <UpdateToolModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        tool={selected}
        onSaved={onSaved}
        onDeleted={onDeleted}
        setErrorMsg={setErrorMsg}
        setSuccessMsg={setSuccessMsg}
      />

      {/* Toasts */}
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
