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
  const [listOrder, setListOrder] = React.useState(1);

  const handleSave = async () => {
    const add = await dispatch(addList({ name: listName, order: listOrder }) as any);
    if (add?.payload?.status === 200) {
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
            <TextField
              style={{ marginLeft: 12, maxWidth: 120 }}
              type="number"
              label="order"
              name="listOrder"
              variant="outlined"
              error={errors.listOrder?.type === 'required'}
              value={listOrder}
              onChange={({ target: { value }}) => setListOrder(value as any)}
              inputProps={{
                min: 1,
                max: (lists?.length + 1),
                ...register('listOrder', { required: true, min: 1, max: (lists?.length + 1) }),
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
