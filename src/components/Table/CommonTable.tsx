import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  render?: (row: any) => React.ReactNode;
}

interface CommonTableProps {
  columns: Column[];
  rows: any[];
  isLoading?: boolean;
}

export default function CommonTable({
  columns,
  rows,
  isLoading,
}: CommonTableProps) {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="common table">
        <TableHead sx={{ bgcolor: "#f8f9fa" }}>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
                sx={{ fontWeight: "bold", color: "#6b7280" }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 && !isLoading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                sx={{ py: 10, textAlign: "center" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.7,
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: "#e3f2fd",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <Inventory2OutlinedIcon
                      sx={{ fontSize: 40, color: "primary.main" }}
                    />
                  </Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Data Found
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, rowIndex) => (
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
                key={row.id || rowIndex}
              >
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.render ? column.render(row) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
