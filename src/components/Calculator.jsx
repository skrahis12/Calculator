import React, { useState, useRef, useEffect } from 'react';
import './Calculator.css';

const Calculator = ({ onButtonClick }) => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const inputRef = useRef(null);
  const historyEndRef = useRef(null);

  // Focus the input on mount is removed to prevent keyboard popup on mobile
  useEffect(() => {
    // Intentionally empty
  }, []);

  // Auto-scroll to bottom of history
  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    // Allow numbers, letters for functions, operators, decimal point, and parentheses
    if (/^[0-9+\-*/(). a-z^π]*$/i.test(val)) {
      setExpression(val);
    }
  };

  const calculateResult = (expr) => {
    try {
      if (!expr) {
        setResult('');
        return;
      }
      
      let parsedExpr = expr.toLowerCase();
      
      // Replace math functions with JS Math equivalents
      parsedExpr = parsedExpr.replace(/antilog\(/g, '10**(');
      parsedExpr = parsedExpr.replace(/log\(/g, 'Math.log10(');
      parsedExpr = parsedExpr.replace(/ln\(/g, 'Math.log(');
      parsedExpr = parsedExpr.replace(/asin\(/g, 'Math.asin(');
      parsedExpr = parsedExpr.replace(/acos\(/g, 'Math.acos(');
      parsedExpr = parsedExpr.replace(/atan\(/g, 'Math.atan(');
      parsedExpr = parsedExpr.replace(/sin\(/g, 'Math.sin(');
      parsedExpr = parsedExpr.replace(/cos\(/g, 'Math.cos(');
      parsedExpr = parsedExpr.replace(/tan\(/g, 'Math.tan(');
      parsedExpr = parsedExpr.replace(/sqrt\(/g, 'Math.sqrt(');
      parsedExpr = parsedExpr.replace(/cbrt\(/g, 'Math.cbrt(');
      parsedExpr = parsedExpr.replace(/abs\(/g, 'Math.abs(');
      parsedExpr = parsedExpr.replace(/exp\(/g, 'Math.exp(');
      parsedExpr = parsedExpr.replace(/\bpi\b/g, 'Math.PI');
      parsedExpr = parsedExpr.replace(/π/g, 'Math.PI');
      parsedExpr = parsedExpr.replace(/(?<![a-z])e(?![a-z])/g, 'Math.E');
      parsedExpr = parsedExpr.replace(/\^/g, '**');
      
      // Security check: ensure no unexpected variables/functions are left
      const safeCheck = parsedExpr.replace(/Math\.(log10|log|asin|acos|atan|sin|cos|tan|sqrt|cbrt|abs|exp|PI|E)/g, '');
      if (/[a-z_]/i.test(safeCheck)) {
        setResult('Error');
        return;
      }

      const evalResult = new Function('return ' + parsedExpr)();
      
      if (evalResult === undefined || Number.isNaN(evalResult) || !isFinite(evalResult)) {
        setResult('Error');
      } else {
        const finalResult = Math.round(evalResult * 100000000) / 100000000;
        setResult(finalResult);

        // Add to history if not just a plain number being submitted
        if (expr.trim() !== finalResult.toString()) {
          setHistory((prev) => {
            const newHistory = [...prev, { expr: expr.trim(), result: finalResult }];
            // Keep maximum of 15 history items
            if (newHistory.length > 15) newHistory.shift();
            return newHistory;
          });
        }
      }
    } catch (error) {
      setResult('Error');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onButtonClick) onButtonClick('=');
      calculateResult(expression);
    }
  };

  const appendToExpression = (char) => {
    setExpression((prev) => prev + char);
  };

  const handleClear = () => {
    setExpression('');
    setResult('');
  };

  const handleDelete = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    calculateResult(expression);
  };

  const advancedButtons = [
    { label: 'sin', onClick: () => appendToExpression('sin('), className: 'btn-scientific' },
    { label: 'cos', onClick: () => appendToExpression('cos('), className: 'btn-scientific' },
    { label: 'tan', onClick: () => appendToExpression('tan('), className: 'btn-scientific' },
    { label: 'log', onClick: () => appendToExpression('log('), className: 'btn-scientific' },
    { label: 'asin', onClick: () => appendToExpression('asin('), className: 'btn-scientific' },
    { label: 'acos', onClick: () => appendToExpression('acos('), className: 'btn-scientific' },
    { label: 'atan', onClick: () => appendToExpression('atan('), className: 'btn-scientific' },
    { label: 'ln', onClick: () => appendToExpression('ln('), className: 'btn-scientific' },
    { label: 'sqrt', onClick: () => appendToExpression('sqrt('), className: 'btn-scientific' },
    { label: 'cbrt', onClick: () => appendToExpression('cbrt('), className: 'btn-scientific' },
    { label: '^', onClick: () => appendToExpression('^'), className: 'btn-scientific' },
    { label: 'exp', onClick: () => appendToExpression('exp('), className: 'btn-scientific' },
    { label: 'π', onClick: () => appendToExpression('π'), className: 'btn-scientific' },
    { label: 'e', onClick: () => appendToExpression('e'), className: 'btn-scientific' },
    { label: '(', onClick: () => appendToExpression('('), className: 'btn-operator' },
    { label: ')', onClick: () => appendToExpression(')'), className: 'btn-operator' },
    { label: 'C', onClick: handleClear, className: 'btn-clear' },
    { label: 'DEL', onClick: handleDelete, className: 'btn-delete' },
    { label: '10^x', onClick: () => appendToExpression('antilog('), className: 'btn-scientific' },
    { label: '=', onClick: handleCalculate, className: 'btn-equal' },
  ];

  const basicButtons = [
    { label: 'C', onClick: handleClear, className: 'btn-clear' },
    { label: 'DEL', onClick: handleDelete, className: 'btn-delete' },
    { label: '(', onClick: () => appendToExpression('('), className: 'btn-operator' },
    { label: ')', onClick: () => appendToExpression(')'), className: 'btn-operator' },
    { label: '7', onClick: () => appendToExpression('7'), className: 'btn-number' },
    { label: '8', onClick: () => appendToExpression('8'), className: 'btn-number' },
    { label: '9', onClick: () => appendToExpression('9'), className: 'btn-number' },
    { label: '/', onClick: () => appendToExpression('/'), className: 'btn-operator' },
    { label: '4', onClick: () => appendToExpression('4'), className: 'btn-number' },
    { label: '5', onClick: () => appendToExpression('5'), className: 'btn-number' },
    { label: '6', onClick: () => appendToExpression('6'), className: 'btn-number' },
    { label: '*', onClick: () => appendToExpression('*'), className: 'btn-operator' },
    { label: '1', onClick: () => appendToExpression('1'), className: 'btn-number' },
    { label: '2', onClick: () => appendToExpression('2'), className: 'btn-number' },
    { label: '3', onClick: () => appendToExpression('3'), className: 'btn-number' },
    { label: '-', onClick: () => appendToExpression('-'), className: 'btn-operator' },
    { label: '0', onClick: () => appendToExpression('0'), className: 'btn-number' },
    { label: '.', onClick: () => appendToExpression('.'), className: 'btn-number' },
    { label: '=', onClick: handleCalculate, className: 'btn-equal' },
    { label: '+', onClick: () => appendToExpression('+'), className: 'btn-operator' },
  ];

  const buttons = showAdvanced ? advancedButtons : basicButtons;

  return (
    <div className="calculator-container">
      <div className="calculator-body">
        
        {/* History Section */}
        <div className="history-container">
          {history.length > 0 ? (
            <>
              {history.map((item, idx) => (
                <div 
                  key={idx} 
                  className="history-item"
                  onClick={() => {
                    setExpression(item.result.toString());
                  }}
                  title="Click to use result"
                >
                  <span className="history-expr">{item.expr} =</span>
                  <span className="history-result">{item.result}</span>
                </div>
              ))}
              <div ref={historyEndRef} />
            </>
          ) : (
            <div className="history-empty">No History Yet</div>
          )}
        </div>

        <div className="display-container">
          <input
            type="text"
            className="digital-display expression"
            value={expression}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            placeholder="0"
          />
          <div className="digital-display result">
            {result !== '' ? `= ${result}` : '\u00A0'}
          </div>
        </div>
        <div className="controls-row">
          <button 
            className="btn-toggle-advanced" 
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
        </div>

        <div className="keypad">
          {
          buttons.map((btn, index) => (
            <button
              key={index}
              className={`calc-btn ${btn.className}`}
              onClick={() => {
                if (onButtonClick) onButtonClick(btn.label);
                btn.onClick();
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Calculator);
