const display = document.getElementById("display");
const keypad = document.querySelector(".keypad");

function showResult(value) {
    if (!Number.isFinite(value)) {
        showError("Result is not a finite number");
        return;
    }

    display.value = String(value);
    display.classList.remove("is-error");
    display.removeAttribute("aria-label");
}

function showError(message) {
    display.value = "Error";
    display.classList.add("is-error");
    display.setAttribute("aria-label", message);
}

function clearError() {
    if (display.value === "Error") {
        display.value = "";
    }
    display.classList.remove("is-error");
    display.removeAttribute("aria-label");
}

function appendInput(value) {
    clearError();
    display.value += value;
    display.focus();
}

function clearDisplay() {
    display.value = "";
    display.classList.remove("is-error");
    display.removeAttribute("aria-label");
    display.focus();
}

function backspace() {
    clearError();
    display.value = display.value.slice(0, -1);
    display.focus();
}

function evaluateExpression(expression) {
    expression = expression.trim();
    const tokens = [];
    const tokenPattern = /\s*(\d+\.?\d*|\.\d+|[()+\-*/])/gy;
    let position = 0;

    while (position < expression.length) {
        tokenPattern.lastIndex = position;
        const match = tokenPattern.exec(expression);
        if (!match) {
            throw new Error("Invalid expression");
        }
        tokens.push(match[1]);
        position = tokenPattern.lastIndex;
    }

    let cursor = 0;
    function parseExpression() {
        let value = parseTerm();
        while (tokens[cursor] === "+" || tokens[cursor] === "-") {
            const operator = tokens[cursor++];
            const right = parseTerm();
            value = operator === "+" ? value + right : value - right;
        }
        return value;
    }

    function parseTerm() {
        let value = parseFactor();
        while (tokens[cursor] === "*" || tokens[cursor] === "/") {
            const operator = tokens[cursor++];
            const right = parseFactor();
            if (operator === "/" && right === 0) {
                throw new Error("Cannot divide by zero");
            }
            value = operator === "*" ? value * right : value / right;
        }
        return value;
    }

    function parseFactor() {
        if (tokens[cursor] === "+" || tokens[cursor] === "-") {
            const sign = tokens[cursor++] === "-" ? -1 : 1;
            return sign * parseFactor();
        }
        if (tokens[cursor] === "(") {
            cursor++;
            const value = parseExpression();
            if (tokens[cursor++] !== ")") {
                throw new Error("Missing closing parenthesis");
            }
            return value;
        }
        const token = tokens[cursor++];
        if (token === undefined || !/^(?:\d+\.?\d*|\.\d+)$/.test(token)) {
            throw new Error("Invalid expression");
        }
        return Number(token);
    }

    if (tokens.length === 0) {
        throw new Error("Enter an expression");
    }

    const result = parseExpression();
    if (cursor !== tokens.length) {
        throw new Error("Invalid expression");
    }
    return result;
}

function calculate() {
    try {
        showResult(evaluateExpression(display.value.trim()));
    } catch (error) {
        showError(error instanceof Error ? error.message : "Invalid expression");
    }
}

function operateOnDisplay(operation) {
    clearError();
    if (display.value.trim() === "") {
        showError("Enter a number first");
        return;
    }

    const value = Number(display.value);
    if (!Number.isFinite(value)) {
        showError("Enter a valid number");
        return;
    }
    try {
        showResult(operation(value));
    } catch (error) {
        showError(error instanceof Error ? error.message : "Invalid operation");
    }
}

function factorial(value) {
    if (!Number.isInteger(value) || value < 0 || value > 170) {
        throw new Error("Factorial requires a whole number from 0 to 170");
    }
    let result = 1;
    for (let factor = 2; factor <= value; factor++) {
        result *= factor;
    }
    return result;
}

const operations = {
    clear: clearDisplay,
    backspace,
    calculate,
    percent: () => operateOnDisplay(value => value / 100),
    reciprocal: () => operateOnDisplay(value => {
        if (value === 0) throw new Error("Cannot divide by zero");
        return 1 / value;
    }),
    sqrt: () => operateOnDisplay(value => {
        if (value < 0) throw new Error("Square root requires a non-negative number");
        return Math.sqrt(value);
    }),
    square: () => operateOnDisplay(value => value ** 2),
    cube: () => operateOnDisplay(value => value ** 3),
    factorial: () => operateOnDisplay(factorial),
    log10: () => operateOnDisplay(value => {
        if (value <= 0) throw new Error("Logarithm requires a positive number");
        return Math.log10(value);
    }),
    log2: () => operateOnDisplay(value => {
        if (value <= 0) throw new Error("Logarithm requires a positive number");
        return Math.log2(value);
    }),
    ln: () => operateOnDisplay(value => {
        if (value <= 0) throw new Error("Logarithm requires a positive number");
        return Math.log(value);
    }),
    sin: () => operateOnDisplay(value => Math.sin(value * Math.PI / 180)),
    cos: () => operateOnDisplay(value => Math.cos(value * Math.PI / 180)),
    tan: () => operateOnDisplay(value => Math.tan(value * Math.PI / 180))
};

function activateButton(button) {
    button.classList.add("is-pressed");
    window.setTimeout(() => button.classList.remove("is-pressed"), 140);

    if (button.dataset.value !== undefined) {
        appendInput(button.dataset.value);
        return;
    }
    operations[button.dataset.action]?.();
}

keypad.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (button) activateButton(button);
});

display.addEventListener("input", () => {
    display.classList.remove("is-error");
    display.removeAttribute("aria-label");
});

document.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        calculate();
    } else if (event.key === "Escape") {
        clearDisplay();
    } else if (event.key === "Backspace" && event.target !== display) {
        event.preventDefault();
        backspace();
    } else if (/^[0-9.+\-*/()]$/.test(event.key)) {
        if (event.target !== display) {
            appendInput(event.key);
        }
    }
});
