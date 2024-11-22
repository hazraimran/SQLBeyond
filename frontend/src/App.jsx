import { Routes, Route } from "react-router-dom";
import IntroQuestion from "./components/IntroQuestion";
import QuestionaireForUsers from "./components/QuestionaireForUsers";
import SQLEditor from "./components/SQLEditor";

function App() {
  return (
    <Routes>
      <Route path="/" element={<IntroQuestion />} />
      <Route path="/query" element={<QuestionaireForUsers />} />
      <Route path="/SQLEditor" element={<SQLEditor />} />
    </Routes>
  );
}

export default App;
