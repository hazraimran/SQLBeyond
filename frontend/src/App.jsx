import { Routes, Route } from "react-router-dom";
import IntroQuestion from "./components/IntroQuestion";
import QuestionaireForUsers from "./components/QuestionaireForUsers";
import SQLEditor from "./components/SQLEditor";
import Authentication from "./components/Login/Authentication";
import Register from "./components/Login/Register";
import AuthProvider from "./components/Login/AuthContext";
import PrivateRoute from "./components/Login/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoute />}>
          <Route path="/intro" element={<IntroQuestion />} />
          <Route path="/query" element={<QuestionaireForUsers />} />
          <Route path="/SQLEditor" element={<SQLEditor />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
