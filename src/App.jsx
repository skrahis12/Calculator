import { useState } from 'react';
import Calculator from './components/Calculator';
import BackgroundAnimation from './components/BackgroundAnimation';
import './App.css';

function App() {
  const [clickEvent, setClickEvent] = useState(null);

  const handleButtonClick = (value) => {
    setClickEvent({ value, id: Date.now() });
  };

  return (
    <>
      <BackgroundAnimation clickEvent={clickEvent} />
      <Calculator onButtonClick={handleButtonClick} />
    </>
  );
}

export default App;
