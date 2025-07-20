import { Box, Chip } from "@mui/material";
import type {
  Task,
  TaskCategory,
  TaskStatus,
  TaskPriority,
} from "@entities/task/model/types";
import BugReportIcon from "@mui/icons-material/BugReport";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { useTranslation } from "react-i18next";

interface TaskChipProps {
  task: Task;
}

export default function TaskChip({ task }: TaskChipProps) {
  const { t } = useTranslation();

  const getStatusChipProps = (status: TaskStatus) => {
    const label = t(`status.${status}`);
    return {
      color: "default" as const,
      variant: "outlined" as const,
      label: t(label),
    };

    // ниже код просто так на всякий, обратная связь сказала что слишком много цвета
    switch (status) {
      case "todo":
        return {
          color: "default" as const,
          variant: "outlined" as const,
          label: t("status.todo"),
        };
      case "in_progress":
        return {
          color: "primary" as const,
          variant: "filled" as const,
          label: t("status.in_progress"),
        };
      case "done":
        return {
          color: "success" as const,
          variant: "outlined" as const,
          label: t("status.done"),
        };
      default:
        return {
          color: "default" as const,
          variant: "outlined" as const,
          label: t("ui.unknown"),
        };
    }
  };

  const getCategoryChipProps = (category: TaskCategory) => {
    const label = t(`category.${category}`);

    if (category === "bug") {
      return {
        color: "error" as const,
        variant: "outlined" as const,
        label: label,
        icon: <BugReportIcon />,
      };
    }
    return {
      color: "default" as const,
      variant: "outlined" as const,
      label: label,
    };
    // аналогично что выше
    switch (category) {
      case "bug":
        return {
          color: "error" as const,
          variant: "filled" as const,
          label: t("category.bug"),
          icon: <BugReportIcon />,
        };
      case "feature":
        return {
          color: "info" as const,
          variant: "outlined" as const,
          label: t("category.feature"),
        };
      case "documentation":
        return {
          color: "default" as const,
          variant: "outlined" as const,
          label: t("category.documentation"),
        };
      case "refactor":
        return {
          color: "warning" as const,
          variant: "outlined" as const,
          label: t("category.refactor"),
        };
      case "test":
        return {
          color: "success" as const,
          variant: "outlined" as const,
          label: t("category.test"),
        };
      default:
        return {
          color: "default" as const,
          variant: "outlined" as const,
          label: t("ui.other"),
        };
    }
  };

  const getPriorityChipProps = (priority: TaskPriority) => {
    const label = t(`priority.${priority}`);

    if (priority === "high") {
      return {
        color: "error" as const,
        variant: "outlined" as const,
        label: label,
        icon: <PriorityHighIcon />,
      };
    }
    return {
      color: "default" as const,
      variant: "outlined" as const,
      label: label,
    };

    switch (priority) {
      case "low":
        return {
          color: "success" as const,
          variant: "outlined" as const,
          label: t("priority.low"),
        };
      case "medium":
        return {
          color: "warning" as const,
          variant: "outlined" as const,
          label: t("priority.medium"),
        };
      case "high":
        return {
          color: "error" as const,
          variant: "filled" as const,
          label: t("priority.high"),
          icon: <PriorityHighIcon />,
        };
      default:
        return {
          color: "default" as const,
          variant: "outlined" as const,
          label: t("ui.unknown"),
        };
    }
  };

  const statusProps = getStatusChipProps(task.status);
  const categoryProps = getCategoryChipProps(task.category);
  const priorityProps = getPriorityChipProps(task.priority);

  return (
    <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
      <Chip
        label={categoryProps.label}
        color={categoryProps.color}
        variant={categoryProps.variant}
        icon={categoryProps.icon}
        size="small"
      />
      <Chip
        label={priorityProps.label}
        color={priorityProps.color}
        variant={priorityProps.variant}
        icon={priorityProps.icon}
        size="small"
      />
      <Chip
        label={statusProps.label}
        color={statusProps.color}
        variant={statusProps.variant}
        size="small"
      />
    </Box>
  );
}
