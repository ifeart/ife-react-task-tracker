import { Container, Typography, Grid, Box, Button } from "@mui/material";
import TaskItem from "./TaskItem";
import type { Task } from "@entities/task/model/types";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import TaskEditModal from "./TaskEditModal";
import DeleteTaskDialog from "./DeleteTaskDialog";
import { observer } from "mobx-react-lite";
import { taskStore } from "@entities/task/model";

const TaskList = observer(() => {
  const { t } = useTranslation();
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);

  const refreshTestTasks = async () => {
    try {
      await taskStore.createTestTasks();
      await taskStore.fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAllTasks = async () => {
    try {
      await taskStore.deleteAllTasks();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteAllDialogOpen(false);
    }
  };

  const handleTaskSave = async (task: Task) => {
    try {
      const newTask = {
        ...task,
        id: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await taskStore.createTask(newTask);
      setAddTaskModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const initTasks = async () => {
      try {
        await taskStore.fetchTasks();

        if (
          taskStore.tasks.length === 0 &&
          localStorage.getItem("testTasksUsed") !== "true"
        ) {
          await taskStore.createTestTasks();

          localStorage.setItem("testTasksUsed", "true");
          await taskStore.fetchTasks();
        }
      } catch (error) {
        console.error(error);
      }
    };

    initTasks();
  }, []);

  return (
    <Container
      maxWidth="xl"
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        ifeTasks - {t("ui.taskTracker")}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "start",
          mb: 3,
          alignItems: "start",
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          sx={{
            "&:hover": {
              borderColor: "info.main",
              color: "info.main",
            },
          }}
          onClick={refreshTestTasks}
          disabled={taskStore.loading}
        >
          <RefreshIcon />
          {t("ui.refreshTestTasks")}
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          sx={{
            "&:hover": {
              borderColor: "error.main",
              color: "error.main",
            },
          }}
          onClick={() => setDeleteAllDialogOpen(true)}
          disabled={taskStore.loading}
        >
          <DeleteIcon />
          {t("ui.deleteAllTasks")}
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          sx={{
            "&:hover": {
              borderColor: "success.main",
              color: "success.main",
            },
          }}
          onClick={() => setAddTaskModalOpen(true)}
          disabled={taskStore.loading}
        >
          <AddIcon />
          {t("ui.addTask")}
        </Button>
      </Box>

      <Grid
        container
        spacing={3}
        sx={{
          maxWidth: 1200,
          width: "100%",
        }}
      >
        {taskStore.sortedTasks.map((task) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={task.id}>
            <Box
              sx={{
                width: "100%",
                maxWidth: 345,
                minWidth: { xs: "100%", sm: 275 },
                mx: "auto",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TaskItem
                task={task}
                onTaskUpdate={async () => {
                  await taskStore.fetchTasks();
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      <TaskEditModal
        open={addTaskModalOpen}
        onClose={() => setAddTaskModalOpen(false)}
        task={null}
        onSave={handleTaskSave}
      />

      <DeleteTaskDialog
        open={deleteAllDialogOpen}
        onClose={() => setDeleteAllDialogOpen(false)}
        onConfirm={handleDeleteAllTasks}
        isMultiple
      />
    </Container>
  );
});

export default TaskList;
