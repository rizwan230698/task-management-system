import { useState } from "react";
import { firestore } from "../../firebase";
import Spinner from "../Spinner";
import "./style.css";

const DatePicker = ({ item, setTasks }) => {
  const [value, setValue] = useState(item.deadline);
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async () => {
    if (!value) return;
    try {
      setUpdating(true);
      const db = firestore();
      await db.collection("tasks").doc(item.id).update({ deadline: value });
      setTasks((prev) =>
        prev.map((task) =>
          task.id === item.id ? { ...item, deadline: value } : task
        )
      );
      setUpdating(false);
    } catch (error) {
      setUpdating(false);
      console.log(error);
    }
  };

  return (
    <>
      <input
        type="date"
        value={value}
        min={new Date().toISOString().split("T")[0]}
        max="2024-01-01"
        onChange={(e) => setValue(e.target.value)}
      ></input>
      <button
        onClick={handleSubmit}
        style={{
          marginLeft: 10,
          color: "rgba(0, 120, 250, 1)",
          textDecoration: "underline",
        }}
      >
        {updating ? <Spinner className="sm" /> : "Submit"}
      </button>
    </>
  );
};

export default DatePicker;
