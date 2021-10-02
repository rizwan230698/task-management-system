import { signInWithGoogle } from "../../firebase";
import "./style.css";

const AuthModal = () => {
  return (
    <div className="modal-wrapper">
      <div className="modal">
        <h1 className="modal-heading">Task Manager</h1>
        <button className="google-btn" onClick={signInWithGoogle}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
