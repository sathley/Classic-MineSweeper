$(document).ready(enableMinesweeper());

function enableMinesweeper() {
    var numRows = ($('#inpRows').val());
    var numColumns = ($('#inpColumns').val());
    var numMines = $('#inpMines').val();
    $('#btnPlay').click(function () { minesweeper(numRows, numColumns, numMines, "divGame"); });
}

function minesweeper(numRows, numColumns, numMines, gameDivId) {
    //  Clear game area
    document.getElementById(gameDivId).innerHTML = "";
    
    var gameDiv = $("#" + gameDivId);
    if (typeof parseInt(numRows) !== 'number')
        alert(numRows + 'is an incorrect number of rows.');
    var rows = parseInt(numRows);
    if (typeof parseInt(numColumns) !== 'number')
        alert(numRows + 'is an incorrect number of columns.');
    var columns = parseInt(numColumns);
    if (typeof parseInt(numMines) !== 'number')
        alert(numMines + 'is an incorrect number of mines.');
    var mines = parseInt(numMines);

    // decide mine positions
    var minePositions = new Array;
    var numMinesCopy = mines;
    while (numMinesCopy != 0) {
        var random = Math.floor((Math.random() * rows * columns) + 1);
        if (minePositions.indexOf(random) === -1) {
            minePositions.push(random);
            numMinesCopy--;
        }
    }
    alert(minePositions);

    //  lay tiles, set mines, attach click events
    var btnId;
    var count = 0;
    for (var i1 = 0; i1 < rows; i1++) {
        var divId = "div_" + i1;
        var div = "<div id = '" + divId + "'><div>";
        gameDiv.append(div);
        for (var j1 = 0; j1 < columns; j1++) {
            btnId = "btn_" + i1 + "_" + j1;
            var btn = "<button style = 'margin:3px' class = 'btn btn-default btn-primary' id = '" + btnId + "'>&nbsp&nbsp&nbsp</button>";
            $("#" + divId).append(btn);
            $('#' + btnId).data.row = shitFunction(i1);
            $('#' + btnId).data.col = shitFunction(j1);
            $('#' + btnId).click(function() { btnClick({ maxRow: rows - 1, maxCol: columns - 1 }); });
            if (minePositions.indexOf(count) !== -1) {
                $("#" + btnId).data({ "ismine": true });
            }
        }
    }
    
    function shitFunction(lol) {
        return (function () {
            return lol;
        })();
    }


    //  Set scores
    for (i = 0; i < rows; i++) {
        for (j = 0; j < columns; j++) {
            var mineCount = 0;
            btnId = "#btn_" + i + "_" + j;

            if ($(btnId).data.ismine === true)
                $(btnId).data.score = -1;

            var adjacentButtons = new Array({ row: i - 1, col: j - 1 }, { row: i - 1, col: j }, { row: i - 1, col: j + 1 },
                { row: i, col: j - 1 }, { row: i, col: j + 1 },
                { row: i + 1, col: j - 1 }, { row: i + 1, col: j }, { row: i + 1, col: j + 1 });
            $.each(adjacentButtons, function (index, val) {
                if (isMine({ row: val.row, col: val.col, maxRow: rows - 1, maxCol: columns - 1 }) === true) {
                    mineCount++;
                }
            });
            $(btnId).data.score = mineCount;
        }
    }

    //  Checks if tile is mine

    function isMine(param) {
        var row = param.row;
        var col = param.col;
        var maxRow = param.maxRow;
        var maxCol = param.maxCol;
        if (row < 0 || row > maxRow || col < 0 || col > maxCol)
            return false;
        var id = "#btn_" + row + "_" + col;
        if ($(id).data.ismine === true)
            return true;
        return false;
    }

    function btnClick(params) {
        btnId = "#btn_" + $(this).data.row + "_" + $(this).data.col;
        if ($(btnId).data("ismine") === true)
            alert("Kaboom!");
        else {
            openTile({ maxRow: params.maxRow, maxCol: params.maxCol, row: $(this).data.row, col: $(this).data.col });
        }
    }

    function openTile(params) {
        if (params.row < 0 || params.row > params.maxRow || params.col < 0 || params.col > params.maxCol)
            return;
        btnId = "#btn_" + params.row + "_" + params.col;
        if ($(btnId).attr("disable") === true)
            return;
        if ($(btnId).data.score > 0) {
            $(btnId).text = $(btnId).data.score;
            $(btnId).attr("disable", true);
            $(btnId).addClass("disabled");
            return;
        }
        if ($(btnId).data.score === 0) {
            var adjacentbtns = new Array({ row: params.row - 1, col: params.col - 1 }, { row: params.row - 1, col: params.col }, { row: params.row - 1, col: params.col + 1 },
                { row: params.row, col: params.col - 1 }, { row: params.row, col: params.col + 1 },
                { row: params.row + 1, col: params.col - 1 }, { row: params.row + 1, col: params.col }, { row: params.row + 1, col: params.col + 1 });
            $.each(adjacentbtns, function (index, val) { openTile({ row: val.row, col: val.col, maxRow: params.maxRow, maxCol: params.maxCol }); });
        }
    }
}