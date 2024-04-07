import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { nanoid } from "nanoid";
import { useState, useRef, useEffect } from "react";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}


const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};
const FILTER_NAMES = Object.keys(FILTER_MAP);


function App(props) {

  const geoFindMe = () => {
    if (!navigator.geolocation) {
    console.log("Geolocation is not supported by your browser");
    } else {
    console.log("Locating...");
    navigator.geolocation.getCurrentPosition(success, error);
    }
    };
    const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude, longitude);
    console.log(`Latitude: ${latitude}°, Longitude: ${longitude}°`);
    console.log(`Try here: https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`);
    locateTask(lastInsertedId, {
    latitude: latitude,
    longitude: longitude,
    error: "", //这里可以稍作增加功能
    });
    };
    const error = () => {
    console.log("Unable to retrieve your location");
    };

  
  const [filter, setFilter] = useState("All");
  const [tasks, setTasks] = useState(props.tasks);
  const [lastInsertedId, setLastInsertedId] = useState("");

  function editTask(id, newName) {
  const editedTaskList = tasks.map((task) => {
  
    if (id === task.id) {
      
      return { ...task, name: newName };
    }
    
    return task;
  });
  setTasks(editedTaskList);
  localStorage.setItem('tasks',JSON.stringify(editedTaskList));
}

function locateTask(id, location) {
  console.log("locate Task", id, " before");
  console.log(location, tasks);
  const locatedTaskList = tasks.map((task) => {
  
  if (id === task.id) {
  
  return { ...task, location: location };
  }
  return task;
  });
  console.log(locatedTaskList);
  setTasks(locatedTaskList);
  localStorage.setItem('tasks',JSON.stringify(locatedTaskList));
  }
  

  // function addTask(name) {
  //   const newTask = { id: `todo-${nanoid()}`, name, completed: false };
  //   setTasks([...tasks, newTask]);
  //   localStorage.setItem('tasks',JSON.stringify([...tasks, newTask]));
  // }
  function addTask(name) {
    const id = "todo-" + nanoid();
    const newTask = {
    id: id,
    name: name,
    completed: false,
    location: { latitude: "##", longitude: "##", error: "##" },
    };
    setLastInsertedId(id);
    setTasks([...tasks, newTask]);
    localStorage.setItem('tasks',JSON.stringify([...tasks, newTask]));
    }
  
  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
 
      if (id === task.id) {
        
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
    localStorage.setItem('tasks',JSON.stringify(updatedTasks));
  }


  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
    localStorage.setItem('tasks',JSON.stringify(remainingTasks));
  }
  
  function photoedTask(id) {
    console.log("photoedTask", id);
    const photoedTaskList = tasks.map((task) => {
      if (id === task.id) {
        
        return { ...task, photo: true };
        }
        return task;
        });
        console.log(photoedTaskList);
        setTasks(photoedTaskList); 
        }
  
  
  const taskList = tasks
  .filter(FILTER_MAP[filter])
  .map((task) => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      location={task.location}
      toggleTaskCompleted={toggleTaskCompleted}
      photoedTask={photoedTask}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);
  useEffect(() => {
    if (tasks.length < prevTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  
  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));
  
  
  
  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;
  
  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} geoFindMe={geoFindMe}/>
      <div className="filters btn-group stack-exception">
      {filterList}

      </div>

      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
  {headingText}
</h2>


      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}

export default App;