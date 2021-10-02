import "./style.css";

const Checkbox = ({ value, onChange }) => (
  <div className="round">
    <input type="checkbox" checked={value} readOnly />
    <label
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
    ></label>
  </div>
);

export default Checkbox;
