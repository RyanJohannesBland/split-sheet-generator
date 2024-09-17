import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";

export default function ArtistDialog({ title, text, open, cancel, confirm }) {
  return (
    <Dialog open={open} onClose={cancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{text}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={cancel}>
          Cancel
        </Button>
        <Button variant="contained" color="success" onClick={confirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
