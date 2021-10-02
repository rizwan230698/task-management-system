import "./style.css";

const Checkbox = ({ value }) => (
  <div className="round">
    <input type="checkbox" id="checkbox" checked={value} />
    <label htmlFor="checkbox"></label>
  </div>
);

export default Checkbox;
