import AppRouter from "./routes/AppRouter";
import Toastify from "./components/ui/Toastify";
import { AuthProvider } from "./components/context/AuthContext";
function App() {
  return (
    <div className="App">
   
        <AppRouter />
        <Toastify/>
   
    </div>
  );
}

export default App;
