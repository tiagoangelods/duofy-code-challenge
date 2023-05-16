import { configureStore } from '@reduxjs/toolkit';
import listReducer from './reducers/listSlice';
import taskReducer from './reducers/taskSlice';

export default configureStore({
  reducer: {
    lists: listReducer,
    tasks: taskReducer
  }
});
