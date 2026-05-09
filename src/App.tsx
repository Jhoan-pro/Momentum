import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./component/Login";
import{Home}from "./component/Home"
import { CreateAccount } from "./component/CreateAccount";
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