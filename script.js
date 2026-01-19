/* ================= ZAKŁADKI ================= */
function showTab(id) {
    ["games","hungarian"].forEach(t =>
        document.getElementById(t).classList.add("hidden")
    );
    document.getElementById(id).classList.remove("hidden");
}

/* ================= TEORIA GIER – x ================= */
let gRows = 2, gCols = 2;
const gTable = document.getElementById("gameTable");

function renderGame() {
    gTable.innerHTML =
        "<tr><th>A\\B</th>" +
        [...Array(gCols)].map((_,j)=>`<th>B${j+1}</th>`).join("") +
        "</tr>";

    for (let i=0;i<gRows;i++) {
        gTable.innerHTML +=
            `<tr><th>A${i+1}</th>` +
            [...Array(gCols)].map(()=>"<td><input value='0'></td>").join("") +
            "</tr>";
    }
}
function addGameRow(){ gRows++; renderGame(); }
function removeGameRow(){ if(gRows>1) gRows--; renderGame(); }
function addGameCol(){ gCols++; renderGame(); }
function removeGameCol(){ if(gCols>1) gCols--; renderGame(); }

renderGame();

function analyzeSaddle() {
    const inputs=[...gTable.querySelectorAll("input")];
    const xIndex=inputs.findIndex(i=>i.value.trim()==="x");

    if(xIndex===-1){
        gameResult.innerText="❌ Wpisz dokładnie jedno x.";
        return;
    }

    const base=[];
    let k=0;
    for(let i=0;i<gRows;i++){
        base[i]=[];
        for(let j=0;j<gCols;j++){
            base[i][j]=inputs[k].value==="x"?"x":Number(inputs[k].value);
            k++;
        }
    }

    const XMIN=-500, XMAX=500;
    let intervals=[], open=false, start=null;

    for(let x=XMIN;x<=XMAX;x++){
        const m=base.map(r=>r.map(v=>v==="x"?x:v));
        const rowMin=m.map(r=>Math.min(...r));
        const colMax=m[0].map((_,j)=>Math.max(...m.map(r=>r[j])));
        const maximin=Math.max(...rowMin);
        const minimax=Math.min(...colMax);

        if(Math.abs(maximin-minimax)<1e-6){
            if(!open){ open=true; start=x; }
        } else if(open){
            intervals.push([start,x-1]);
            open=false;
        }
    }
    if(open) intervals.push([start,XMAX]);

    if(intervals.length===0){
        gameResult.innerText="❌ Brak x dających punkt siodłowy.";
        return;
    }

    let out="🎯 Gra jest siodłowa dla:\n\n";
    intervals.forEach(i=>out+=`x ∈ [${i[0]}, ${i[1]}]\n`);
    gameResult.innerText=out;
}

/* ================= ALGORYTM WĘGIERSKI ================= */
let hRows=3,hCols=3;
const hTable=document.getElementById("hungarianTable");

function renderHungarian(){
    hTable.innerHTML="<tr><th></th>"+
        [...Array(hCols)].map((_,j)=>`<th>Z${j+1}</th>`).join("")+"</tr>";
    for(let i=0;i<hRows;i++){
        hTable.innerHTML+=
            `<tr><th>W${i+1}</th>`+
            [...Array(hCols)].map(()=>"<td><input value='0'></td>").join("")+
            "</tr>";
    }
}
function addHungarianRow(){hRows++;renderHungarian();}
function removeHungarianRow(){if(hRows>1)hRows--;renderHungarian();}
function addHungarianCol(){hCols++;renderHungarian();}
function removeHungarianCol(){if(hCols>1)hCols--;renderHungarian();}

renderHungarian();

function solveHungarian(){
    let matrix=[...hTable.querySelectorAll("tr")].slice(1)
        .map(r=>[...r.querySelectorAll("input")].map(i=>+i.value));

    const mode=document.getElementById("hungarianMode").value;

    // MAKSYMALIZACJA → transformacja
    let maxVal=0;
    matrix.forEach(r=>r.forEach(v=>maxVal=Math.max(maxVal,v)));

    let cost = (mode==="max")
        ? matrix.map(r=>r.map(v=>maxVal-v))
        : matrix.map(r=>r.slice());

    const n=cost.length;
    const used=Array(n).fill(false);
    let best=Infinity, bestAssign=[];

    function dfs(i,sum,assign){
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
                dfs(i+1,sum+cost[i][j],assign);
                used[j]=false;
            }
        }
    }
    dfs(0,0,[]);

    let realValue = (mode==="max")
        ? bestAssign.reduce((s,j,i)=>s+matrix[i][j],0)
        : best;

    let out="Optymalny przydział:\n";
    bestAssign.forEach((j,i)=>out+=`W${i+1} → Z${j+1}\n`);
    out+=`\n`;
    out+= mode==="max"
        ? `Maksymalna wartość: ${realValue}`
        : `Minimalny koszt: ${realValue}`;

    hungarianResult.innerText=out;
}
