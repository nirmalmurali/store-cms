import { TextField, TextFieldProps } from "@mui/material";

export default function CommonInput(props: TextFieldProps) {
  return (
    <TextField
      variant="outlined"
      fullWidth
      margin="normal"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
        },
      }}
      {...props}
    />
  );
}
