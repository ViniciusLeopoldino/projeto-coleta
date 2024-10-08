// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NovaEntrada from './components/NovaEntrada';
import Dashboard from './components/Dashboard';
import Menu from './components/Menu';

const App = () => {
  return (
    <Router>
      <Menu />
      <Routes>
        <Route path="/" element={<NovaEntrada />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
