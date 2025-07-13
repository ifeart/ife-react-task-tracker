import { Container, Typography, Grid, Box, Button } from "@mui/material";
import TaskItem, { type Task } from "./TaskItem";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { taskDBService } from "../data/database/db";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import TaskEditModal from "./TaskEditModal";

const testTasks: Task[] = [
  {
    id: 1,
    title: "Тест Lorem",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(),
    category: "test",
    status: "todo",
    priority: "low",
  },
  {
    id: 2,
    title: "Исправление стилей в Safari",
    description: "Кнопки отображаются некорректно в браузере Safari",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: "bug",
    status: "in_progress",
    priority: "medium",
  },
  {
    id: 3,
    title: "Мелкие опечатки в интерфейсе",
    description: "Исправить орфографические ошибки в подсказках",
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(),
    category: "bug",
    status: "done",
    priority: "low",
  },
  {
    id: 4,
    title: "Темная тема приложения",
    description: "Реализовать переключение между светлой и темной темами",
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(),
    category: "feature",
    status: "in_progress",
    priority: "high",
  },
  {
    id: 5,
    title: "Экспорт задач в PDF",
    description: "Добавить возможность экспорта списка задач в PDF формат",
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(),
    category: "feature",
    status: "todo",
    priority: "medium",
  },
  {
    id: 6,
    title: "Уведомления по email",
    description: "Отправка напоминаний о приближающихся дедлайнах",
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(),
    category: "feature",
    status: "done",
    priority: "low",
  },
  {
    id: 7,
    title: "API документация",
    description: "Создать подробную документацию для REST API",
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(),
    category: "documentation",
    status: "todo",
    priority: "medium",
  },
  {
    id: 8,
    title: "Руководство пользователя",
    description: "Написать инструкцию по использованию приложения",
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(),
    category: "documentation",
    status: "in_progress",
    priority: "low",
  },
  {
    id: 9,
    title: "Оптимизация компонентов React",
    description: "Рефакторинг компонентов для улучшения производительности",
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(),
    category: "refactor",
    status: "todo",
    priority: "high",
  },
  {
    id: 10,
    title: "Унификация стилей CSS",
    description:
      "Привести все стили к единому стандарту и удалить дублирования",
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(),
    category: "refactor",
    status: "done",
    priority: "medium",
  },
  {
    id: 11,
    title: "E2E тесты для авторизации",
    description: "Написать end-to-end тесты для процесса регистрации и входа",
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(),
    category: "test",
    status: "in_progress",
    priority: "high",
  },
  {
    id: 12,
    title: "Unit тесты для API",
    description: "Покрыть тестами все эндпоинты REST API",
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(),
    category: "test",
    status: "todo",
    priority: "low",
  },
  {
    id: 13,
    title: "Критический баг в авторизации",
    description: "Пользователи не могут войти в систему через Google OAuth",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: "bug",
    status: "todo",
    priority: "high",
  },
];

export default function TaskList() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);

  const refreshTasks = async () => {
    const updatedTasks = await taskDBService.getAllTasks();
    setTasks(updatedTasks);
  };

  const deleteAllTasks = async () => {
    await taskDBService.deleteAllTasks();
    await refreshTasks();
  };

  const refreshTestTasks = async () => {
    deleteAllTasks();
    localStorage.setItem("testTasksUsed", "false");
    testTasks.forEach((task) => {
      taskDBService.createTask(task);
    });
    const allTestTasksFromDB = await taskDBService.getAllTasks();
    setTasks(allTestTasksFromDB);
  };

  const handleTaskSave = async (task: Task) => {
    try {
      const newTask = {
        ...task,
        id: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await taskDBService.createTask(newTask);
      await refreshTasks();
      setAddTaskModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    taskDBService.getAllTasks().then(async (tasks) => {
      if (
        tasks.length === 0 &&
        localStorage.getItem("testTasksUsed") !== "true"
      ) {
        testTasks.forEach((task) => {
          taskDBService.createTask(task);
        });

        localStorage.setItem("testTasksUsed", "true");
        const allTestTasksFromDB = await taskDBService.getAllTasks();
        setTasks(allTestTasksFromDB);
      } else {
        setTasks(tasks);
      }
    });
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        ifeTasks - {t("ui.taskTracker")}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t("ui.demoDescription")}
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
        <Button variant="contained" color="primary" onClick={refreshTestTasks}>
          <RefreshIcon />
          {t("ui.refreshTestTasks")}
        </Button>
        <Button variant="contained" color="primary" onClick={deleteAllTasks}>
          <DeleteIcon />
          {t("ui.deleteAllTasks")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setAddTaskModalOpen(true);
          }}
        >
          <AddIcon />
          {t("ui.addTask")}
        </Button>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Grid
          container
          spacing={3}
          sx={{
            maxWidth: 1200,
            justifyContent: "center",
          }}
        >
          {tasks.map((task) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
              key={task.id}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box sx={{ width: "100%", maxWidth: "fit-content" }}>
                <TaskItem task={task} onTaskUpdate={refreshTasks} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <TaskEditModal
        open={addTaskModalOpen}
        onClose={() => setAddTaskModalOpen(false)}
        task={null}
        onSave={handleTaskSave}
      />
    </Container>
  );
}
