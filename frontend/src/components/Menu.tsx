// src/components/Menu.tsx
import { Link } from 'react-router-dom';
import styles from './Menu.module.css'; // Crie um arquivo CSS para estilizar o menu

const Menu = () => {
  return (
    <nav className={styles.menu}>
      <ul>
        <li><Link to="/">Nova Entrada</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
      </ul>
    </nav>
  );
};

export default Menu;
