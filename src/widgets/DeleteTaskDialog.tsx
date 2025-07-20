import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface DeleteTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle?: string;
  isMultiple?: boolean;
}

export default function DeleteTaskDialog({
  open,
  onClose,
  onConfirm,
  taskTitle,
  isMultiple = false,
}: DeleteTaskDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3.5,
        },
      }}
    >
      <DialogTitle id="delete-dialog-title">
        {t("ui.confirmDelete")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          {isMultiple
            ? t("ui.deleteAllTasksConfirmation")
            : t("ui.deleteTaskConfirmation", { taskTitle })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {t("ui.cancel")}
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          {t("ui.delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
