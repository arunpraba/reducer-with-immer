import { useImmerReducer } from "use-immer";
import AddTask from "./AddTask.js";
import TaskList from "./TaskList.js";

const initialState = { tasks: [] };

const ACTION_TYPES = {
  ADDED: "ADDED",
  CHANGED: "CHANGED",
  DELETED: "DELETED",
  RESET: "RESET",
  COMPLETE: "COMPLETE"
};

function tasksReducer(draft, action) {
  switch (action.type) {
    case ACTION_TYPES.ADDED: {
      draft.tasks.push({
        id: Date.now(),
        text: action.text,
        done: false
      });
      break;
    }
    case ACTION_TYPES.CHANGED: {
      const index = draft.tasks.findIndex((task) => task.id === action.task.id);
      draft.tasks[index] = action.task;
      break;
    }
    case ACTION_TYPES.DELETED: {
      return draft.tasks.filter((task) => task.id !== action.id);
    }

    case ACTION_TYPES.RESET: {
      draft.tasks = [];
      break;
    }
    case ACTION_TYPES.COMPLETE: {
      draft.tasks = draft.tasks.map((task) => {
        return {
          ...task,
          done: true
        };
      });
      break;
    }

    default: {
      throw Error("Unknown action: ", action.type);
    }
  }
}

export default function TaskApp() {
  const [{ tasks }, dispatch] = useImmerReducer(tasksReducer, initialState);

  console.log({ tasks });
  function handleAddTask(text) {
    dispatch({
      type: ACTION_TYPES.ADDED,
      text: text
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: ACTION_TYPES.CHANGED,
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: ACTION_TYPES.DELETED,
      id: taskId
    });
  }

  function handleReset() {
    dispatch({
      type: ACTION_TYPES.RESET
    });
  }

  function handleComplete() {
    dispatch({
      type: ACTION_TYPES.COMPLETE
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <button type="button" onClick={handleReset}>
        Reset
      </button>
      <button type="button" onClick={handleComplete}>
        Complete
      </button>
      <hr />
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}
