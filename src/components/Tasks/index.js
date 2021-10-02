import { useState, useMemo } from "react";
import { ReactComponent as DownArrow } from "../../arrow.svg";
import TaskItem from "../TaskItem";
import "./style.css";

const initialState = [
  {
    id: 1,
    text: "Milk",
    done: false,
  },
  {
    id: 2,
    text: "Water",
    done: false,
  },
];

const Tasks = () => {
  const [tasks, setTasks] = useState(initialState);
  const [filter, setFilter] = useState("");
  const [input, setInput] = useState("");

  const handleClick = (item) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === item.id
          ? {
              ...task,
              done: !task.done,
            }
          : task
      )
    );
  };

  const getTasks = () => {
    if (!filter) return tasks;
    if (filter === "active") {
      return tasks.filter((task) => !task.done);
    }
    return tasks.filter((task) => task.done);
  };

  const handleSubmit = (e) => {
    if (e.key === "Enter" && input.trim()) {
      const newTask = {
        id: Math.floor(Math.random() * 1000),
        text: input,
        done: false,
      };
      setInput("");
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const tasksLeft = useMemo(() => {
    return tasks.filter((item) => !item.done).length;
  }, [tasks]);

  return (
    <div className="container">
      <h1>todos</h1>
      <div className="tasks-container">
        <div className="input-container">
          <DownArrow />
          <input
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleSubmit}
          />
        </div>

        <div style={{ boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.1)" }}>
          <div>
            {getTasks().map((item) => (
              <TaskItem key={item.id} item={item} handleClick={handleClick} />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              padding: "10px 20px",
              position: "relative",
            }}
          >
            <p className="info">
              {tasksLeft} {tasksLeft > 1 ? "items" : "item"} left
            </p>
            <div style={{ display: "flex", flex: 1, justifyContent: "center" }}>
              <button
                onClick={() => setFilter("")}
                className={`${!filter && "focus"}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`${filter === "active" && "focus"}`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`${filter === "completed" && "focus"}`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
