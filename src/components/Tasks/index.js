import { useState, useMemo, useContext, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { ReactComponent as DownArrow } from "../../arrow.svg";
import { AuthContext } from "../../context/UserProvider";
import TaskItem from "../TaskItem";
import { firestore } from "../../firebase";
import Spinner from "../Spinner";
import TaskDetailsModal from "../TaskDetailModal";
import "./style.css";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [creatingTask, setCreatingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const { currentUser, removeUser } = useContext(AuthContext);
  const inputRef = useRef();

  useEffect(() => {
    (async () => {
      const db = firestore();
      const tasks = [];
      db.collection("tasks")
        .where("email", "==", currentUser.email)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            tasks.push(doc.data());
          });

          setTasks(tasks);
          setLoading(false);
          inputRef.current.focus();
        });
    })();
  }, [currentUser.email]);

  const getFilteredTasks = () => {
    if (!filter) return tasks;
    if (filter === "active") {
      return tasks.filter((task) => !task.done);
    }
    return tasks.filter((task) => task.done);
  };

  const handleSubmit = async (e) => {
    if (e.key !== "Enter" || !input.trim() || creatingTask) return;
    setCreatingTask(true);
    const id = uuidv4();
    const newTask = {
      id,
      text: input,
      done: false,
      email: currentUser.email, //task is related to user via email
      createdAt: new Date(),
    };
    try {
      const db = firestore();
      await db.collection("tasks").doc(id).set(newTask);
      setInput("");
      setTasks((prev) => [newTask, ...prev]);
      setCreatingTask(false);
    } catch (error) {
      setCreatingTask(false);
      console.log(error);
    }
  };

  const tasksLeft = useMemo(() => {
    return tasks.filter((item) => !item.done).length;
  }, [tasks]);

  return (
    <>
      <div className="container">
        <h1>todos</h1>
        <div className="tasks-container">
          <div className="input-container">
            <DownArrow />
            <input
              type="text"
              ref={inputRef}
              placeholder="What needs to be done?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleSubmit}
            />

            {creatingTask && <Spinner className="sm" />}
          </div>

          <div style={{ boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.1)" }}>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {loading ? (
                <Spinner />
              ) : tasks.length ? (
                getFilteredTasks().map((item) => (
                  <TaskItem
                    key={item.id}
                    item={item}
                    setTasks={setTasks}
                    handleClick={() => setSelectedTask(item.id)}
                  />
                ))
              ) : (
                <p style={{ margin: "60px auto", color: "#4e4e4e" }}>
                  No tasks pending!
                </p>
              )}
            </div>

            {!!tasks.length && (
              <div className="info-ctas-container">
                <p className="info">
                  {tasksLeft} {tasksLeft > 1 ? "items" : "item"} left
                </p>
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
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
            )}
          </div>
        </div>

        <button className="google-btn log-out-btn" onClick={removeUser}>
          Log out
        </button>
      </div>
      {!!selectedTask && (
        <TaskDetailsModal
          item={tasks.find((item) => item.id === selectedTask)}
          handleClose={() => setSelectedTask(null)}
          setTasks={setTasks}
        />
      )}
    </>
  );
};

export default Tasks;
