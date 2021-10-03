import { useContext, useEffect } from "react";
import { AuthContext, AuthProvider } from "./context/UserProvider";
import Tasks from "./components/Tasks/";
import { auth } from "./firebase";
import AuthModal from "./components/AuthModal";

function App() {
  const { currentUser, setUser } = useContext(AuthContext);

  useEffect(() => {
    auth.onAuthStateChanged((user) => setUser(user));
  }, [setUser]);

  return <>{currentUser ? <Tasks /> : <AuthModal />}</>;
}

const AppWithAuthProvider = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuthProvider;
