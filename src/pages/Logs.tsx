

// Logs.tsx
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

/* ===== types & demo data (same as Dashboard) ===== */
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

/* ===== table theme tokens (same look as Dashboard) ===== */
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

export default function Logs() {
  const theme = useTheme();
  const tt = tableTokens(theme);

  const [itemFilter, setItemFilter] = useState<(typeof ITEMS)[number]>("All");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUSES)[number]>("All");
  const [rows] = useState<Row[]>(() => makeRows());

  // pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<10 | 20 | 50>(50);
  useEffect(() => setPage(1), [itemFilter, statusFilter, rowsPerPage]);

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

  return (
    <Box>
      <Paper
        variant="outlined"
        sx={{
          mx: { xs: 1, sm: 0 },
          p: { xs: 1.5, sm: 1 },
          height: { xs: "calc(100vh - 190px)", md: "calc(100vh - 80px)" },
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            All items History
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

        {/* Table */}
        <TableContainer
          sx={{
            flex: 1,
            overflowX: "auto",
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: 8, height: 8 },
            "&::-webkit-scrollbar-thumb": { background: tt.scrollThumb, borderRadius: 4 },
          }}
        >
          <Table stickyHeader sx={{ minWidth: 1180 }}>
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
                          {cell}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ color: "text.secondary", py: 4 }}>
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Bottom controls */}
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
    </Box>
  );
}
