import AppRouter from "./routes/AppRouter";
import Toastify from "./components/ui/Toastify";
function App() {
  return (
    <div className="App">
   
        <AppRouter />
        <Toastify/>
   
    </div>
  );
}

export default App;
