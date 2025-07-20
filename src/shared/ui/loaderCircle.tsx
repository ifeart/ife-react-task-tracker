import { Backdrop, CircularProgress } from "@mui/material";
import { taskStore } from "@entities/task/model";
import { observer } from "mobx-react-lite";

export default observer(function LoaderCircle() {
  const isLoading = taskStore.loading;

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
});
