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
import { bull } from "@shared/ui/TextHelper";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useState } from "react";
import TaskEditModal from "./TaskEditModal";
import DeleteTaskDialog from "./DeleteTaskDialog";
import type { Task } from "@entities/task/model/types";
import { taskStore } from "@entities/task/model";

interface TaskItemProps {
  task: Task;
  onTaskUpdate: () => Promise<void>;
}

export default function TaskItem({ task, onTaskUpdate }: TaskItemProps) {
  const { i18n } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleTaskSave = async (updatedTask: Task) => {
    await taskStore.updateTask(updatedTask);
    setIsEditModalOpen(false);
    await onTaskUpdate();
  };

  const handleTaskDone = async () => {
    await taskStore.markTaskAsDone(task.id);
    await onTaskUpdate();
  };

  const handleTaskDelete = async () => {
    try {
      await taskStore.deleteTask(task.id);
      await onTaskUpdate();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          width: "300px",
          height: "100%",
          minHeight: "290px",
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
            gap: "10px",
            flexDirection: "column",
            alignItems: "stretch",
            height: "100%",
          }}
        >
          <CardContent
            sx={{
              flexGrow: 1,
              gap: "10px",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                textOverflow: "ellipsis",
              }}
            >
              {task.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
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
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 0,
                  "& svg": {
                    fontSize: "1.2rem",
                    marginRight: "0.4rem",
                    verticalAlign: "middle",
                  },
                }}
              >
                <EventNoteIcon color="inherit" />
                {new Date(task.dueDate).toLocaleDateString(i18n.language, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {bull}
                {new Date(task.dueDate).toLocaleTimeString(i18n.language, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            )}
            <TaskChip task={task} />
          </CardContent>
        </CardActionArea>
        <CardActions sx={{ justifyContent: "space-between", mt: "auto" }}>
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            fullWidth={true}
            sx={{
              "&:hover": {
                borderColor: "success.main",
                color: "success.main",
              },
            }}
            onClick={handleTaskDone}
            disabled={task.status === "done"}
          >
            <CheckIcon />
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            fullWidth={true}
            sx={{
              "&:hover": {
                borderColor: "warning.main",
                color: "warning.main",
              },
            }}
            onClick={handleEditClick}
          >
            <EditIcon />
          </Button>
          <Button
            size="small"
            fullWidth={true}
            variant="outlined"
            color="inherit"
            sx={{
              "&:hover": {
                borderColor: "error.main",
                color: "error.main",
              },
            }}
            onClick={() => setDeleteDialogOpen(true)}
          >
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

      <DeleteTaskDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleTaskDelete}
        taskTitle={task.title}
      />
    </>
  );
}
