class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.showError('Cannot divide by zero');
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Handle very large or very small numbers
        if (Math.abs(computation) > 1e15) {
            this.showError('Number too large');
            return;
        }
        
        // Round to prevent floating point errors
        computation = Math.round((computation + Number.EPSILON) * 100000000) / 100000000;
        
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    showError(message) {
        this.currentOperand = message;
        this.previousOperand = '';
        this.operation = undefined;
        setTimeout(() => {
            this.clear();
            this.updateDisplay();
        }, 2000);
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        if (typeof this.currentOperand === 'string' && this.currentOperand.includes('Cannot') || this.currentOperand.includes('Number too large')) {
            this.currentOperandTextElement.innerText = this.currentOperand;
        } else {
            this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        }
        
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

// Initialize calculator
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-clear]');
const previousOperandTextElement = document.querySelector('#previous-operand');
const currentOperandTextElement = document.querySelector('#current-operand');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Add button press animation
function addPressedEffect(button) {
    button.classList.add('pressed');
    setTimeout(() => {
        button.classList.remove('pressed');
    }, 100);
}

// Number buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        addPressedEffect(button);
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

// Operation buttons
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        addPressedEffect(button);
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

// Equals button
equalsButton.addEventListener('click', () => {
    addPressedEffect(equalsButton);
    calculator.compute();
    calculator.updateDisplay();
});

// All Clear button
allClearButton.addEventListener('click', () => {
    addPressedEffect(allClearButton);
    calculator.clear();
    calculator.updateDisplay();
});

// Delete button
deleteButton.addEventListener('click', () => {
    addPressedEffect(deleteButton);
    calculator.delete();
    calculator.updateDisplay();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    let button = null;
    
    // Numbers and decimal point
    if (e.key >= '0' && e.key <= '9') {
        button = document.querySelector(`[data-number="${e.key}"]`);
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    } else if (e.key === '.') {
        button = document.querySelector('[data-number="."]');
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    }
    // Operations
    else if (e.key === '+') {
        button = document.querySelector('[data-operator="+"]');
        calculator.chooseOperation('+');
        calculator.updateDisplay();
    } else if (e.key === '-') {
        button = document.querySelector('[data-operator="-"]');
        calculator.chooseOperation('-');
        calculator.updateDisplay();
    } else if (e.key === '*') {
        button = document.querySelector('[data-operator="×"]');
        calculator.chooseOperation('×');
        calculator.updateDisplay();
    } else if (e.key === '/') {
        e.preventDefault(); // Prevent browser search
        button = document.querySelector('[data-operator="÷"]');
        calculator.chooseOperation('÷');
        calculator.updateDisplay();
    }
    // Special keys
    else if (e.key === 'Enter' || e.key === '=') {
        button = equalsButton;
        calculator.compute();
        calculator.updateDisplay();
    } else if (e.key === 'Backspace') {
        button = deleteButton;
        calculator.delete();
        calculator.updateDisplay();
    } else if (e.key === 'Escape') {
        button = allClearButton;
        calculator.clear();
        calculator.updateDisplay();
    }
    
    // Add visual feedback for keyboard input
    if (button) {
        addPressedEffect(button);
    }
});

// Initialize display
calculator.updateDisplay();

// Add some extra functionality for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Add focus styles for accessibility
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(button => {
        button.addEventListener('focus', () => {
            button.style.outline = '2px solid rgba(255, 255, 255, 0.5)';
        });
        button.addEventListener('blur', () => {
            button.style.outline = 'none';
        });
    });
    
    // Prevent context menu on calculator
    document.querySelector('.calculator').addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    // Add subtle sound effect (optional - commented out to avoid audio issues)
    /*
    function playClickSound() {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhDjuBzvLZiTYIG2m98OScTgwPUarm7blmGgU6k9n1unEiBC13yO/eizEIHWq+8+OWT');
        audio.volume = 0.1;
        audio.play().catch(() => {}); // Ignore errors if audio can't play
    }
    */
});