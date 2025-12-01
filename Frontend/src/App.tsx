import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EditarFesta from "./pages/EditarFesta";
import NovaFesta from "./pages/NovaFesta";
import Festas from "./pages/Festas";
import AvaliarFesta from "./pages/AvaliarFesta";
import AvaliacoesFesta from "./pages/AvaliacoesFesta";
import Admin from "./pages/Admin";
import RelatoriosIndividuais from "./pages/RelatoriosIndividuais";
import RelatoriosGerais from "./pages/RelatoriosGerais";
import Layout from "./components/Layout";
import AdminQuestoes from "./pages/AdminQuestoes";
import NovaQuestao from "./pages/NovaQuestao";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/festas" element={<Festas />} />
          <Route path="/festas/:id/avaliar" element={<AvaliarFesta />} />
          <Route path="/festas/:id/avaliacoes" element={<AvaliacoesFesta />} />
          <Route path="/nova-festa" element={<NovaFesta />} />
          <Route path="/editar-festa/:id" element={<EditarFesta />} />
          <Route path="/questoes" element={<AdminQuestoes />} />
          <Route path="/admin/novaquestao" element={<NovaQuestao />} />
          <Route path="/relatorios" element={<RelatoriosIndividuais />} />
          <Route path="/relatorios-gerais" element={<RelatoriosGerais />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
