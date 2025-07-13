import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Task } from "../components/TaskItem";
import { taskDBService } from "../data/database/db";
import { Box, Button, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import TaskChip from "../components/TaskChip";
import i18n from "../data/i18n/i18n";
import { bull } from "../utils/TextHelper";
import EventNoteIcon from "@mui/icons-material/EventNote";
import TaskEditModal from "../components/TaskEditModal";

export default function TaskDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [task, setTask] = useState<Task | undefined>(undefined);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const navigate = useNavigate();

  const fetchTask = async () => {
    const task = await taskDBService.getTask(Number(id));
    setTask(task);
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleTaskDone = async (taskId: number) => {
    await taskDBService.doneTask(taskId);
    await fetchTask();
  };

  const handleTaskDelete = async (taskId: number) => {
    await taskDBService.deleteTask(taskId);
    navigate("/");
  };

  const handleTaskUpdate = async (updatedTask: Task) => {
    await taskDBService.updateTask(updatedTask);
    await fetchTask();
    setEditModalOpen(false);
    navigate("/");
  };

  return (
    <>
      {task ? (
        <Container
          maxWidth="md"
          sx={{ py: 3, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Typography variant="h4" component="h1">
            {task.title}
          </Typography>
          {task.dueDate && (
            <Typography
              variant="body2"
              title={t("ui.dueDate")}
              sx={{
                fontSize: "1.2rem",
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
              {task.dueDate ? (
                <>
                  <EventNoteIcon
                    sx={{ fontSize: "1.4rem", mr: 1, color: "text.secondary" }}
                  />
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
                </>
              ) : (
                t("ui.noDueDate")
              )}
            </Typography>
          )}
          <TaskChip task={task} />

          <Typography
            variant="body1"
            color="text.secondary"
            gutterBottom
            sx={{ fontSize: "1.2rem" }}
          >
            {task.description || t("ui.noDescription")}
          </Typography>
          <Typography variant="body1" color="text.primary">
            {t("TaskDetailPage.createdAt")}{" "}
            {task.createdAt.toLocaleString(i18n.language, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
          <Typography variant="body1" color="text.primary">
            {t("TaskDetailPage.updatedAt")}{" "}
            {task.updatedAt.toLocaleString(i18n.language, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              color="success"
              onClick={() => handleTaskDone(task.id)}
              disabled={task.status === "done"}
            >
              {t("ui.doneTask")}
            </Button>
            <Button
              variant="outlined"
              color="warning"
              onClick={() => setEditModalOpen(true)}
            >
              {t("ui.editTask")}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleTaskDelete(task.id)}
            >
              {t("ui.deleteTask")}
            </Button>
          </Box>
        </Container>
      ) : (
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t("ui.taskNotFound")}
          </Typography>
        </Container>
      )}

      <TaskEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        task={task || null}
        onSave={handleTaskUpdate}
      />
    </>
  );
}
