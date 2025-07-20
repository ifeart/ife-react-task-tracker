import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  ButtonGroup,
  Divider,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type {
  Task,
  TaskStatus,
  TaskCategory,
  TaskPriority,
} from "@entities/task/model/types";
import { taskStore } from "@entities/task/model";
import { observer } from "mobx-react-lite";

interface TaskFilterModalProps {
  open: boolean;
  onClose: () => void;
}

const TaskFilterModal = observer(({ open, onClose }: TaskFilterModalProps) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState({
    status: taskStore.filter.status,
    category: taskStore.filter.category,
    priority: taskStore.filter.priority,
  });

  const statuses: TaskStatus[] = ["todo", "in_progress", "done"];
  const categories: TaskCategory[] = [
    "bug",
    "feature",
    "documentation",
    "refactor",
    "test",
  ];
  const priorities: TaskPriority[] = ["low", "medium", "high"];
  const sortFields: (keyof Task)[] = [
    "title",
    "createdAt",
    "updatedAt",
    "dueDate",
    "category",
    "status",
    "priority",
  ];

  const handleStatusFilter = (status: TaskStatus | null) => {
    setLocalFilters((prev) => ({ ...prev, status: status || undefined }));
  };

  const handleCategoryFilter = (category: TaskCategory | null) => {
    setLocalFilters((prev) => ({ ...prev, category: category || undefined }));
  };

  const handlePriorityFilter = (priority: TaskPriority | null) => {
    setLocalFilters((prev) => ({ ...prev, priority: priority || undefined }));
  };

  const handleSort = (field: keyof Task) => {
    const currentSort = taskStore.sort;
    const newDirection =
      currentSort.field === field && currentSort.direction === "asc"
        ? "desc"
        : "asc";
    taskStore.setSort({ field, direction: newDirection });
  };

  const handleApply = () => {
    taskStore.setFilter(localFilters);
    onClose();
  };

  const handleReset = () => {
    const emptyFilters = {
      status: undefined,
      category: undefined,
      priority: undefined,
    };
    setLocalFilters(emptyFilters);
    taskStore.setFilter(emptyFilters);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          backgroundColor: "background.paper",
        },
      }}
    >
      <DialogTitle>{t("ui.settings")}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          {t("ui.filters")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mb: 3,
          }}
        >
          <FormControl size="small">
            <InputLabel>{t("ui.status")}</InputLabel>
            <Select
              label={t("ui.status")}
              value={localFilters.status || ""}
              onChange={(e) =>
                handleStatusFilter((e.target.value as TaskStatus) || null)
              }
            >
              <MenuItem value="">{t("ui.all")}</MenuItem>
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {t(`status.${status}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small">
            <InputLabel>{t("ui.category")}</InputLabel>
            <Select
              label={t("ui.category")}
              value={localFilters.category || ""}
              onChange={(e) =>
                handleCategoryFilter((e.target.value as TaskCategory) || null)
              }
            >
              <MenuItem value="">{t("ui.all")}</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {t(`category.${category}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small">
            <InputLabel>{t("ui.priority")}</InputLabel>
            <Select
              label={t("ui.priority")}
              value={localFilters.priority || ""}
              onChange={(e) =>
                handlePriorityFilter((e.target.value as TaskPriority) || null)
              }
            >
              <MenuItem value="">{t("ui.all")}</MenuItem>
              {priorities.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {t(`priority.${priority}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          {t("ui.sortBy")}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <ButtonGroup
            size="small"
            variant="outlined"
            color="inherit"
            orientation="vertical"
            sx={{
              width: "100%",
              "& .MuiButton-root": {
                justifyContent: "flex-start",
                px: 2,
              },
            }}
          >
            {sortFields.map((field) => (
              <Button
                key={field}
                onClick={() => handleSort(field)}
                color="inherit"
                endIcon={
                  taskStore.sort.field === field
                    ? taskStore.sort.direction === "asc"
                      ? "↑"
                      : "↓"
                    : null
                }
              >
                {t(`sort.${field}`)}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={handleReset}
          color="inherit"
          variant="outlined"
          sx={{
            "&:hover": { borderColor: "error.main", color: "error.main" },
          }}
        >
          {t("ui.reset")}
        </Button>
        <Button onClick={onClose} color="inherit" variant="outlined">
          {t("ui.cancel")}
        </Button>
        <Button
          onClick={handleApply}
          color="inherit"
          variant="outlined"
          sx={{
            "&:hover": { borderColor: "success.main", color: "success.main" },
          }}
        >
          {t("ui.apply")}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default TaskFilterModal;
