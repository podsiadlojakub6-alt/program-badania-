/* ================= ZAKŁADKI ================= */
function showTab(id) {
    ["nature","games","hungarian"].forEach(t =>
        document.getElementById(t).classList.add("hidden")
    );
    document.getElementById(id).classList.remove("hidden");
}

/* ================= GRA Z NATURĄ ================= */
let rows = 3, cols = 3;
const table = document.getElementById("matrix");

function render() {
    table.innerHTML = "";
    let h = "<tr><th>Strategia</th>";
    for (let j=0;j<cols;j++) h += `<th>Stan ${j+1}</th>`;
    h += "</tr>";
    table.innerHTML += h;

    for (let i=0;i<rows;i++) {
        let r = `<tr><td>S${i+1}</td>`;
        for (let j=0;j<cols;j++) r += `<td><input value="0"></td>`;
        r += "</tr>";
        table.innerHTML += r;
    }
}
function addRow(){rows++;render();}
function removeRow(){if(rows>1)rows--;render();}
function addColumn(){cols++;render();}
function removeColumn(){if(cols>1)cols--;render();}

function calculateNature() {
    const data=[...table.querySelectorAll("tr")].slice(1)
        .map(r=>[...r.querySelectorAll("input")].map(i=>+i.value));
    const alpha=+alpha.value;
    const probs=probabilities.value.split(",").map(Number);

    let out="";

    const wald=data.map(r=>Math.min(...r));
    out+="WALD:\n"+wald.map((v,i)=>`S${i+1}: ${v}`).join("\n")+
         `\n=> S${wald.indexOf(Math.max(...wald))+1}\n\n`;

    const hur=data.map(r=>alpha*Math.min(...r)+(1-alpha)*Math.max(...r));
    out+="HURWICZ:\n"+hur.map((v,i)=>`S${i+1}: ${v.toFixed(2)}`).join("\n")+
         `\n=> S${hur.indexOf(Math.max(...hur))+1}\n\n`;

    const bay=data.map(r=>r.reduce((s,v,i)=>s+v*(probs[i]||0),0));
    out+="BAYES:\n"+bay.map((v,i)=>`S${i+1}: ${v.toFixed(2)}`).join("\n")+
         `\n=> S${bay.indexOf(Math.max(...bay))+1}\n`;

    result.innerText=out;
}
render();

/* ================= GRY DWUOSOBOWE ================= */
let gRows = 2, gCols = 2;
const gTable = document.getElementById("gameTable");

function renderGame() {
    gTable.innerHTML = "";
    let h = "<tr><th>A \\ B</th>";
    for (let j=0;j<gCols;j++) h += `<th>B${j+1}</th>`;
    h += "</tr>";
    gTable.innerHTML += h;

    for (let i=0;i<gRows;i++) {
        let r = `<tr><th>A${i+1}</th>`;
        for (let j=0;j<gCols;j++) r += `<td><input value="0"></td>`;
        r += "</tr>";
        gTable.innerHTML += r;
    }
}

function addGameRow(){gRows++;renderGame();}
function removeGameRow(){if(gRows>1)gRows--;renderGame();}
function addGameCol(){gCols++;renderGame();}
function removeGameCol(){if(gCols>1)gCols--;renderGame();}

function calculateGame() {
    const data=[...gTable.querySelectorAll("tr")].slice(1)
        .map(r=>[...r.querySelectorAll("input")].map(i=>+i.value));

    let out="";

    // STRATEGIE CZYSTE
    const rowMin=data.map(r=>Math.min(...r));
    const colMax=data[0].map((_,j)=>Math.max(...data.map(r=>r[j])));

    const maximin=Math.max(...rowMin);
    const minimax=Math.min(...colMax);

    out+="STRATEGIE CZYSTE:\n";
    out+=`Maximin: ${maximin}\nMinimax: ${minimax}\n`;

    if(maximin===minimax){
        out+=`👉 Punkt siodłowy, wartość gry = ${maximin}\n\n`;
    } else {
        out+="👉 Brak punktu siodłowego\n\n";
    }

    // STRATEGIE MIESZANE (TYLKO 2x2)
    if(gRows===2 && gCols===2){
        const a=data[0][0], b=data[0][1];
        const c=data[1][0], d=data[1][1];
        const denom=a-b-c+d;

        if(denom!==0){
            const pA1=(d-c)/denom;
            const pA2=1-pA1;
            const pB1=(d-b)/denom;
            const pB2=1-pB1;
            const V=(a*d-b*c)/denom;

            out+="STRATEGIE MIESZANE (2×2):\n\n";
            out+=`Gracz A:\nA1: ${(pA1*100).toFixed(2)}%\nA2: ${(pA2*100).toFixed(2)}%\n\n`;
            out+=`Gracz B:\nB1: ${(pB1*100).toFixed(2)}%\nB2: ${(pB2*100).toFixed(2)}%\n\n`;
            out+=`VA = VB = ${V.toFixed(2)}\n`;
            out+=`Maksymalny zysk A: ${V.toFixed(2)}\n`;
            out+=`Maksymalna strata B: ${V.toFixed(2)}\n`;
        } else {
            out+="Strategie mieszane: brak (dzielnik = 0)\n";
        }
    } else {
        out+="Strategie mieszane liczone tylko dla macierzy 2×2\n";
    }

    gameResult.innerText=out;
}
renderGame();

/* ================= ALGORYTM WĘGIERSKI ================= */
let hRows=3,hCols=3;
const hTable=document.getElementById("hungarianTable");

function renderHungarian(){
    hTable.innerHTML="";
    let h="<tr><th></th>";
    for(let j=0;j<hCols;j++) h+=`<th>Z${j+1}</th>`;
    h+="</tr>";
    hTable.innerHTML+=h;

    for(let i=0;i<hRows;i++){
        let r=`<tr><th>W${i+1}</th>`;
        for(let j=0;j<hCols;j++) r+=`<td><input value="0"></td>`;
        r+="</tr>";
        hTable.innerHTML+=r;
    }
}

function addHungarianRow(){hRows++;renderHungarian();}
function removeHungarianRow(){if(hRows>1)hRows--;renderHungarian();}
function addHungarianCol(){hCols++;renderHungarian();}
function removeHungarianCol(){if(hCols>1)hCols--;renderHungarian();}

function solveHungarian(){
    const matrix=[...hTable.querySelectorAll("tr")].slice(1)
        .map(r=>[...r.querySelectorAll("input")].map(i=>+i.value));

    const n=matrix.length;
    const used=Array(n).fill(false);
    let best=Infinity, bestAssign=[];

    function backtrack(i,sum,assign){
        if(sum>=best) return;
        if(i===n){
            best=sum;
            bestAssign=[...assign];
            return;
        }
        for(let j=0;j<n;j++){
            if(!used[j]){
                used[j]=true;
                assign[i]=j;
                backtrack(i+1,sum+matrix[i][j],assign);
                used[j]=false;
            }
        }
    }
    backtrack(0,0,[]);
    let out="Optymalny przydział:\n";
    bestAssign.forEach((v,i)=>out+=`W${i+1} → Z${v+1}\n`);
    out+=`\nMinimalny koszt całkowity: ${best}`;
    hungarianResult.innerText=out;
}
renderHungarian();
