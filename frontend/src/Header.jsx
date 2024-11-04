import darkLogo from '../src/assets/tomeeto-dark.png';
import lightLogo from '../src/assets/tomeeto-light.png';
import Toggle from './Toggle';

export default function Header({ isDarkMode, toggleTheme }) {
  return (
    <div className="p-4 justify-between w-full p-4">
      <img
        src={isDarkMode ? darkLogo : lightLogo}
        alt="Logo"
        className="absolute top-8 left-8 w-[9vw] h-auto object-contain"
      />

      <Toggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </div>
  );
}