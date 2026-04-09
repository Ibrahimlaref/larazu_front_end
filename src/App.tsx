import { Provider } from "react-redux";
import { store } from "./redux/store";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import AppRouter from "./routes";
import "./i18n";

function App() {
  return (
    <Provider store={store}>
      <TooltipProvider>
        <AppRouter />
        <Toaster />
      </TooltipProvider>
    </Provider>
  );
}

export default App;
