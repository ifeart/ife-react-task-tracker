import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Task } from "@entities/task/model/types";
import { Box, Button, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import TaskChip from "@widgets/TaskChip";
import i18n from "@shared/config/i18n/index";
import { bull } from "@shared/ui/TextHelper";
import EventNoteIcon from "@mui/icons-material/EventNote";
import TaskEditModal from "@widgets/TaskEditModal";
import DeleteTaskDialog from "@widgets/DeleteTaskDialog";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LoaderCircle from "@shared/ui/loaderCircle";
import { observer } from "mobx-react-lite";
import { taskStore } from "@entities/task/model";

const TaskDetailPage = observer(() => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [task, setTask] = useState<Task | null>(null);
  const navigate = useNavigate();

  const fetchTask = async () => {
    const fetchedTask = await taskStore.fetchTaskById(String(id));
    setTask(fetchedTask || null);
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleTaskDone = async (taskId: string) => {
    try {
      await taskStore.markTaskAsDone(taskId);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleTaskDelete = async () => {
    if (!task) return;

    try {
      await taskStore.deleteTask(task.id);
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      await taskStore.updateTask(updatedTask);
      await fetchTask();
      setEditModalOpen(false);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {taskStore.loading ? (
        <LoaderCircle />
      ) : task ? (
        <Container
          maxWidth="md"
          sx={{
            py: 3,
            display: "flex",
            backgroundColor: "background.paper",
            flexDirection: "column",
            gap: 2,
            borderRadius: 3.5,
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/")}
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: "fit-content",
            }}
          >
            <ArrowBackIcon />
            {t("ui.back")}
          </Button>
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
                  {new Date(task.dueDate).toLocaleTimeString(i18n.language, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {bull}
                  {new Date(task.dueDate).toLocaleDateString(i18n.language, {
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
            {new Date(task.createdAt).toLocaleString(i18n.language, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
          <Typography variant="body1" color="text.primary">
            {t("TaskDetailPage.updatedAt")}{" "}
            {new Date(task.updatedAt).toLocaleString(i18n.language, {
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
              onClick={() => setDeleteDialogOpen(true)}
            >
              {t("ui.deleteTask")}
            </Button>
          </Box>
        </Container>
      ) : (
        <Container maxWidth="md" sx={{ py: 3 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/")}
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: "fit-content",
            }}
          >
            <ArrowBackIcon />
            {t("ui.back")}
          </Button>
          <Typography variant="h4" component="h1" gutterBottom>
            {t("ui.taskNotFound")}
          </Typography>
        </Container>
      )}

      <TaskEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        task={task}
        onSave={handleTaskUpdate}
      />

      <DeleteTaskDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleTaskDelete}
        taskTitle={task?.title}
      />
    </>
  );
});

export default TaskDetailPage;
