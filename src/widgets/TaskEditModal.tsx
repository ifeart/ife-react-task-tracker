import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type {
  Task,
  TaskCategory,
  TaskStatus,
  TaskPriority,
} from "@entities/task/model/types";

interface TaskEditModalProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (updatedTask: Task) => void;
}

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 600 },
  maxHeight: "90vh",
  overflow: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

export default function TaskEditModal({
  open,
  onClose,
  task,
  onSave,
}: TaskEditModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<Task>>({});

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: "feature",
        status: "todo",
        priority: "low",
        dueDate: undefined,
      });
    }
  }, [task]);

  const handleSave = () => {
    if (!formData.title) return;

    // if (task) {
    const updatedTask: Task = {
      id: task?.id || "",
      title: formData.title,
      description: formData.description || "",
      category: formData.category || "feature",
      status: formData.status || "todo",
      priority: formData.priority || "low",
      createdAt: task?.createdAt || new Date(),
      dueDate: formData?.dueDate ? formData.dueDate : undefined,
      updatedAt: new Date(),
    };

    onSave(updatedTask);
    onClose();
  };

  const handleInputChange = (field: keyof Task, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDateForInput = (date?: Date) => {
    if (!date) return "";
    return date.toISOString().slice(0, 16);
  };

  const parseDateFromInput = (dateString: string) => {
    return dateString ? new Date(dateString) : undefined;
  };

  // if (!task) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" component="h2">
            {task ? t("ui.editTask") : t("ui.addTask")}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Stack spacing={3}>
          <TextField
            fullWidth
            label={t("task.title")}
            value={formData.title || ""}
            onChange={(e) => handleInputChange("title", e.target.value)}
            required
          />

          <TextField
            fullWidth
            label={t("task.description")}
            value={formData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            multiline
            rows={3}
          />

          <TextField
            fullWidth
            label={t("task.dueDate")}
            type="datetime-local"
            value={formatDateForInput(formData.dueDate)}
            onChange={(e) =>
              handleInputChange("dueDate", parseDateFromInput(e.target.value))
            }
            InputLabelProps={{
              shrink: true,
              sx: {
                "& .MuiSvgIcon-root": {
                  color: "text.primary",
                },
              },
            }}
          />

          <FormControl fullWidth>
            <InputLabel>{t("task.category")}</InputLabel>
            <Select
              required
              value={formData.category || ""}
              label={t("task.category")}
              onChange={(e) =>
                handleInputChange("category", e.target.value as TaskCategory)
              }
            >
              <MenuItem value="bug">{t("category.bug")}</MenuItem>
              <MenuItem value="feature">{t("category.feature")}</MenuItem>
              <MenuItem value="documentation">
                {t("category.documentation")}
              </MenuItem>
              <MenuItem value="refactor">{t("category.refactor")}</MenuItem>
              <MenuItem value="test">{t("category.test")}</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>{t("task.priority")}</InputLabel>
            <Select
              required
              value={formData.priority || ""}
              label={t("task.priority")}
              onChange={(e) =>
                handleInputChange("priority", e.target.value as TaskPriority)
              }
            >
              <MenuItem value="low">{t("priority.low")}</MenuItem>
              <MenuItem value="medium">{t("priority.medium")}</MenuItem>
              <MenuItem value="high">{t("priority.high")}</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            {/* <InputLabel>{t("task.status")}</InputLabel> */}
            <ToggleButtonGroup
              value={formData.status || ""}
              fullWidth={true}
              onChange={(_, value) =>
                handleInputChange("status", value as TaskStatus)
              }
              exclusive
              color="primary"
              sx={{
                "& .MuiToggleButtonGroup-root": {
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                },
              }}
            >
              <ToggleButton value="todo" sx={{ textTransform: "none" }}>
                {t("status.todo")}
              </ToggleButton>
              <ToggleButton value="in_progress" sx={{ textTransform: "none" }}>
                {t("status.in_progress")}
              </ToggleButton>
              <ToggleButton value="done" sx={{ textTransform: "none" }}>
                {t("status.done")}
              </ToggleButton>
            </ToggleButtonGroup>
            {/* <Select
              required
              value={formData.status || ""}
              label={t("task.status")}
              onChange={(e) =>
                handleInputChange("status", e.target.value as TaskStatus)
              }
            >
              <MenuItem value="todo">{t("status.todo")}</MenuItem>
              <MenuItem value="in_progress">{t("status.in_progress")}</MenuItem>
              <MenuItem value="done">{t("status.done")}</MenuItem>
            </Select> */}
          </FormControl>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={onClose}>
              {t("ui.cancel")}
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!formData.title}
            >
              {t("ui.save")}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}
