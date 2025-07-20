import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/App.css";
import "./styles/fonts.css";
import Header from "../widgets/Header";
import MainPage from "@pages/Main";
import TaskDetailPage from "@pages/TaskDetail";
import LoaderCircle from "@shared/ui/loaderCircle";
import LoginPage from "@pages/Login";
import ProtectedRouter from "@/shared/api/ProtectedRouter";

function App() {
  return (
    <BrowserRouter>
      <LoaderCircle />
      <Header />
      <Routes>
        <Route path="/" element={<ProtectedRouter children={<MainPage />} />} />
        <Route
          path="/task/:id"
          element={<ProtectedRouter children={<TaskDetailPage />} />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
