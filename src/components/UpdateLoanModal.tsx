// // import React, { useEffect, useState } from "react";
// // import {
// //   Modal,
// //   Box,
// //   Typography,
// //   TextField,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   MenuItem,
// //   Button,
// // } from "@mui/material";
// // import axios from "axios";
// // import type { Loan } from "../pages/Dashboard";

// // type Props = {
// //   open: boolean;
// //   onClose: () => void;
// //   loan: Loan;
// //   apiBase: string;
// //   onUpdated: () => void;
// //   onDeleted: () => void;
// // };

// // const STATUS_OPTS: Loan["status"][] = ["Issued", "Returned", "Overdue"];

// // // normalize any date string to YYYY-MM-DD for <input type="date">
// // const toISODate = (v: string) => {
// //   if (!v) return "";
// //   if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
// //   const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
// //   if (m) {
// //     const [, mm, dd, yyyy] = m;
// //     return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
// //   }
// //   const d = new Date(v);
// //   return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
// // };

// // export function UpdateLoanModal({
// //   open,
// //   onClose,
// //   loan,
// //   apiBase,
// //   onUpdated,
// //   onDeleted,
// // }: Props) {
// //   const client = axios.create({ baseURL: apiBase });

// //   const origStatus = loan.status;

// //   // local form
// //   const [form, setForm] = useState({
// //     item_name: loan.item_name,
// //     serial_no: loan.serial_no,
// //     issued_to: loan.issued_to,
// //     issued_by: loan.issued_by,
// //     issue_date: toISODate(loan.issue_date),
// //     return_by: toISODate(loan.return_by), // planned
// //     location: loan.location,
// //     remarks: loan.remarks ?? "",
// //     status: loan.status as Loan["status"],
// //   });

// //   useEffect(() => {
// //     setForm({
// //       item_name: loan.item_name,
// //       serial_no: loan.serial_no,
// //       issued_to: loan.issued_to,
// //       issued_by: loan.issued_by,
// //       issue_date: toISODate(loan.issue_date),
// //       return_by: toISODate(loan.return_by),
// //       location: loan.location,
// //       remarks: loan.remarks ?? "",
// //       status: loan.status as Loan["status"],
// //     });
// //   }, [loan]);

// //   const setField =
// //     (key: keyof typeof form) =>
// //     (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
// //       setForm((prev) => ({ ...prev, [key]: e.target.value }));
// //     };

// //   const handleUpdate = async () => {
// //     try {
// //       const isReturning = origStatus !== "Returned" && form.status === "Returned";

// //       if (isReturning) {
// //         // set real return date = TODAY (server stamps CURRENT_DATE)
// //         await client.post(`/loans/${loan.id}/return`, {
// //           // optional: explicitly send a date
// //           // return_date: new Date().toISOString().slice(0,10),
// //           remarks: form.remarks ?? null,
// //         });
// //       } else {
// //         // normal partial update (does not set return_date)
// //         await client.patch(`/loans/${loan.id}`, {
// //           return_by: form.return_by || null,
// //           location: form.location || null,
// //           remarks: form.remarks || null,
// //           status: form.status,
// //         });
// //       }

// //       onUpdated(); // parent reloads the list; display will use return_date if present
// //       onClose();
// //     } catch (err: any) {
// //       console.error("Update failed", err?.response?.data ?? err);
// //       alert(err?.response?.data?.error || "Failed to update item.");
// //     }
// //   };

// //   const handleDelete = async () => {
// //     const ok = window.confirm("Delete this record permanently?");
// //     if (!ok) return;
// //     try {
// //       await client.delete(`/loans/${loan.id}`);
// //       onDeleted();
// //       onClose();
// //     } catch (err: any) {
// //       console.error("Delete failed", err?.response?.data ?? err);
// //       alert(err?.response?.data?.error || "Failed to delete item.");
// //     }
// //   };

// //   return (
// //     <Modal open={open} onClose={onClose}>
// //       <Box
// //         sx={{
// //           position: "absolute",
// //           top: "50%",
// //           left: "50%",
// //           transform: "translate(-50%, -50%)",
// //           width: 720,
// //           bgcolor: "#1C1C1E",
// //           color: "#fff",
// //           borderRadius: 2,
// //           p: 3,
// //           boxShadow: 24,
// //           outline: "none",
// //         }}
// //       >
// //         <Typography variant="h6" gutterBottom>
// //           Update Entry
// //         </Typography>

// //         <Box
// //           component="form"
// //           sx={{
// //             display: "grid",
// //             gridTemplateColumns: "1fr 1fr",
// //             gap: 2,
// //             mb: 3,
// //           }}
// //         >
// //           {/* READ ONLY */}
// //           <TextField
// //             label="Item Name"
// //             size="small"
// //             value={form.item_name}
// //             InputLabelProps={{ sx: { color: "#aaa" } }}
// //             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
// //             InputProps={{ readOnly: true }}
// //           />
// //           <TextField
// //             label="Serial No"
// //             size="small"
// //             value={form.serial_no}
// //             InputLabelProps={{ sx: { color: "#aaa" } }}
// //             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
// //             InputProps={{ readOnly: true }}
// //           />
// //           <TextField
// //             label="Issuing To"
// //             size="small"
// //             value={form.issued_to}
// //             InputLabelProps={{ sx: { color: "#aaa" } }}
// //             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
// //             InputProps={{ readOnly: true }}
// //           />
// //           <TextField
// //             label="Issued By"
// //             size="small"
// //             value={form.issued_by}
// //             InputLabelProps={{ sx: { color: "#aaa" } }}
// //             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
// //             InputProps={{ readOnly: true }}
// //           />
// //           <TextField
// //             label="Issue Date"
// //             type="date"
// //             size="small"
// //             value={form.issue_date}
// //             InputLabelProps={{ shrink: true, sx: { color: "#aaa" } }}
// //             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
// //             InputProps={{ readOnly: true }}
// //           />

// //           {/* EDITABLE */}
// //           <TextField
// //             label="Return By"
// //             type="date"
// //             size="small"
// //             value={form.return_by}
// //             onChange={setField("return_by")}
// //             InputLabelProps={{ shrink: true, sx: { color: "#aaa" } }}
// //             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
// //           />
// //           <TextField
// //             label="Location"
// //             size="small"
// //             value={form.location}
// //             onChange={setField("location")}
// //             InputLabelProps={{ sx: { color: "#aaa" } }}
// //             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
// //           />
// //           <FormControl size="small" sx={{ bgcolor: "#28282B" }}>
// //             <InputLabel sx={{ color: "#aaa" }}>Status</InputLabel>
// //             <Select
// //               value={form.status}
// //               label="Status"
// //               onChange={(e) =>
// //                 setForm((prev) => ({
// //                   ...prev,
// //                   status: e.target.value as Loan["status"],
// //                 }))
// //               }
// //               sx={{ color: "#fff" }}
// //             >
// //               {STATUS_OPTS.map((s) => (
// //                 <MenuItem key={s} value={s}>
// //                   {s}
// //                 </MenuItem>
// //               ))}
// //             </Select>
// //           </FormControl>
// //           <TextField
// //             label="Remarks"
// //             size="small"
// //             multiline
// //             rows={2}
// //             value={form.remarks}
// //             onChange={setField("remarks")}
// //             InputLabelProps={{ sx: { color: "#aaa" } }}
// //             sx={{
// //               gridColumn: "1 / -1",
// //               bgcolor: "#28282B",
// //               textarea: { color: "#fff" },
// //             }}
// //           />
// //         </Box>

// //         <Box sx={{ display: "flex", justifyContent: "space-between" }}>
// //           <Button
// //             variant="outlined"
// //             onClick={handleDelete}
// //             sx={{
// //               color: "#EF4444",
// //               borderColor: "#EF4444",
// //               "&:hover": { backgroundColor: "rgba(239,68,68,0.1)" },
// //             }}
// //           >
// //             Delete
// //           </Button>

// //           <Box>
// //             <Button onClick={onClose} sx={{ mr: 1, color: "#aaa" }}>
// //               Cancel
// //             </Button>
// //             <Button
// //               variant="contained"
// //               onClick={handleUpdate}
// //               sx={{ bgcolor: "#22C55E", "&:hover": { bgcolor: "#16A34A" } }}
// //             >
// //               Update
// //             </Button>
// //           </Box>
// //         </Box>
// //       </Box>
// //     </Modal>
// //   );
// // }


// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Modal,
//   Box,
//   Typography,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
// } from "@mui/material";
// import axios from "axios";
// import type { Loan } from "../pages/Dashboard";

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   loan: Loan;
//   apiBase: string;
//   onUpdated: () => void;
//   onDeleted: () => void;
// };

// // UI shows title-case; DB expects lowercase
// const STATUS_OPTS: Loan["status"][] = ["Issued", "Returned", "Overdue"];
// const toDbStatus = (s: Loan["status"]) => s.toLowerCase();

// // normalize any date-like string to YYYY-MM-DD for <input type="date">
// const toISODate = (v?: string | null) => {
//   if (!v) return "";
//   if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
//   const d = new Date(v);
//   return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
// };

// const todayISO = () => new Date().toISOString().slice(0, 10);

// export function UpdateLoanModal({
//   open,
//   onClose,
//   loan,
//   apiBase,
//   onUpdated,
//   onDeleted,
// }: Props) {
//   const client = axios.create({ baseURL: apiBase });

//   // original status (title-case) to detect transitions
//   const origStatus = loan.status;

//   // local form state mirrors issuing table (title-case status for UI)
//   const [form, setForm] = useState({
//     item_name: loan.item_name,
//     serial_no: loan.serial_no,
//     category: loan.category ?? "",
//     assigned_pm: loan.assigned_pm,
//     project: loan.project,
//     assign_to: loan.assign_to,
//     assign_date: toISODate(loan.assign_date),
//     return_by: toISODate(loan.return_by),
//     return_date: toISODate(loan.return_date),
//     status: loan.status as Loan["status"],
//     remarks: loan.remarks ?? "",
//   });

//   useEffect(() => {
//     setForm({
//       item_name: loan.item_name,
//       serial_no: loan.serial_no,
//       category: loan.category ?? "",
//       assigned_pm: loan.assigned_pm,
//       project: loan.project,
//       assign_to: loan.assign_to,
//       assign_date: toISODate(loan.assign_date),
//       return_by: toISODate(loan.return_by),
//       return_date: toISODate(loan.return_date),
//       status: loan.status as Loan["status"],
//       remarks: loan.remarks ?? "",
//     });
//   }, [loan]);

//   // when status flips to Returned and there's no return_date, prefill with today
//   useEffect(() => {
//     if (origStatus !== "Returned" && form.status === "Returned" && !form.return_date) {
//       setForm((f) => ({ ...f, return_date: todayISO() }));
//     }
//   }, [form.status, origStatus]);

//   const setField =
//     (key: keyof typeof form) =>
//     (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//       setForm((prev) => ({ ...prev, [key]: e.target.value }));
//     };

//   const handleStatusChange = (e: any) => {
//     const next = e.target.value as Loan["status"];
//     setForm((f) => ({
//       ...f,
//       status: next,
//       return_date:
//         next === "Returned" && !f.return_date
//           ? todayISO()
//           : next !== "Returned"
//           ? "" // clear return_date if leaving Returned
//           : f.return_date,
//     }));
//   };

//   // Build PATCH body (convert blanks -> null, status -> lowercase)
//   const payload = useMemo(
//     () => ({
//       assigned_pm: form.assigned_pm || null,
//       project: form.project || null,
//       assign_to: form.assign_to || null,
//       assign_date: form.assign_date || null,
//       return_by: form.return_by || null,
//       return_date: form.return_date || null,
//       status: toDbStatus(form.status),
//       remarks: form.remarks || null,
//     }),
//     [form]
//   );

//   const cleanId = String(loan.id ?? "").match(/^\d+/)?.[0] ?? String(loan.id);

//   const handleUpdate = async () => {
//     try {
//       await client.patch(`/loans/${cleanId}`, payload, {
//         headers: { "Content-Type": "application/json" },
//       });
//       onUpdated();
//       onClose();
//     } catch (err: any) {
//       console.error("Update failed", err?.response?.data ?? err);
//       alert(err?.response?.data?.error || "Failed to update entry.");
//     }
//   };

//   const handleDelete = async () => {
//     const ok = window.confirm("Delete this record permanently?");
//     if (!ok) return;
//     try {
//       await client.delete(`/loans/${cleanId}`);
//       onDeleted();
//       onClose();
//     } catch (err: any) {
//       console.error("Delete failed", err?.response?.data ?? err);
//       alert(err?.response?.data?.error || "Failed to delete entry.");
//     }
//   };

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
//           borderRadius: 2,
//           p: 3,
//           boxShadow: 24,
//           outline: "none",
//         }}
//       >
//         <Typography variant="h6" gutterBottom>
//           Update Issuing Entry
//         </Typography>

//         <Box
//           component="form"
//           sx={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr",
//             gap: 2,
//             mb: 3,
//           }}
//         >
//           {/* READ ONLY (tool identity) */}
//           <TextField
//             label="Item Name"
//             size="small"
//             value={form.item_name}
//             InputLabelProps={{ sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//             InputProps={{ readOnly: true }}
//           />
//           <TextField
//             label="Serial No"
//             size="small"
//             value={form.serial_no}
//             InputLabelProps={{ sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//             InputProps={{ readOnly: true }}
//           />
//           <TextField
//             label="Category"
//             size="small"
//             value={form.category}
//             InputLabelProps={{ sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//             InputProps={{ readOnly: true }}
//           />

//           {/* EDITABLE (issuing data) */}
//           <TextField
//             label="Assigned PM"
//             size="small"
//             value={form.assigned_pm}
//             onChange={setField("assigned_pm")}
//             InputLabelProps={{ sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//           />
//           <TextField
//             label="Project"
//             size="small"
//             value={form.project}
//             onChange={setField("project")}
//             InputLabelProps={{ sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//           />
//           <TextField
//             label="Assign To"
//             size="small"
//             value={form.assign_to}
//             onChange={setField("assign_to")}
//             InputLabelProps={{ sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//           />

//           <TextField
//             label="Assign Date"
//             type="date"
//             size="small"
//             value={form.assign_date}
//             onChange={setField("assign_date")}
//             InputLabelProps={{ shrink: true, sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//           />
//           <TextField
//             label="Return By"
//             type="date"
//             size="small"
//             value={form.return_by}
//             onChange={setField("return_by")}
//             InputLabelProps={{ shrink: true, sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//           />

//           {/* Actual return date editable only when Returned */}
//           <TextField
//             label="Return Date"
//             type="date"
//             size="small"
//             value={form.return_date}
//             onChange={setField("return_date")}
//             InputLabelProps={{ shrink: true, sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//             disabled={form.status !== "Returned"}
//           />

//           <FormControl size="small" sx={{ bgcolor: "#28282B" }}>
//             <InputLabel sx={{ color: "#aaa" }}>Status</InputLabel>
//             <Select
//               value={form.status}
//               label="Status"
//               onChange={handleStatusChange}
//               sx={{ color: "#fff" }}
//             >
//               {STATUS_OPTS.map((s) => (
//                 <MenuItem key={s} value={s}>
//                   {s}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <TextField
//             label="Remarks"
//             size="small"
//             multiline
//             rows={2}
//             value={form.remarks}
//             onChange={setField("remarks")}
//             InputLabelProps={{ sx: { color: "#aaa" } }}
//             sx={{
//               gridColumn: "1 / -1",
//               bgcolor: "#28282B",
//               textarea: { color: "#fff" },
//             }}
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
//               onClick={handleUpdate}
//               sx={{ bgcolor: "#22C55E", "&:hover": { bgcolor: "#16A34A" } }}
//             >
//               Update
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//     </Modal>
//   );
// }



// --- UpdateLoanModal.tsx ---
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Modal,
//   Box,
//   Typography,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
// } from "@mui/material";
// import axios from "axios";
// import type { Loan } from "../pages/Dashboard";

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   loan: Loan;
//   apiBase: string;
//   onUpdated: () => void;
//   onDeleted: () => void;
// };

// const STATUS_OPTS: Loan["status"][] = ["Issued", "Returned", "Overdue", "Lost"];
// const toDbStatus = (s: Loan["status"]) => s.toLowerCase();
// const toISODate = (v?: string | null) => (!v ? "" : v.slice(0, 10));
// const todayISO = () => new Date().toISOString().slice(0, 10);

// export function UpdateLoanModal({
//   open,
//   onClose,
//   loan,
//   apiBase,
//   onUpdated,
//   onDeleted,
// }: Props) {
//   const client = axios.create({ baseURL: apiBase });
//   const origStatus = loan.status;

//   const [form, setForm] = useState({
//     item_name: loan.item_name,
//     serial_no: loan.serial_no ?? "",
//     qty: loan.qty ?? 1,
//     category: loan.category ?? "",
//     assigned_pm: loan.assigned_pm,
//     project: loan.project,
//     assign_to: loan.assign_to,
//     assign_date: toISODate(loan.assign_date),
//     return_by: toISODate(loan.return_by),
//     return_date: toISODate(loan.return_date),
//     status: loan.status as Loan["status"],
//     remarks: loan.remarks ?? "",
//   });

//   useEffect(() => {
//     setForm({
//       item_name: loan.item_name,
//       serial_no: loan.serial_no ?? "",
//       qty: loan.qty ?? 1,
//       category: loan.category ?? "",
//       assigned_pm: loan.assigned_pm,
//       project: loan.project,
//       assign_to: loan.assign_to,
//       assign_date: toISODate(loan.assign_date),
//       return_by: toISODate(loan.return_by),
//       return_date: toISODate(loan.return_date),
//       status: loan.status as Loan["status"],
//       remarks: loan.remarks ?? "",
//     });
//   }, [loan]);

//   useEffect(() => {
//     if (origStatus !== "Returned" && form.status === "Returned" && !form.return_date)
//       setForm((f) => ({ ...f, return_date: todayISO() }));
//   }, [form.status, origStatus]);

//   const setField =
//     (key: keyof typeof form) =>
//     (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
//       setForm((prev) => ({ ...prev, [key]: e.target.value }));

//   const handleStatusChange = (e: any) => {
//     const next = e.target.value as Loan["status"];
//     setForm((f) => ({
//       ...f,
//       status: next,
//       return_date:
//         next === "Returned" && !f.return_date
//           ? todayISO()
//           : next !== "Returned"
//           ? ""
//           : f.return_date,
//     }));
//   };

//   const payload = useMemo(
//     () => ({
//       assigned_pm: form.assigned_pm || null,
//       project: form.project || null,
//       assign_to: form.assign_to || null,
//       assign_date: form.assign_date || null,
//       return_by: form.return_by || null,
//       return_date: form.return_date || null,
//       status: toDbStatus(form.status),
//       remarks: form.remarks || null,
//     }),
//     [form]
//   );

//   const cleanId = String(loan.id ?? "").match(/^\d+/)?.[0] ?? String(loan.id);

//   const handleUpdate = async () => {
//     try {
//       await client.patch(`/loans/${cleanId}`, payload, {
//         headers: { "Content-Type": "application/json" },
//       });
//       onUpdated();
//       onClose();
//     } catch (err: any) {
//       alert(err?.response?.data?.error || "Failed to update entry.");
//     }
//   };

//   const handleDelete = async () => {
//     const ok = window.confirm("Delete this record permanently?");
//     if (!ok) return;
//     try {
//       await client.delete(`/loans/${cleanId}`);
//       onDeleted();
//       onClose();
//     } catch (err: any) {
//       alert(err?.response?.data?.error || "Failed to delete entry.");
//     }
//   };

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
//           borderRadius: 2,
//           p: 3,
//           boxShadow: 24,
//           outline: "none",
//         }}
//       >
//         <Typography variant="h6" gutterBottom>
//           Update Issuing Entry
//         </Typography>

//         <Box
//           component="form"
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
//             InputLabelProps={{ sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//             InputProps={{ readOnly: true }}
//           />
//           <TextField
//             label="Serial No"
//             size="small"
//             value={form.serial_no}
//             InputLabelProps={{ sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//             InputProps={{ readOnly: true }}
//           />
//           <TextField
//             label="Qty"
//             size="small"
//             value={form.qty}
//             InputLabelProps={{ sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//             InputProps={{ readOnly: true }}
//           />
//           <TextField
//             label="Category"
//             size="small"
//             value={form.category}
//             InputLabelProps={{ sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//             InputProps={{ readOnly: true }}
//           />
//           <TextField
//             label="Assigned PM"
//             size="small"
//             value={form.assigned_pm}
//             onChange={setField("assigned_pm")}
//             InputLabelProps={{ sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//           />
//           <TextField
//             label="Project"
//             size="small"
//             value={form.project}
//             onChange={setField("project")}
//             InputLabelProps={{ sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//           />
//           <TextField
//             label="Assign To"
//             size="small"
//             value={form.assign_to}
//             onChange={setField("assign_to")}
//             InputLabelProps={{ sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//           />
//           <TextField
//             label="Assign Date"
//             type="date"
//             size="small"
//             value={form.assign_date}
//             onChange={setField("assign_date")}
//             InputLabelProps={{ shrink: true, sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//           />
//           <TextField
//             label="Return By"
//             type="date"
//             size="small"
//             value={form.return_by}
//             onChange={setField("return_by")}
//             InputLabelProps={{ shrink: true, sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//           />
//           <TextField
//             label="Return Date"
//             type="date"
//             size="small"
//             value={form.return_date}
//             onChange={setField("return_date")}
//             InputLabelProps={{ shrink: true, sx: { color: "#aaa" } }}
//             sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
//             disabled={form.status !== "Returned"}
//           />
//           <FormControl size="small" sx={{ bgcolor: "#28282B" }}>
//             <InputLabel sx={{ color: "#aaa" }}>Status</InputLabel>
//             <Select
//               value={form.status}
//               label="Status"
//               onChange={handleStatusChange}
//               sx={{ color: "#fff" }}
//             >
//               {STATUS_OPTS.map((s) => (
//                 <MenuItem key={s} value={s}>
//                   {s}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <TextField
//             label="Remarks"
//             size="small"
//             multiline
//             rows={2}
//             value={form.remarks}
//             onChange={setField("remarks")}
//             InputLabelProps={{ sx: { color: "#aaa" } }}
//             sx={{
//               gridColumn: "1 / -1",
//               bgcolor: "#28282B",
//               textarea: { color: "#fff" },
//             }}
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
//               onClick={handleUpdate}
//               sx={{ bgcolor: "#22C55E", "&:hover": { bgcolor: "#16A34A" } }}
//             >
//               Update
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//     </Modal>
//   );
// }




///
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import axios from "axios";
import type { Loan } from "../pages/Dashboard";

type Props = {
  open: boolean;
  onClose: () => void;
  loan: Loan;
  apiBase: string;
  onUpdated: () => void;
  onDeleted: () => void;
};

const STATUS_OPTS: Loan["status"][] = ["Issued", "Returned", "Overdue", "Lost"];
const toDbStatus = (s: Loan["status"]) => s.toLowerCase();
const toISODate = (v?: string | null) => (!v ? "" : v.slice(0, 10));
const todayISO = () => new Date().toISOString().slice(0, 10);

export function UpdateLoanModal({
  open,
  onClose,
  loan,
  apiBase,
  onUpdated,
  onDeleted,
}: Props) {
  const client = axios.create({ baseURL: apiBase });
  const origStatus = loan.status;

  const [form, setForm] = useState({
    item_name: loan.item_name,
    serial_no: loan.serial_no ?? "",
    qty: loan.qty ?? 1,
    category: loan.category ?? "",
    assigned_pm: loan.assigned_pm,
    project: loan.project,
    assign_to: loan.assign_to,
    assign_date: toISODate(loan.assign_date),
    return_by: toISODate(loan.return_by),
    return_date: toISODate(loan.return_date),
    status: loan.status as Loan["status"],
    remarks: loan.remarks ?? "",
  });

  useEffect(() => {
    setForm({
      item_name: loan.item_name,
      serial_no: loan.serial_no ?? "",
      qty: loan.qty ?? 1,
      category: loan.category ?? "",
      assigned_pm: loan.assigned_pm,
      project: loan.project,
      assign_to: loan.assign_to,
      assign_date: toISODate(loan.assign_date),
      return_by: toISODate(loan.return_by),
      return_date: toISODate(loan.return_date),
      status: loan.status as Loan["status"],
      remarks: loan.remarks ?? "",
    });
  }, [loan]);

  useEffect(() => {
    if (origStatus !== "Returned" && form.status === "Returned" && !form.return_date)
      setForm((f) => ({ ...f, return_date: todayISO() }));
  }, [form.status, origStatus]);

  const setField =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleStatusChange = (e: any) => {
    const next = e.target.value as Loan["status"];
    setForm((f) => ({
      ...f,
      status: next,
      return_date:
        next === "Returned" && !f.return_date
          ? todayISO()
          : next !== "Returned"
          ? ""
          : f.return_date,
    }));
  };

  const payload = useMemo(
    () => ({
      assigned_pm: form.assigned_pm || null,
      project: form.project || null,
      assign_to: form.assign_to || null,
      assign_date: form.assign_date || null,
      return_by: form.return_by || null,
      return_date: form.return_date || null,
      status: toDbStatus(form.status),
      remarks: form.remarks || null,
      qty: Number(form.qty) || 1, // allow qty update
    }),
    [form]
  );

  const cleanId = String(loan.id ?? "").match(/^\d+/)?.[0] ?? String(loan.id);

  const handleUpdate = async () => {
    try {
      await client.patch(`/loans/${cleanId}`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      onUpdated();
      onClose();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to update entry.");
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm("Delete this record permanently?");
    if (!ok) return;
    try {
      await client.delete(`/loans/${cleanId}`);
      onDeleted();
      onClose();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to delete entry.");
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
          borderRadius: 2,
          p: 3,
          boxShadow: 24,
          outline: "none",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Update Issuing Entry
        </Typography>

        <Box
          component="form"
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
            InputLabelProps={{ sx: { color: "#aaa" } }}
            sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Serial No"
            size="small"
            value={form.serial_no}
            InputLabelProps={{ sx: { color: "#aaa" } }}
            sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Qty"
            size="small"
            type="number"
            value={form.qty}
            onChange={setField("qty")}
            InputLabelProps={{ sx: { color: "#aaa" } }}
            sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
            InputProps={{ readOnly: !!form.serial_no }} // read-only if serialized
          />
          <TextField
            label="Category"
            size="small"
            value={form.category}
            InputLabelProps={{ sx: { color: "#aaa" } }}
            sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Assigned PM"
            size="small"
            value={form.assigned_pm}
            onChange={setField("assigned_pm")}
            InputLabelProps={{ sx: { color: "#aaa" } }}
            sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
          />
          <TextField
            label="Project"
            size="small"
            value={form.project}
            onChange={setField("project")}
            InputLabelProps={{ sx: { color: "#aaa" } }}
            sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
          />
          <TextField
            label="Assign To"
            size="small"
            value={form.assign_to}
            onChange={setField("assign_to")}
            InputLabelProps={{ sx: { color: "#aaa" } }}
            sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
          />
          <TextField
            label="Assign Date"
            type="date"
            size="small"
            value={form.assign_date}
            onChange={setField("assign_date")}
            InputLabelProps={{ shrink: true, sx: { color: "#aaa" } }}
            sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
          />
          <TextField
            label="Return By"
            type="date"
            size="small"
            value={form.return_by}
            onChange={setField("return_by")}
            InputLabelProps={{ shrink: true, sx: { color: "#aaa" } }}
            sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
          />
          <TextField
            label="Return Date"
            type="date"
            size="small"
            value={form.return_date}
            onChange={setField("return_date")}
            InputLabelProps={{ shrink: true, sx: { color: "#aaa" } }}
            sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
            disabled={form.status !== "Returned"}
          />
          <FormControl size="small" sx={{ bgcolor: "#28282B" }}>
            <InputLabel sx={{ color: "#aaa" }}>Status</InputLabel>
            <Select
              value={form.status}
              label="Status"
              onChange={handleStatusChange}
              sx={{ color: "#fff" }}
            >
              {STATUS_OPTS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Remarks"
            size="small"
            multiline
            rows={2}
            value={form.remarks}
            onChange={setField("remarks")}
            InputLabelProps={{ sx: { color: "#aaa" } }}
            sx={{
              gridColumn: "1 / -1",
              bgcolor: "#28282B",
              textarea: { color: "#fff" },
            }}
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
              onClick={handleUpdate}
              sx={{ bgcolor: "#22C55E", "&:hover": { bgcolor: "#16A34A" } }}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
