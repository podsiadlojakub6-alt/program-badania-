<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Kalkulator teorii decyzji i gier</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="tabs">
    <button onclick="showTab('nature')">🌿 Gra z naturą</button>
    <button onclick="showTab('games')">🎲 Gry dwuosobowe</button>
    <button onclick="showTab('hungarian')">🧩 Algorytm węgierski</button>
</div>

<!-- ================= GRA Z NATURĄ ================= -->
<div id="nature" class="card">
    <h1>Gra z naturą</h1>

    <div class="controls">
        <button onclick="addRow()">➕ Strategia</button>
        <button onclick="removeRow()">➖ Strategia</button>
        <button onclick="addColumn()">➕ Stan natury</button>
        <button onclick="removeColumn()">➖ Stan natury</button>
    </div>

    <table id="matrix"></table>

    <div class="params">
        <label>α (Hurwicz):
            <input id="alpha" value="0.6">
        </label>

        <label>Prawdopodobieństwa (Bayes):
            <input id="probabilities" value="0.3,0.3,0.4">
        </label>
    </div>

    <button class="main" onclick="calculateNature()">Oblicz</button>
    <pre id="result"></pre>
</div>

<!-- ================= GRY DWUOSOBOWE ================= -->
<div id="games" class="card hidden">
    <h1>Gra dwuosobowa (suma zerowa)</h1>

    <div class="controls">
        <button onclick="addGameRow()">➕ Strategia A</button>
        <button onclick="removeGameRow()">➖ Strategia A</button>
        <button onclick="addGameCol()">➕ Strategia B</button>
        <button onclick="removeGameCol()">➖ Strategia B</button>
    </div>

    <table id="gameTable"></table>

    <button class="main" onclick="calculateGame()">Oblicz grę</button>
    <pre id="gameResult"></pre>
</div>

<!-- ================= ALGORYTM WĘGIERSKI ================= -->
<div id="hungarian" class="card hidden">
    <h1>Algorytm węgierski – problem przydziału</h1>

    <div class="controls">
        <button onclick="addHungarianRow()">➕ Wiersz</button>
        <button onclick="removeHungarianRow()">➖ Wiersz</button>
        <button onclick="addHungarianCol()">➕ Kolumna</button>
        <button onclick="removeHungarianCol()">➖ Kolumna</button>
    </div>

    <table id="hungarianTable"></table>

    <button class="main" onclick="solveHungarian()">Rozwiąż</button>
    <pre id="hungarianResult"></pre>
</div>

<script src="script.js"></script>
</body>
</html>
