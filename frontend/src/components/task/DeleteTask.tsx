import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material";

export default function NewListDialog({ open, onClose, onSave }: any) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
        <DialogTitle id="scroll-dialog-title">Delete Task</DialogTitle>
        <DialogContent dividers={true}>
            <Typography>Do you really want to delete this task?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onSave}>Save</Button>
        </DialogActions>
    </Dialog>
  );
}
