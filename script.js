/* ===== ZAKŁADKI ===== */
function showTab(id) {
    document.querySelectorAll(".card").forEach(c => c.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
}

/* ===== GRA Z NATURĄ ===== */
let rows = 3, cols = 3;
const table = document.getElementById("matrix");

function render() {
    table.innerHTML = "<tr><th>Strategia</th>" +
        [...Array(cols)].map((_,j)=>`<th>Stan ${j+1}</th>`).join("") +
        "</tr>";

    for (let i = 0; i < rows; i++) {
        table.innerHTML += "<tr><td>S"+(i+1)+"</td>" +
            [...Array(cols)].map(()=>"<td><input value='0'></td>").join("") +
            "</tr>";
    }
}

function renderBayes() {
    const box = document.getElementById("bayesInputs");
    box.innerHTML = "";

    for (let j = 0; j < cols; j++) {
        const row = document.createElement("div");
        row.className = "bayes-row";
        row.innerHTML = `
            <label>Stan ${j+1}:</label>
            <input type="number" step="0.01" value="${(1/cols).toFixed(2)}"
                   class="bayesProb" oninput="updateBayesSum()">
        `;
        box.appendChild(row);
    }
    updateBayesSum();
}

function updateBayesSum() {
    const probs = [...document.querySelectorAll(".bayesProb")]
        .map(i => Number(i.value));
    const sum = probs.reduce((a,b)=>a+b,0);

    const info = document.getElementById("bayesSum");
    info.innerText = `Suma: ${sum.toFixed(2)}`;
    info.style.color = Math.abs(sum - 1) < 0.001 ? "green" : "red";
}

function addRow(){ rows++; render(); renderBayes(); }
function removeRow(){ if(rows>1) rows--; render(); renderBayes(); }
function addColumn(){ cols++; render(); renderBayes(); }
function removeColumn(){ if(cols>1) cols--; render(); renderBayes(); }

function calculateNature() {
    const data = [...table.querySelectorAll("tr")].slice(1)
        .map(r => [...r.querySelectorAll("input")].map(i => +i.value));

    const alpha = +document.getElementById("alpha").value;
    const probs = [...document.querySelectorAll(".bayesProb")]
        .map(i => +i.value);

    let out = "";

    const wald = data.map(r => Math.min(...r));
    out += "WALD:\n" + wald.map((v,i)=>`S${i+1}: ${v}`).join("\n") + "\n\n";

    const hur = data.map(r =>
        alpha * Math.min(...r) + (1-alpha) * Math.max(...r)
    );
    out += "HURWICZ:\n" + hur.map((v,i)=>`S${i+1}: ${v.toFixed(2)}`).join("\n") + "\n\n";

    const bayes = data.map(r =>
        r.reduce((s,v,i)=> s + v*(probs[i]||0), 0)
    );
    out += "BAYES (średnia ważona):\n" +
        bayes.map((v,i)=>`S${i+1}: ${v.toFixed(2)}`).join("\n") +
        `\n=> Najlepsza: S${bayes.indexOf(Math.max(...bayes))+1}`;

    result.innerText = out;
}

render();
renderBayes();

/* ===== POZOSTAŁE ZAKŁADKI ===== */
/* (teoria gier, węgierski, parametryczna – BEZ ZMIAN względem poprzedniej wersji) */
