document.addEventListener('DOMContentLoaded', function() {
    const screen = document.querySelector('.screen span');
    const timeElement = document.getElementById('time');
    const buttons = document.querySelectorAll('.key');
    let expression = '';

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const value = this.textContent;

            if (value === 'C') {
                expression = '';
            } else if (value === '=') {
                const startTime = performance.now();
                try {
                    const result = evaluateExpression(expression);
                    expression = result;
                } catch (error) {
                    expression = 'Error';
                }
                const endTime = performance.now();
                const timeTaken = endTime - startTime;
                timeElement.textContent = `Затраченное время: ${timeTaken.toFixed(2)} ms`;
            } else {
                expression += value;
            }

            screen.textContent = expression;
        });
    });

    function evaluateExpression(expression) {
        const tokens = expression.match(/(\d+(\.\d+)?|\+|\-|\*|\/|\^|\(|\)|√|e|π|sin|cos|tan|log|exp)/g);
        const stack = [];
        const output = [];

        const precedence = {
            '+': 1,
            '-': 1,
            '*': 2,
            '/': 2,
            '^': 3,
            '√': 4,
            'sin': 5,
            'cos': 5,
            'tan': 5,
            'log': 5,
            'exp': 5
        };

        tokens.forEach(token => {
            if (isNumeric(token)) {
                output.push(token);
            } else if (token === 'e') {
                output.push(Math.E);
            } else if (token === 'π') {
                output.push(Math.PI);
            } else if (token === '(') {
                stack.push(token);
            } else if (token === ')') {
                while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                    output.push(stack.pop());
                }
                stack.pop();
            } else {
                while (stack.length > 0 && precedence[stack[stack.length - 1]] >= precedence[token]) {
                    output.push(stack.pop());
                }
                stack.push(token);
            }
        });

        while (stack.length > 0) {
            output.push(stack.pop());
        }

        const resultStack = [];
        output.forEach(token => {
            if (isNumeric(token)) {
                resultStack.push(parseFloat(token));
            } else if (token === '√') {
                const operand = resultStack.pop();
                resultStack.push(Math.sqrt(operand));
            } else if (token === 'sin') {
                resultStack.push(Math.sin(resultStack.pop()));
            } else if (token === 'cos') {
                resultStack.push(Math.cos(resultStack.pop()));
            } else if (token === 'tan') {
                resultStack.push(Math.tan(resultStack.pop()));
            } else if (token === 'log') {
                const base = resultStack.pop();
                const value = resultStack.pop();
                resultStack.push(Math.log(value) / Math.log(base));
            } else if (token === 'exp') {
                resultStack.push(Math.exp(resultStack.pop()));
            } else {
                const b = resultStack.pop();
                const a = resultStack.pop();
                if (token === '+') {
                    resultStack.push(a + b);
                } else if (token === '-') {
                    resultStack.push(a - b);
                } else if (token === '*') {
                    resultStack.push(a * b);
                } else if (token === '/') {
                    resultStack.push(a / b);
                } else if (token === '^') {
                    resultStack.push(Math.pow(a, b));
                }
            }
        });

        if (resultStack.length !== 1) {
            throw new Error('Invalid expression');
        }

        return resultStack[0].toFixed(2);
    }

    function isNumeric(value) {
        return !isNaN(value) && isFinite(value);
    }
});