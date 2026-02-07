const previousOperandEl = document.getElementById('previousOperand');
const currentOperandEl = document.getElementById('currentOperand');
const buttons = document.querySelectorAll('.btn');

let previousOperand = '';
let currentOperand = '0';
let operation = null;

function updateDisplay() {
    currentOperandEl.textContent = currentOperand;
    previousOperandEl.textContent = previousOperand ? `${previousOperand} ${operation || ''}` : '';
}

function appendNumber(number) {
    if (number === '.' && currentOperand.includes('.')) return;
    if (number === '0' && currentOperand === '0') return;
    if (number !== '.' && currentOperand === '0') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
    updateDisplay();
}

function chooseOperator(op) {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
        compute();
    }
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
    updateDisplay();
}

function compute() {
    if (previousOperand === '' || currentOperand === '' || !operation) return;

    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    let result;

    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '−':
        case '-':
            result = prev - current;
            break;
        case '×':
            result = prev * current;
            break;
        case '÷':
            result = current === 0 ? 'Error' : prev / current;
            break;
        case '%':
            result = prev % current;
            break;
        default:
            return;
    }

    currentOperand = typeof result === 'number' ? String(Math.round(result * 1000000000) / 1000000000) : result;
    previousOperand = '';
    operation = null;
    updateDisplay();
}

function clear() {
    previousOperand = '';
    currentOperand = '0';
    operation = null;
    updateDisplay();
}

function deleteLast() {
    currentOperand = currentOperand.slice(0, -1) || '0';
    updateDisplay();
}

function percent() {
    currentOperand = String(parseFloat(currentOperand) / 100);
    updateDisplay();
}

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const number = btn.dataset.number;
        const action = btn.dataset.action;
        const operator = btn.dataset.operator;

        if (number !== undefined) {
            appendNumber(number);
        } else if (action === 'operator' && operator) {
            chooseOperator(operator);
        } else if (action === 'equals') {
            compute();
        } else if (action === 'clear') {
            clear();
        } else if (action === 'delete') {
            deleteLast();
        } else if (action === 'percent') {
            percent();
        }
    });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    else if (e.key === '.') appendNumber('.');
    else if (e.key === '+') chooseOperator('+');
    else if (e.key === '-') chooseOperator('−');
    else if (e.key === '*') chooseOperator('×');
    else if (e.key === '/') { e.preventDefault(); chooseOperator('÷'); }
    else if (e.key === '%') { e.preventDefault(); percent(); }
    else if (e.key === 'Enter') { e.preventDefault(); compute(); }
    else if (e.key === 'Backspace') { e.preventDefault(); deleteLast(); }
    else if (e.key === 'Escape') clear();
});
