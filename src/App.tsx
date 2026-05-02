import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./component/Login/Login";
import Home from "./component/Home/Home"; // Asegúrate de que la ruta al archivo Home sea correcta
import { CreateAccount } from "./component/CreateAccount/CreateAccount";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-account" element={<CreateAccount/>}/>
      </Routes>
    </Router>
  );
}

export default App;