import React from 'react';
import { Alert, AppBar, Box, Button, Card, CardActions, CardContent, Toolbar, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import classNames from 'classnames';
import NewListDialog from './components/list/NewList';
import NewTaskDialog from './components/task/NewTask';
import DeleteTaskDialog from './components/task/DeleteTask';
import { reorderList, getAllLists, selectLists } from './reducers/listSlice';
import { deleteTask, editTask, getAllTasks, selectTasks } from './reducers/taskSlice';
import { move, reorder } from './utils';

function App() {
  const dispatch = useDispatch();
  const [newListOpen, setNewListOpen] = React.useState(false);
  const [newTaskOpen, setNewTaskOpen] = React.useState(false);
  const [taskEditOrNew, setTaskEditOrNew] = React.useState('new');
  const [deleteTaskOpen, setDeleteTaskOpen] = React.useState(false);
  const [taskToChange, setTaskToChange] = React.useState<any>(null);
  const lists = useSelector(selectLists);
  const tasks = useSelector(selectTasks);

  React.useEffect(() => {
    dispatch(getAllLists() as any);
    dispatch(getAllTasks() as any);
  }, []);

  const handleDeleteTask = async () => {
    const delTask = await dispatch(deleteTask({ id: taskToChange?._id }) as any);
    if (delTask?.payload?.status === 200) {
      setDeleteTaskOpen(false);
      setTaskToChange(null);
    }
  }

  const onDragEnd = async (result: any) => {
    console.log('drag end', result);
    const { source, destination, draggableId } = result;
  
    // dropped outside the list
    if (!destination) {
      return;
    }
    if(destination?.droppableId !== source?.droppableId) {
      const destinationList = lists[Number(destination?.droppableId)]?._id;
      const task = tasks?.find((task: any) => task?._id === draggableId);
      if (task?._id === draggableId) {
        await dispatch(editTask({ 
          id: task?._id,
          title: task?.title,
          dueDate: task?.dueDate,
          priority: task?.priority,
          list: destinationList,
          order: destination.index,
        }) as any);
      }
    }
    
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Button
            variant='outlined'
            color='inherit'
            onClick={() => setNewListOpen(true)}
          >
            New List
          </Button>
          <Button
            disabled={lists?.length === 0}
            variant='outlined'
            color='inherit'
            onClick={() => {
              setNewTaskOpen(true);
              setTaskEditOrNew('new');
            }}
          >
            New Task
          </Button>
        </Toolbar>
      </AppBar>
      <Box className="list-container">
        <DragDropContext onDragEnd={onDragEnd}>
          {lists && lists?.map((listElement: any, listIndex: number) => (
            <Box
              key={`list_item_${listIndex}`}
              className="list-item-container"
            >
              <Box className='list-title'>
                <Typography variant='h6'>{listElement?.name}</Typography>
              </Box>
              <Droppable key={`list_${listIndex}`} droppableId={`${listIndex}`}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    className={classNames({
                      "list-content": true,
                      "dragging-over": snapshot.isDraggingOver
                    })}
                    {...provided.droppableProps}
                  >
                    {
                      tasks && tasks?.filter((taskElement: any) => taskElement?.list === listElement?._id).map((taskElement: any, taskIndex: any) => (
                        <Draggable
                          key={taskElement._id}
                          draggableId={taskElement._id}
                          index={taskIndex}
                        >
                          {(provided, snapshot) => (
                            <Box
                              ref={provided.innerRef}
                              className={classNames({
                                "task-container": true,
                                "dragging": snapshot.isDragging
                              })
                            }
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Card>
                                <CardContent>
                                  <Typography>
                                    {taskElement?.title}
                                  </Typography>
                                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    due date: {new Date(taskElement?.dueDate).toLocaleDateString()}
                                  </Typography>
                                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Priority:
                                  </Typography>
                                  {taskElement?.priority === 0 && (<Alert severity="error">High</Alert>)}
                                  {taskElement?.priority === 1 && (<Alert severity="warning">Medium</Alert>)}
                                  {taskElement?.priority === 2 && (<Alert severity="success">Low</Alert>)}
                                </CardContent>
                                <CardActions>
                                  <Button size="small" onClick={() => {
                                    setTaskEditOrNew('edit');
                                    setTaskToChange(taskElement);
                                    setNewTaskOpen(true);
                                  }}>Edit</Button>
                                  <Button size="small" onClick={() => {
                                    setTaskToChange(taskElement);
                                    setDeleteTaskOpen(true);
                                  }}>Delete</Button>
                                </CardActions>
                              </Card>
                            </Box>
                          )}
                          
                        </Draggable>
                      ))
                    }
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          ))}
        </DragDropContext>
        <NewListDialog
          open={newListOpen}
          onClose={() => setNewListOpen(false)}
          lists={lists}
        />
        <NewTaskDialog
          open={newTaskOpen}
          operation={taskEditOrNew}
          selectedTask={taskToChange}
          tasks={tasks}
          onClose={() => setNewTaskOpen(false)}
          lists={lists}
        />
        <DeleteTaskDialog
          open={deleteTaskOpen}
          onClose={() => {
            setDeleteTaskOpen(false);
            setTaskToChange(null)}
          }
          onSave={() => handleDeleteTask()}
        />
      </Box>
    </div>
  );
}

export default App;
