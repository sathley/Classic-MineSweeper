$(document).ready(enableMinesweeper());

function enableMinesweeper() {
    $('#btnPlay').click({ gameDivId: "divGame" }, minesweeper);
}

function minesweeper(param) {

    var $gameDiv = $("#" + param.data.gameDivId);
    $gameDiv.empty();

    var rowVal = $('#divControls #inpRows').val();
    if ($.isNumeric(rowVal) === false) {
        alert(rowVal + ' is an incorrect number of rows.');
        return;
    }
    var rows = parseInt(rowVal);

    var colVal = $('#divControls #inpColumns').val();
    if ($.isNumeric(colVal) === false) {
        alert(colVal + ' is an incorrect number of columns.');
        return;
    }
    var columns = parseInt(colVal);

    var mineVal = $('#divControls #inpMines').val();
    if ($.isNumeric(mineVal) === false) {
        alert(mineVal + ' is an incorrect number of mines.');
        return;
    }
    var mines = parseInt(mineVal);

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
    //alert(minePositions);

    //  lay tiles, set mines, attach click events
    var btnId;
    var tileCount = 0;
    for (var i1 = 0; i1 < rows; i1++) {
        var divId = "div_" + i1;
        var div = "<div id = '" + divId + "'><div>";
        $gameDiv.append(div);
        for (var j1 = 0; j1 < columns; j1++) {
            btnId = "btn_" + i1 + "_" + j1;
            var btn = "<button style = 'margin:3px' class = 'btn btn-default btn-primary' id = '" + btnId + "'>&nbsp&nbsp&nbsp</button>";
            $("#" + divId).append(btn);
            var parameters;
            if (minePositions.indexOf(tileCount) !== -1) {
                $("#" + btnId).data("ismine", true);
                parameters = { row: i1, col: j1, maxRow: rows, maxCol: columns, isRecursing: false };
                $('#' + btnId).on("click", parameters, btnClick);
            } else {
                $("#" + btnId).data("ismine", false);
                parameters = { row: i1, col: j1, maxRow: rows, maxCol: columns, isRecursing: false };
                $('#' + btnId).on("click", parameters, btnClick);
            }
            tileCount++;
        }
    }
}

function btnClick(e, params) {
    var row, col , maxRow, maxCol, isRecursing;
    if (params) {
        row = params.row;
        col = params.col;
        isRecursing = params.isRecursing;
        maxRow = params.maxRow;
        maxCol = params.maxCol;
    } else {
        row = e.data.row;
        col = e.data.col;
        isRecursing = e.data.isRecursing;
        maxRow = e.data.maxRow;
        maxCol = e.data.maxCol;
    }
    
    //alert(row + ',' + col + '  ' + maxRow + ',' + maxCol + ' ' + isMine + ' ' + isRecursing);
    //  If mine 
    if ($("#btn_" + row + "_" + col).attr("disabled") === "disabled")
        return;
    var isMine = $("#btn_" + row + "_" + col).data("ismine");

    if (isRecursing === true && isMine === true)
        return;
    var $btn;
    if (isRecursing === false && isMine === true) {
        alert("Kaboom !");
        for (var i = 0; i < maxRow; i++) {
            for (var j = 0; j < maxCol; j++) {
                $btn = $('#btn_' + i + "_" + j);
                $btn.attr("disabled", "disabled");
                $btn.off();
                if ($btn.data("ismine") === true) {
                    $btn.text(" X ");
                }
            }
        }
        return;
    }

    $btn = $('#btn_' + row + "_" + col);
    $btn.attr("disabled", "disabled");
    var score = 0;
    var adjacentButtons = new Array({ row1: row - 1, col1: col - 1 }, { row1: row - 1, col1: col }, { row1: row - 1, col1: col + 1 },
            { row1: row, col1: col - 1 }, { row1: row, col1: col + 1 },
            { row1: row + 1, col1: col - 1 }, { row1: row + 1, col1: col }, { row1: row + 1, col1: col + 1 });

    $.each(adjacentButtons, function (index, val) {
        if (val.row1 < 0 || val.row1 > maxRow - 1 || val.col1 < 0 || val.col1 > maxCol - 1) {
        }
        else {
            var id = "#btn_" + val.row1 + "_" + val.col1;
            if ($(id).data("ismine") === true)
                score++;
        }
    });

    if (score !== 0) {
        $btn.html("&nbsp" + score.toString() + "&nbsp");
    }
    else {
        $btn.html("&nbsp&nbsp&nbsp");
        $.each(adjacentButtons, function (index, val) {
            if (val.row1 < 0 || val.row1 > maxRow - 1 || val.col1 < 0 || val.col1 > maxCol - 1) {
            } else {
                $btn.trigger("click", [{ row: val.row1, col: val.col1, maxRow: maxRow, maxCol: maxCol,  isRecursing: true }]);
            }
        });
    }
}
