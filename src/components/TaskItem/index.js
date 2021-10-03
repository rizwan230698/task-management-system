import { useState } from "react";
import Checkbox from "../Checkbox";
import { ReactComponent as CrossIcon } from "../../close-circle.svg";
import { firestore } from "../../firebase";
import Spinner from "../Spinner";
import "./style.css";
import { deleteCommentsAndFiles } from "../../utils";

const TaskItem = ({ item, setTasks, handleClick }) => {
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const db = firestore();
      await db.collection("tasks").doc(id).delete();
      setTasks((prev) => prev.filter((item) => item.id !== id));
      setDeleting(false);
      //delete comments and files as well
      deleteCommentsAndFiles(id);
    } catch (error) {
      setDeleting(false);
      console.log(error);
    }
  };

  const handleChange = async (item) => {
    try {
      setEditing(true);
      const db = firestore();
      await db.collection("tasks").doc(item.id).update({ done: !item.done });

      setTasks((prev) =>
        prev.map((task) =>
          task.id === item.id
            ? {
                ...task,
                done: !item.done,
              }
            : task
        )
      );
      setEditing(false);
    } catch (error) {
      setEditing(false);
      console.log(error);
    }
  };

  return (
    <div className="task-item" onClick={handleClick}>
      <div style={{ width: 30, marginRight: 10 }}>
        {editing ? (
          <Spinner className="sm" />
        ) : (
          <Checkbox
            id={item.id}
            value={item.done}
            onChange={() => handleChange(item)}
          />
        )}
      </div>
      <p style={{ marginRight: "auto" }}>{item.text}</p>
      {deleting ? (
        <Spinner className="sm" />
      ) : (
        <CrossIcon
          width="24px"
          height="24px"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(item.id);
          }}
        />
      )}
    </div>
  );
};

export default TaskItem;
