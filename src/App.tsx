import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./fonts.css";
import AppHeader from "./components/AppHeader";
import MainPage from "./pages/MainPage";
import TaskDetailPage from "./pages/TaskDetailPage";

function App() {
  return (
    <BrowserRouter>
      <AppHeader />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/task/:id" element={<TaskDetailPage />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
