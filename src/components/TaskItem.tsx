import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import EventNoteIcon from "@mui/icons-material/EventNote";
import EditIcon from "@mui/icons-material/Edit";
import TaskChip from "./TaskChip";
import { bull } from "../utils/TextHelper";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import TaskEditModal from "./TaskEditModal";
import { taskDBService } from "../data/database/db";

export type TaskCategory =
  | "bug"
  | "feature"
  | "documentation"
  | "refactor"
  | "test";
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: number;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
};

interface TaskItemProps {
  task: Task;
  onTaskUpdate: () => Promise<void>;
}

export default function TaskItem({ task, onTaskUpdate }: TaskItemProps) {
  const { i18n } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleTaskSave = async (updatedTask: Task) => {
    await taskDBService.updateTask(updatedTask);
    setIsEditModalOpen(false);
    await onTaskUpdate();
  };

  const handleTaskDone = async () => {
    await taskDBService.doneTask(task.id);
    await onTaskUpdate();
  };

  const handleTaskDelete = async () => {
    await taskDBService.deleteTask(task.id);
    await onTaskUpdate();
  };

  return (
    <>
      <Card
        sx={{
          width: "100%",
          borderRadius: 3.5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardActionArea
          component={Link}
          to={`/task/${task.id}`}
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <CardContent
            sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
          >
            <Typography variant="h6" sx={{ mb: 1, minHeight: 32 }}>
              {task.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                mb: 1,
                flexGrow: 1,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                textOverflow: "ellipsis",
              }}
            >
              {task.description}
            </Typography>
            {task.dueDate && (
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  mb: 0.7,
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 0,
                  "& svg": {
                    fontSize: "1.2rem",
                    marginRight: "0.2rem",
                    verticalAlign: "middle",
                  },
                }}
              >
                <EventNoteIcon color="primary" />
                {task.dueDate.toLocaleTimeString(i18n.language, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {bull}
                {task.dueDate.toLocaleDateString(i18n.language, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            )}
            <TaskChip task={task} />
          </CardContent>
        </CardActionArea>
        <CardActions sx={{ justifyContent: "space-between", mt: "auto" }}>
          <Button variant="outlined" color="success" onClick={handleTaskDone}>
            <CheckIcon />
          </Button>
          <Button variant="outlined" color="warning" onClick={handleEditClick}>
            <EditIcon />
          </Button>
          <Button variant="outlined" color="error" onClick={handleTaskDelete}>
            <DeleteIcon />
          </Button>
        </CardActions>
      </Card>

      <TaskEditModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={task}
        onSave={handleTaskSave}
      />
    </>
  );
}
