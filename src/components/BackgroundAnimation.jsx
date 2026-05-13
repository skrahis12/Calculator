/* eslint-disable no-unused-vars, react/prop-types */
import React, { useEffect, useState, useRef } from 'react';
import './BackgroundAnimation.css';

const mathSymbols = [
  '+', '-', '×', '÷', '=', 'π', 'e', '√', '∑', '∫', 
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '.', '0.5', '42', 'x²', 'sin(x)', 'cos(θ)', '∞', '%',
  '3.14', '2.71', '1/2', '¾', '(', ')'
];

const BackgroundAnimation = ({ clickEvent }) => {
  const [elements, setElements] = useState([]);
  const itemRefs = useRef([]);

  useEffect(() => {
    // Generate fewer random floating elements to optimize performance on mobile
    const newElements = Array.from({ length: 15 }).map((_, index) => {
      const randomSymbol = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
      const leftPosition = Math.random() * 100; // 0 to 100vw
      const animationDuration = 10 + Math.random() * 20; // 10s to 30s
      const animationDelay = Math.random() * 15; // 0 to 15s delay
      const fontSize = 10 + Math.random() * 30; // 10px to 40px
      const opacity = 0.05 + Math.random() * 0.15; // 0.05 to 0.20

      return {
        id: index,
        symbol: randomSymbol,
        style: {
          left: `${leftPosition}vw`,
          animationDuration: `${animationDuration}s`,
          animationDelay: `${animationDelay}s`,
          fontSize: `${fontSize}px`,
          opacity: opacity,
        }
      };
    });

    setElements(newElements);
    itemRefs.current = itemRefs.current.slice(0, 15);

    let animationFrameId;

    const handleMouseMove = (e) => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      
      animationFrameId = requestAnimationFrame(() => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        itemRefs.current.forEach((el) => {
          if (!el || !el.firstChild) return;
          const rect = el.getBoundingClientRect();
          const elX = rect.left + rect.width / 2;
          const elY = rect.top + rect.height / 2;

          const distX = elX - mouseX;
          const distY = elY - mouseY;
          const distance = Math.sqrt(distX * distX + distY * distY);

          const maxDist = 200; // Activation distance in pixels
          if (distance < maxDist) {
            // Calculate repulsion
            const force = (maxDist - distance) / maxDist;
            const pushX = (distX / distance) * force * 150; // Max 150px push
            const pushY = (distY / distance) * force * 150;
            
            el.firstChild.style.transform = `translate(${pushX}px, ${pushY}px) scale(1.3)`;
            el.firstChild.style.color = '#ffffff'; // Highlight color
            el.firstChild.style.textShadow = '0 0 15px rgba(255, 255, 255, 0.8)';
          } else {
            // Reset
            el.firstChild.style.transform = `translate(0px, 0px) scale(1)`;
            el.firstChild.style.color = '';
            el.firstChild.style.textShadow = '';
          }
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="math-background">
      {elements.map((el, i) => (
        <div 
          key={el.id} 
          className="floating-math-wrapper" 
          style={el.style}
          ref={el => itemRefs.current[i] = el}
        >
          <span className="floating-math-content">
            {el.symbol}
          </span>
        </div>
      ))}
      
      {/* Huge text feedback for button clicks */}
      {clickEvent && (
        <div key={clickEvent.id} className="huge-click-feedback">
          {clickEvent.value}
        </div>
      )}
    </div>
  );
};

export default BackgroundAnimation;
