import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import baseApi from '../api';
import { move, reorder } from '../utils';

export const getAllLists = createAsyncThunk(
  'lists/getAllLists',
  async () => {
    const response = await baseApi.get('/lists');
    return response.data;
  }
);

export const addList = createAsyncThunk(
  'lists/add',
  async ({ name, order }: any) => {
    const response = await baseApi.post('/lists', { name, order });
    return { ...response.data, name, order };
  }
);

export const listSlice = createSlice({
  name: 'lists',
  initialState: [],
  reducers: {
    reorderList: (state: any, action: any) => {
      const { payload } = action;
      if (payload?.length > 0) {
        const orderedList = payload.sort((a: any, b: any) => (a.order > b.order) ? 1 : -1)
        state = [...orderedList];
      }
      return state;
    }
  },
  extraReducers: (builder) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    builder.addCase(getAllLists.fulfilled, (state: any, action: any) => {
      const { payload } = action;
      if (payload?.length > 0) {
        const orderedList = payload.sort((a: any, b: any) => (a.order > b.order) ? 1 : -1)
        state = [...orderedList];
      }
      return state;
    }),
    builder.addCase(addList.fulfilled, (state: any, action: any) => {
      const { payload } = action
      if (payload?.id) {
        state = [...state, { ...payload, _id: payload?.id }];
      }
      return state;
    })
  },
});

export const selectLists = (state: any) => state.lists;

export const { reorderList } = listSlice.actions;

export default listSlice.reducer;
