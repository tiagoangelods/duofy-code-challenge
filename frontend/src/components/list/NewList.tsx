import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addList } from "../../reducers/listSlice";

export default function NewListDialog({ open, onClose, lists }: any) {
  const dispatch = useDispatch();
  const { handleSubmit, register, formState: {errors} } = useForm();
  const [listName, setListName] = React.useState('');

  const handleSave = async () => {
    const add = await dispatch(addList({ name: listName, order: lists?.length + 1 }) as any);
    if (add?.payload?.status === 200) {
      setListName('');
      onClose();
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <form onSubmit={handleSubmit(handleSave)}>
        <DialogTitle id="scroll-dialog-title">Add New List</DialogTitle>
        <DialogContent dividers={true}>
            <TextField
              label="List name"
              variant="outlined"
              name="listName"
              value={listName}
              error={errors.listName?.type === 'required'}
              onChange={({ target: { value }}) => setListName(value)}
              inputProps={{
                ...register('listName', { required: true })
              }}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
