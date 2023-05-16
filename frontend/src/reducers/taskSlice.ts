import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import baseApi from '../api';

export const getAllTasks = createAsyncThunk(
  'lists/getAllTasks',
  async () => {
    const response = await baseApi.get('/tasks/all');
    return response.data;
  }
);

export const addTask = createAsyncThunk(
  'task/add',
  async ({ title, dueDate, priority, list, order }: any) => {
    const response = await baseApi.post('/tasks', { title, dueDate, priority, list, order });
    return { ...response.data, title, dueDate, priority, list, order };
  }
);
export const editTask = createAsyncThunk(
  'task/edit',
  async ({ id, title, dueDate, priority, list, order }: any) => {
    const response = await baseApi.patch(`/tasks/${id}`, { title, dueDate, priority, list, order });
    return { ...response.data, title, order, dueDate, priority, list, id };
  }
);

export const deleteTask = createAsyncThunk(
  'task/delete',
  async ({ id }: any) => {
    const response = await baseApi.delete(`/tasks/${id}`);
    return { ...response.data, id};
  }
);

export const taskSlicer = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    reorderTasks: (state: any, action: any) => {
      const { payload } = action;
      if (payload?.length > 0) {
        const orderedTasks = payload.sort((a: any, b: any) => (a.order > b.order) ? 1 : -1)
        state = [...orderedTasks];
      }
      return state;
    }
  },
  extraReducers: (builder) =>{
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    builder.addCase(getAllTasks.fulfilled, (state: any, action: any) => {
      const { payload } = action;
      if (payload?.length > 0) {
        const orderedTasks = payload.sort((a: any, b: any) => (a.order > b.order) ? 1 : -1)
        state = [...orderedTasks];
      }
      return state;
    }),
    builder.addCase(addTask.fulfilled, (state: any, action: any) => {
      const { payload } = action
      if (payload?.id) {
        state = [...state, { ...payload, _id: payload?.id }];
      }
      return state;
    }),
    builder.addCase(editTask.fulfilled, (state: any, action: any) => {
      const { payload } = action
      if (payload?.id) {
        const index = state?.findIndex((task: any) => task?._id === payload.id);
        if (index > -1) {
          state[index] = { ...payload, _id: payload?.id };
        }
      }
      return state;
    }),
    builder.addCase(deleteTask.fulfilled, (state: any, action: any) => {
      const { payload } = action
      if (payload?.status === 200) {
        state = state?.filter((task: any) => task?._id !== payload?.id);
      }
      return state;
    })
  }
});

export const selectTasks = (state: any) => state.tasks;

export const { reorderTasks } = taskSlicer.actions;

export default taskSlicer.reducer;
