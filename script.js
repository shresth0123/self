document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.btn');
    let currentInput = '';
    let resetNext = false;

    function updateDisplay() {
        display.value = currentInput || '0';
    }

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            if (this.id === 'clear') {
                currentInput = '';
                updateDisplay();
                return;
            }
            if (this.id === 'equals') {
                try {
                    // Evaluate the expression
                    let result = eval(currentInput);
                    if (result === undefined) result = '';
                    currentInput = result.toString();
                    resetNext = true;
                } catch (e) {
                    currentInput = 'Error';
                    resetNext = true;
                }
                updateDisplay();
                return;
            }
            if (currentInput === 'Error' || resetNext) {
                if (value >= '0' && value <= '9' || value === '.') {
                    currentInput = value;
                } else {
                    currentInput = display.value + value;
                }
                resetNext = false;
                updateDisplay();
                return;
            }
            currentInput += value;
            updateDisplay();
        });
    });

    updateDisplay();
});