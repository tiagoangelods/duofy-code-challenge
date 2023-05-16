import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ptBR } from '@mui/x-date-pickers/locales';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addTask } from "../../reducers/taskSlice";

export default function NewTaskDialog({ open, onClose, lists }: any) {
  const dispatch = useDispatch();
  const { handleSubmit, register, formState: {errors} } = useForm();
  const [taskTitle, setTaskTitle] = React.useState<string>('');
  const [taskDueDate, setTaskDueDate] = React.useState<string | null>('');
  const [taskPriority, setTaskPriority] = React.useState<number | null>(2);
  const [taskList, setTaskList] = React.useState<string>('');

  const handleSave = async () => {
    const add = await dispatch(addTask({ 
      title: taskTitle,
      dueDate: taskDueDate,
      priority: taskPriority,
      list: taskList
    }) as any);
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
        <DialogTitle id="scroll-dialog-title">Add New Task</DialogTitle>
        <DialogContent dividers={true}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <TextField
              label="task title"
              variant="outlined"
              name="taskTitle"
              value={taskTitle}
              error={errors.taskTitle?.type === 'required'}
              onChange={({ target: { value }}) => setTaskTitle(value)}
              inputProps={{
                ...register('taskTitle', { required: true })
              }}
            />
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText}
            >
              <DatePicker
                sx={{ marginTop: 2 }}
                label="due date"
                value={taskDueDate}
                onChange={(value) => setTaskDueDate(value)}
              />
            </LocalizationProvider>
            <FormControl
              fullWidth
              sx={{ marginTop: 2 }}
            >
              <InputLabel id="priority-select-label">Priority</InputLabel>
              <Select
                labelId="priority-select-label"
                id="priority-select"
                value={taskPriority}
                label="Priority"
                onChange={({ target: { value }}) => setTaskPriority(value as any)}
              >
                <MenuItem value={0}>High</MenuItem>
                <MenuItem value={1}>Medium</MenuItem>
                <MenuItem value={2}>Low</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              sx={{ marginTop: 2 }}
            >
              <InputLabel id="list-select-label">List</InputLabel>
              <Select
                labelId="list-select-label"
                id="list-select"
                label="List"
                value={taskList}
                onChange={({ target: { value }}) => setTaskList(value)}
              >
                {
                  lists && lists?.map((listElement: any, listIndex: number) => (
                    <MenuItem key={`list_key_${listIndex}`} value={listElement?._id}>{listElement.name}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
