// ====== ZAKŁADKI ======
function showTab(id) {
    document.getElementById("nature").classList.add("hidden");
    document.getElementById("games").classList.add("hidden");
    document.getElementById(id).classList.remove("hidden");
}

// ====== GRA Z NATURĄ ======
let rows = 3;
let cols = 3;
const table = document.getElementById("matrix");

function render() {
    table.innerHTML = "";

    const header = document.createElement("tr");
    header.innerHTML = "<th>Strategia</th>";
    for (let j = 0; j < cols; j++) {
        header.innerHTML += `<th>Stan ${j+1}</th>`;
    }
    table.appendChild(header);

    for (let i = 0; i < rows; i++) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>S${i+1}</td>`;
        for (let j = 0; j < cols; j++) {
            tr.innerHTML += `<td><input value="0"></td>`;
        }
        table.appendChild(tr);
    }
}

function addRow() { rows++; render(); }
function removeRow() { if (rows > 1) rows--; render(); }
function addColumn() { cols++; render(); }
function removeColumn() { if (cols > 1) cols--; render(); }

function getData() {
    return [...table.querySelectorAll("tr")]
        .slice(1)
        .map(r => [...r.querySelectorAll("input")].map(i => Number(i.value)));
}

function calculateNature() {
    const data = getData();
    const alpha = Number(document.getElementById("alpha").value);
    const probs = document.getElementById("probabilities").value.split(",").map(Number);

    let out = "";

    const wald = data.map(r => Math.min(...r));
    out += "WALD:\n";
    wald.forEach((v,i)=> out += `S${i+1}: ${v}\n`);
    out += `=> Najlepsza: S${wald.indexOf(Math.max(...wald))+1}\n\n`;

    const hurwicz = data.map(r =>
        alpha * Math.min(...r) + (1-alpha) * Math.max(...r)
    );
    out += "HURWICZ:\n";
    hurwicz.forEach((v,i)=> out += `S${i+1}: ${v.toFixed(2)}\n`);
    out += `=> Najlepsza: S${hurwicz.indexOf(Math.max(...hurwicz))+1}\n\n`;

    const bayes = data.map(r =>
        r.reduce((s,v,i)=> s + v*(probs[i]||0),0)
    );
    out += "BAYES:\n";
    bayes.forEach((v,i)=> out += `S${i+1}: ${v.toFixed(2)}\n`);
    out += `=> Najlepsza: S${bayes.indexOf(Math.max(...bayes))+1}\n\n`;

    const maxCols = data[0].map((_,c)=> Math.max(...data.map(r=>r[c])));
    const savage = data.map(r =>
        Math.max(...r.map((v,i)=> maxCols[i]-v))
    );
    out += "SAVAGE:\n";
    savage.forEach((v,i)=> out += `S${i+1}: ${v}\n`);
    out += `=> Najlepsza: S${savage.indexOf(Math.min(...savage))+1}`;

    document.getElementById("result").innerText = out;
}

// ====== GRY DWUOSOBOWE ======
function calculateGame() {
    const a = Number(document.getElementById("a").value);
    const b = Number(document.getElementById("b").value);
    const c = Number(document.getElementById("c").value);
    const d = Number(document.getElementById("d").value);

    const denom = a - b - c + d;
    let out = "";

    const rowMin = [Math.min(a,b), Math.min(c,d)];
    const colMax = [Math.max(a,c), Math.max(b,d)];

    if (Math.max(...rowMin) === Math.min(...colMax)) {
        out += "🎯 STRATEGIE CZYSTE (punkt siodłowy)\n";
        out += `Wartość gry: ${Math.max(...rowMin)}\n`;
    } else {
        const pA1 = (d - c) / denom;
        const pA2 = 1 - pA1;
        const pB1 = (d - b) / denom;
        const pB2 = 1 - pB1;
        const V = (a*d - b*c) / denom;

        out += "🎲 STRATEGIE MIESZANE\n\n";
        out += "Gracz A:\n";
        out += `A1: ${(pA1*100).toFixed(2)}%\n`;
        out += `A2: ${(pA2*100).toFixed(2)}%\n\n`;

        out += "Gracz B:\n";
        out += `B1: ${(pB1*100).toFixed(2)}%\n`;
        out += `B2: ${(pB2*100).toFixed(2)}%\n\n`;

        out += `VA = VB = ${V.toFixed(2)}\n`;
        out += `Maksymalny zysk A: ${V.toFixed(2)}\n`;
        out += `Maksymalna strata B: ${V.toFixed(2)}\n`;
    }

    document.getElementById("gameResult").innerText = out;
}

render();
