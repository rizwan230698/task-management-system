import { useEffect, useRef, useState } from "react";
import { ReactComponent as CloseIcon } from "../../close-circle.svg";
import { ReactComponent as EditIcon } from "../../edit.svg";
import { firestore } from "../../firebase";
import CommentBox from "../CommentBox";
import DatePicker from "../DatePicker";
import Spinner from "../Spinner";

import "./style.css";

const TaskDetailsModal = ({ item, handleClose, setTasks }) => {
  const [showeditor, setShoweditor] = useState(false);
  const [input, setInput] = useState(item.text);
  const [editing, setEditing] = useState(false);
  const editorRef = useRef();

  useEffect(() => {
    showeditor && editorRef.current.focus();
  }, [showeditor]);

  const handleSubmit = async (e) => {
    if (e.key === "Enter" && input.trim() && !editing) {
      editorRef.current.blur();
      try {
        setEditing(true);
        const db = firestore();
        await db.collection("tasks").doc(item.id).update({ text: input });
        setTasks((prev) =>
          prev.map((task) =>
            task.id === item.id ? { ...task, text: input } : task
          )
        );
        setShoweditor(false);
        setEditing(false);
      } catch (error) {
        console.log(error);
        setEditing(false);
      }
    }
  };

  return (
    <div className="modal-wrapper">
      <div className="modal" style={{ padding: "60px 80px" }}>
        <CloseIcon
          width="40px"
          height="40px"
          className="close-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
        />
        <div className="task-details" style={{ width: 600, height: "80vh" }}>
          {showeditor ? (
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={input}
                ref={editorRef}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleSubmit}
              />
              {editing && (
                <div
                  style={{
                    position: "absolute",
                    left: "-45px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <Spinner className="sm dark" />
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center" }}>
              <h1 className="mr-32 mb-0">{item.text}</h1>
              <EditIcon
                width="20"
                fill="#8C8C8C"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShoweditor(true);
                }}
              />
            </div>
          )}
          <div className="deadline-container">
            <p>Set Deadline:</p>
            <DatePicker item={item} setTasks={setTasks} />
          </div>

          <CommentBox item={item} />
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
