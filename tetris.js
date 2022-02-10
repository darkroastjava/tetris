var colors = {
    "red": "&#x1F7E5;", "green": "&#x1F7E9;", "blue": "&#x1F7E6;",
    "orange": "&#x1F7E7;", "yellow": "&#x1F7E8;", "pink": "&#x1F7EA;",
    "silver": "&#x2B1C;", "white": "&#x2B1A"
}

var R = colors.red, G = colors.green, B = colors.blue,
    O = colors.orange, Y = colors.yellow, P = colors.pink,
    S = colors.silver, W = colors.white;

var Block = function(board, color, forEachCell, initX, initY) {
    var _board = board, _xLength = _board[0].length, _yLength = _board.length,
        _x = _xLength / 2, _y = 0, _rot = 0, _color = color, _forEachCell = forEachCell;

    if (typeof initX != "undefined") { _x = initX; }
    if (typeof initY != "undefined") { _y = initY; }

    function _moveDown() {
        if (_collides(_rot, _x, _y + 1)) return true;
        _y++;
    }

    function _moveLeft() {
        if (_collides(_rot, _x - 1, _y)) return true;
        _x--;
    }

    function _moveRight() {
        if (_collides(_rot, _x + 1, _y)) return true;
        _x++;
    }

    function _rotate() {
        if (_collides((_rot + 1) % 4, _x, _y)) return true;
        _rot = (++_rot) % 4;
    }

    function _collides(rot, x, y) {
        var collides = false;

        _forEachCell(rot, x, y, function(x, y) {
            if (y >= _yLength || x < 0 || x >= _xLength || (y>=0 && _board[y][x] != S)) {
                collides = true;
            }
        });

        return collides;
    }

    function _place(board) {
        var newBoard = JSON.parse(JSON.stringify(_board)); // clone

        var xLength = newBoard[0].length;

        _forEachCell(_rot, _x, _y, function(x, y) {
            if (x < 0 || x >= _xLength || y < 0 || y >= _yLength) { return; }
            if (typeof newBoard[y][x] === 'undefined') {
                console.log('undefined');
            }
            newBoard[y][x] = _color;
        });

        return newBoard;
    }

    return {
        moveDown: _moveDown, moveLeft: _moveLeft, moveRight: _moveRight,
        rotate: _rotate, place: _place, colliding: function() { return _collides(_rot, _x, _y); }
    };
}

var IBlock = function(board, initX, initY) {
    return Block(board, R, function (rot, x, y, callback) {
        var c = callback;
        if (rot % 2 == 0) {
            c(x-1, y); c(x, y); c(x+1, y); c(x+2, y);
        }
        if (rot % 2 == 1) {
            c(x, y-1);
            c(x, y);
            c(x, y+1);
            c(x, y+2);
        }
    }, initX, initY);
}

var OBlock = function(board, initX, initY) {
    return Block(board, Y, function (rot, x, y, callback) {
        var c = callback;

        c(x, y);   c(x+1, y);
        c(x, y+1); c(x+1, y+1);
    }, initX, initY);
}

var SBlock = function(board, initX, initY) {
    return Block(board, P, function (rot, x, y, callback) {
        var c = callback;

        if (rot % 2 == 0) {
                         c(x, y);   c(x+1, y);
            c(x-1, y+1); c(x, y+1);
        }
        if (rot % 2 == 1) {
            c(x-1, y-1);
            c(x-1, y);   c(x, y);   
                         c(x, y+1);
        }
    }, initX, initY);
}

var ZBlock = function(board, initX, initY) {
    return Block(board, G, function (rot, x, y, callback) {
        var c = callback;

        if (rot % 2 == 0) {
            c(x-1, y); c(x, y);
                       c(x, y+1); c(x+1, y+1);
        }
        if (rot % 2 == 1) {
                       c(x+1, y-1);
            c(x, y);   c(x+1, y);
            c(x, y+1);
        }
    }, initX, initY);
}

var JBlock = function(board, initX, initY) {
    return Block(board, B, function (rot, x, y, callback) {
        var c = callback;

        switch (rot) {
            case 0:
                             c(x, y-1);
                             c(x, y);
                c(x-1, y+1); c(x, y+1);
                break;
            case 1:
                c(x-1, y); c(x, y); c(x+1, y);
                                    c(x+1, y+1);
                break;
            case 2:
                c(x, y-1); c(x+1, y-1);
                c(x, y);
                c(x, y+1);
                break;
            case 3:
                c(x-1, y-1);
                c(x-1, y); c(x, y); c(x+1, y);
                break;
        }
    }, initX, initY);
}

var LBlock = function(board, initX, initY) {
    return Block(board, O, function (rot, x, y, callback) {
        var c = callback;

        switch (rot) {
            case 0:
                c(x, y-1);
                c(x, y);
                c(x, y+1); c(x+1, y+1);
                break;
            case 1:
                                    c(x+1, y-1);
                c(x-1, y); c(x, y); c(x+1, y);
                break;
            case 2:
                c(x-1, y-1); c(x, y-1);
                             c(x, y);
                             c(x, y+1);
                break;
            case 3:
                c(x-1, y); c(x, y); c(x+1, y);
                c(x-1, y+1);
                break;
        }
    }, initX, initY);
}

var blocksPallette = [
    IBlock, OBlock, ZBlock, LBlock, JBlock, SBlock
];

function randomBlock() {
    var max = blocksPallette.length;
    return blocksPallette[Math.floor(Math.random() * max)];
}

function createBoard(width, height, color) {
    var x, y, row, board;

    board = [];
    for (y = 0; y < height; y++) {
        row = [];
        for (x = 0; x < width; x++) {
            row.push(color);
        }
        board.push(row);
    }
    return board;
}



var initialBoard = createBoard(10, 20, S);

var previewBoard = createBoard(6, 6, S);

var state = {
    "board": initialBoard,
    "preview": previewBoard,
    "currentBlock": randomBlock()(initialBoard),
    "nextBlock": randomBlock(),
    "score": 0
}



function renderBoard(board, targetDiv) {
    var row, cell, rowText, rowDiv, document;

    targetDiv.innerHTML = "";
    document = targetDiv.ownerDocument;

    for (row of board) {
        rowText = "";

        for (cell of row) {
            rowText = rowText + cell;
        }
        
        rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        rowDiv.innerHTML = rowText;
        targetDiv.appendChild(rowDiv);
    }
}

function render() {
    renderBoard(state.currentBlock.place(state.board), document.getElementById("board"));

    var previewBlock = state.nextBlock(state.preview, 2, 2);

    renderBoard(
        previewBlock.place(state.preview),
        document.getElementById("preview"));

    document.getElementById("score").innerText = state.score;
}

function gameOver() {
    document.getElementById("gameover").style.visibility = "visible";
}

function rowIsFull(rowY) {
    var row = state.board[rowY], cell;
    for (cell of row) {
        if (cell == S) { return false; }
    }
    return true;
}

function removeRow(rowY) {
    var rowToRemove, rowToCopy, x, y;

    for (y = rowY; y > 0; y--) {
        rowToRemove = state.board[y];
        rowToCopy = state.board[y-1];
        for (x = 0; x < rowToRemove.length; x++) {
            rowToRemove[x] = rowToCopy[x];
        }
    }

    rowToRemove = state.board[0]
    for (x = 0; x < rowToRemove.length; x++) {
        rowToRemove[x] = S;
    }
}

function removeFullRows() {
    var y, rowsRemoved = 0;

    for (y = state.board.length - 1; y >= 0; y--) {
        if (rowIsFull(y)) {
            removeRow(y);
            rowsRemoved++;
            y++; // check same row again in next iteration
        }
    }

    state.score += rowsRemoved * rowsRemoved * 10;
}

function delay() {
    return 1000 - 80 * Math.log2(state.score + 1);
}

var xDown = null, yDown = null, xUp = null, yUp = null;

window.ontouchstart = function(event) {
    xDown = event.touches[0].clientX;
    yDown = event.touches[0].clientY;
    console.log("down " + xDown + ", " + yDown);
};

window.ontouchmove = function(event) {
    xUp = event.touches[0].clientX;
    yUp = event.touches[0].clientY;

    var dx = xUp - xDown,
        dy = yUp - yDown,
        dx2 = dx * dx,
        dy2 = dy * dy;

    console.log("mv " + xUp + ", " + yUp);
    if ( dx2 + dy2 < 1000 ) {
        /* insignificant */
    } else {

        if ( dx2 > dy2 ) {
            if ( dx > 0 ) {
                /* right swipe */
                state.currentBlock.moveRight();
            } else {
                /* left swipe */
                state.currentBlock.moveLeft();
            }                       
        } else {
            if ( dy > 0 ) {
                /* down swipe */
                state.currentBlock.moveDown();          
            }
        }
        
        /* reset values */
        xDown = xUp;
        yDown = yUp;
    }


    render();
};

window.ontouchend = function(event) {
    if (xUp == null) {
        /* tap */
        state.currentBlock.rotate();
    }

    /* reset values */
    xDown = null;
    yDown = null;
    xUp = null;
    yUp = null;
    render();
};

window.onkeydown = function(event) {
    switch (event.code) {
        case "ArrowLeft": state.currentBlock.moveLeft(); break;
        case "ArrowRight": state.currentBlock.moveRight(); break;
        case "ArrowUp": state.currentBlock.rotate(); break;
        case "ArrowDown": state.currentBlock.moveDown(); break;
        case "Space":
            while (!!!state.currentBlock.moveDown()) {};
            break;
    }
    render();
};

document.getElementById("share").onclick = function() {
    var shareData = {
        text: "My tetris score: " + state.score + "\n"
            + "\n"
            + "⬜⬜🟧\n"
            + "🟧🟧🟧\n"
            + "\n"
            + window.top.location.href
    };

    navigator.share(shareData);
};




render();

(function loop(){
    window.setTimeout(function() {
        var bottom = state.currentBlock.moveDown();

        if (bottom) {
            state.board = state.currentBlock.place(state.board);
            removeFullRows();
            state.currentBlock = state.nextBlock(state.board);
            state.nextBlock = randomBlock();
            if (state.currentBlock.colliding()) {
                gameOver();
                window.onkeydown = null;
                return;
            }
        }

        render();
        loop();
    }, delay());
})();
