import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Nhóm Project 2</h1>
        <div style={{ display: "flex", gap: "50px" }}>
          <h4>Lò Văn Thành</h4>
          <h4>Trần Bá Tính</h4>
          <h4>Nguyễn Văn Huy</h4>
          <h4>Nguyễn Công Nghĩa</h4>
          <h4>Dương Mạnh Linh</h4>
        </div>
      </header>
    </div>
  );
}

export default App;
