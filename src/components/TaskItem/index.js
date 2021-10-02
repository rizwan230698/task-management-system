import Checkbox from "../Checkbox";
import "./style.css";

const TaskItem = ({ item, handleClick }) => (
  <div className="task-item" key={item.id} onClick={() => handleClick(item)}>
    <Checkbox value={item.done} />
    <p>{item.text}</p>
  </div>
);

export default TaskItem;
