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
      const { source, destination } = action as any;
    
      // dropped outside the list
      if (!destination) {
        return;
      }
      const sourceIndex = +source.droppableId;
      const destinationIndex = +destination.droppableId;
  
      if (sourceIndex === destinationIndex) {
        const items = reorder(state[sourceIndex], source.index, destination.index);
        const newState = [...state];
        newState[sourceIndex] = items;
        state = newState;
      } else {
        const result = move(state[sourceIndex], state[destinationIndex], source, destination);
        const newState = [...state];
        newState[sourceIndex] = result[sourceIndex];
        newState[destinationIndex] = result[destinationIndex];
  
        state = newState.filter(group => group.length);
      }
    }
  },
  extraReducers: (builder) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    builder.addCase(getAllLists.fulfilled, (state: any, action: any) => {
      const { payload } = action;
      if (payload?.length > 0) {
        state = [...payload];
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

// Action creators are generated for each case reducer function
export const { reorderList } = listSlice.actions;

export default listSlice.reducer;