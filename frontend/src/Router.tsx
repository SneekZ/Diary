import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login/Login";
import RegisterPage from "./pages/register/Register";
import DiaryPage from "./pages/diary/Diary";
import { useContext } from "react";
import { UserContext } from "./context/user/UserContext";
import NoteContextProvider from "./context/note/NoteContextProvider";

const App = () => {
  const { loggedIn } = useContext(UserContext);
  if (!loggedIn)
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    );
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/diary"
          element={
            <NoteContextProvider>
              <DiaryPage />
            </NoteContextProvider>
          }
        />
        <Route path="*" element={<div>123</div>} />
      </Routes>
    </Router>
  );
};

export default App;
