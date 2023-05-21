import "./App.css";
import { Route, Routes } from "react-router-dom";
import Homepage from "./screens/Homepage";
import Chatspage from "./screens/Chatspage";

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Homepage />} exact />
        <Route path='/chats' element={<Chatspage />} />
      </Routes>
    </div>
  );
}

export default App;
