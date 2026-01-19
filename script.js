let gRows = 2, gCols = 2;
const gTable = document.getElementById("gameTable");

function renderGame() {
    gTable.innerHTML = "<tr><th>A\\B</th>" +
        [...Array(gCols)].map((_, j) => `<th>B${j+1}</th>`).join("") + "</tr>";

    for (let i = 0; i < gRows; i++) {
        gTable.innerHTML += "<tr><th>A" + (i+1) + "</th>" +
            [...Array(gCols)].map(() => "<td><input value='0'></td>").join("") +
            "</tr>";
    }
}

function addGameRow(){ gRows++; renderGame(); }
function removeGameRow(){ if(gRows>1) gRows--; renderGame(); }
function addGameCol(){ gCols++; renderGame(); }
function removeGameCol(){ if(gCols>1) gCols--; renderGame(); }

renderGame();

/* ===== ANALIZA PUNKTU SIODŁOWEGO Z PARAMETREM x ===== */
function analyzeSaddle() {
    const inputs = [...gTable.querySelectorAll("input")];

    // znajdź komórkę z x
    const xIndex = inputs.findIndex(i => i.value.trim() === "x");

    if (xIndex === -1) {
        gameResult.innerText = "❌ Wpisz dokładnie jedno 'x' w macierzy.";
        return;
    }

    // przygotuj macierz bazową
    const base = [];
    let idx = 0;
    for (let i = 0; i < gRows; i++) {
        base[i] = [];
        for (let j = 0; j < gCols; j++) {
            base[i][j] = inputs[idx].value.trim() === "x"
                ? "x"
                : Number(inputs[idx].value);
            idx++;
        }
    }

    const X_MIN = -1000;
    const X_MAX = 1000;
    const STEP = 1;

    let intervals = [];
    let inInterval = false;
    let startX = null;

    for (let x = X_MIN; x <= X_MAX; x += STEP) {
        const matrix = base.map(r =>
            r.map(v => v === "x" ? x : v)
        );

        const rowMin = matrix.map(r => Math.min(...r));
        const colMax = matrix[0].map((_, j) =>
            Math.max(...matrix.map(r => r[j]))
        );

        const maximin = Math.max(...rowMin);
        const minimax = Math.min(...colMax);

        if (Math.abs(maximin - minimax) < 1e-6) {
            if (!inInterval) {
                inInterval = true;
                startX = x;
            }
        } else {
            if (inInterval) {
                intervals.push([startX, x - STEP]);
                inInterval = false;
            }
        }
    }

    if (inInterval) {
        intervals.push([startX, X_MAX]);
    }

    if (intervals.length === 0) {
        gameResult.innerText =
            "❌ Brak wartości x, dla których gra ma punkt siodłowy.";
        return;
    }

    let out = "🎯 GRA JEST SIODŁOWA DLA:\n\n";
    intervals.forEach(([a,b]) =>
        out += `x ∈ [${a}, ${b}]\n`
    );

    out += "\nWarunek: maximin(x) = minimax(x)\n";
    out += "Punkt siodłowy zależy od x.";

    gameResult.innerText = out;
}
