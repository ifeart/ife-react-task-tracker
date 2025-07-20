import { Navigate } from "react-router-dom";
import { taskStore } from "@/entities/task/model/store";

const ProtectedRouter = ({ children }: { children: React.ReactNode }) => {
  if (!taskStore.ifLoggedIn()) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRouter;
