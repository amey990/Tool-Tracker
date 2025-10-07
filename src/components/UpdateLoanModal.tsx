import React, { useEffect, useState } from "react";
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
  loan: Loan;                // parent renders only when loan exists
  apiBase: string;
  onUpdated: () => void;     // refresh list in parent
  onDeleted: () => void;     // refresh list in parent
};

const STATUS_OPTS: Loan["status"][] = ["Issued", "Returned", "Overdue"];

/** Box-based, dark-styled modal (no Grid), following your example. */
export function UpdateLoanModal({
  open,
  onClose,
  loan,
  apiBase,
  onUpdated,
  onDeleted,
}: Props) {
  const [form, setForm] = useState<Loan>(loan);
  const client = axios.create({ baseURL: apiBase });

  // sync local form whenever the selected loan changes
  useEffect(() => {
    setForm(loan);
  }, [loan]);

  // Generic field update
  const setField =
    (key: keyof Loan) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  // PUT
  const handleUpdate = async () => {
    try {
      await client.put(`/loans/${loan.id}`, {
        item_name: form.item_name,
        serial_no: form.serial_no,
        issued_to: form.issued_to,
        issue_date: form.issue_date, // YYYY-MM-DD
        return_by: form.return_by,   // YYYY-MM-DD
        location: form.location,
        issued_by: form.issued_by,
        remarks: form.remarks,
        status: form.status,
      });
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update item.");
    }
  };

  // DELETE
  const handleDelete = async () => {
    const ok = window.confirm("Delete this record permanently?");
    if (!ok) return;
    try {
      await client.delete(`/loans/${loan.id}`);
      onDeleted();
      onClose();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete item.");
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
          width: 720,
          bgcolor: "#1C1C1E",
          color: "#fff",
          borderRadius: 2,
          p: 3,
          boxShadow: 24,
          outline: "none",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Update Item
        </Typography>

        {/* Form area (Box instead of Grid; using CSS grid via Box like your example) */}
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
            onChange={setField("item_name")}
            InputLabelProps={{ sx: { color: "#aaa" } }}
            sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
          />

          <TextField
            label="Serial No"
            size="small"
            value={form.serial_no}
            onChange={setField("serial_no")}
            InputLabelProps={{ sx: { color: "#aaa" } }}
            sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
          />

          <TextField
            label="Issuing To"
            size="small"
            value={form.issued_to}
            onChange={setField("issued_to")}
            InputLabelProps={{ sx: { color: "#aaa" } }}
            sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
          />

          <TextField
            label="Issued By"
            size="small"
            value={form.issued_by}
            onChange={setField("issued_by")}
            InputLabelProps={{ sx: { color: "#aaa" } }}
            sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
          />

          <TextField
            label="Issue Date"
            type="date"
            size="small"
            value={form.issue_date}
            onChange={setField("issue_date")}
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
            label="Location"
            size="small"
            value={form.location}
            onChange={setField("location")}
            InputLabelProps={{ sx: { color: "#aaa" } }}
            sx={{ bgcolor: "#28282B", input: { color: "#fff" } }}
          />

          <FormControl size="small" sx={{ bgcolor: "#28282B" }}>
            <InputLabel sx={{ color: "#aaa" }}>Status</InputLabel>
            <Select
              value={form.status}
              label="Status"
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status: e.target.value as Loan["status"],
                }))
              }
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
            value={form.remarks ?? ""}
            onChange={setField("remarks")}
            InputLabelProps={{ sx: { color: "#aaa" } }}
            sx={{
              gridColumn: "1 / -1",
              bgcolor: "#28282B",
              textarea: { color: "#fff" },
            }}
          />
        </Box>

        {/* Footer actions */}
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
