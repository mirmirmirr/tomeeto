import { useNavigate } from 'react-router-dom';
import darkLogo from '../src/assets/tomeeto-dark.png';
import lightLogo from '../src/assets/tomeeto-light.png';
import Toggle from './Toggle';

export default function Header({ isDarkMode, toggleTheme }) {
  const navigate = useNavigate();

  return (
    <div className="p-4 justify-between w-full p-4">
      <img
        src={isDarkMode ? darkLogo : lightLogo}
        alt="Logo"
        className="absolute top-8 left-8 w-[9vw] h-auto object-contain"
        onClick={() => navigate('/')}
      />

      <Toggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </div>
  );
}
