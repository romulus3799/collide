const width = 612
const height = 612
const TILE_SIZE = width/9
const WHITE_SQR_URL = 'img/white-square.png'
const BLACK_SQR_URL = 'img/black-square.png'
const SPEED_DELAY = 100
const MIN_SAFE_BOUND = width/9
const MAX_SAFE_BOUND = width*8/9

let bishop,
	pieceSize = 30,
	rook,
	queen,
	board = [],
	bPressed = false,
	qPressed = false,
	gameOver = false

for (let r = 65; r <= 72; r++) {
	let row = []
	for (let c = 8; c >= 1; c--) {
		row.push({
			name : String.fromCharCode(r) + c,
			row : r - 65,
			col : 8 - c,
			occupied : false,
			x : width*(9-c)/9,
			y : height*((r-64))/9,
			sprite : null
		})
	}
	board.push(row)
}

function setup() {
	createCanvas(width,height);

	//create borders of every side of the window
	wN = createSprite(width/2,0,width,1);
	wE = createSprite(width,height/2,1,height);
	wS = createSprite(width/2,height,width,1);
	wW = createSprite(0,height/2,1,height);

	//iterate over board, creating sprites for every tile
	let white = true
	for (row of board) {
		for (t of row) {
			//place tile in its corresponding coordinates
			t.sprite = createSprite(t.x,t.y,TILE_SIZE,TILE_SIZE)
			//t.sprite.addImage(loadImage(white ? WHITE_SQR_URL : BLACK_SQR_URL))
		}
		// TODO: prevent overlap on same tile
	}

	rook = createSprite(board[1][1].x, board[1][1].y, pieceSize, pieceSize)
	rook.addImage(loadImage('https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg'))
	bishop = createSprite(board[5][5].x, board[5][5].y, pieceSize, pieceSize)
	bishop.addImage(loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Chess_blt45.svg/45px-Chess_blt45.svg.png'))
	queen = createSprite(board[7][6].x, board[7][6].y, pieceSize, pieceSize)
	queen.addImage(loadImage('https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg'))
}

function draw() {

	let rookX = rook.position.x,
		rookY = rook.position.y
	if(keyDown("a")){
		move(() => {
			rook.position.x -= TILE_SIZE
		})
    }
    if(keyDown("d")){
		move(() => {
			rook.position.x += TILE_SIZE
		})
    }
    if(keyDown("w")){
		move(() => {
			rook.position.y -= TILE_SIZE
		})
    }
	if(keyDown("s")){
		move(() => {
			rook.position.y += TILE_SIZE
		})
    }
	if(rook.position.x < MIN_SAFE_BOUND ||
		rook.position.x > MAX_SAFE_BOUND ||
		rook.position.y < MIN_SAFE_BOUND ||
		rook.position.y > MAX_SAFE_BOUND) {
		rook.position.x = rookX
		rook.position.y = rookY
	}

	let bishopX = bishop.position.x,
	bishopY = bishop.position.y,
	choice = Math.floor(random(0,4))
	switch (choice) {
		case 0:
		moveBishop(() => {
			bishop.position.x -= TILE_SIZE
			bishop.position.y -= TILE_SIZE
		})
		break;

		case 1:
		moveBishop(() => {
			bishop.position.x += TILE_SIZE
			bishop.position.y -= TILE_SIZE
		})
		break;

		case 2:
		moveBishop(() => {
			bishop.position.x += TILE_SIZE
			bishop.position.y += TILE_SIZE
		})
		break;

		case 3:
		moveBishop(() => {
			bishop.position.x -= TILE_SIZE
			bishop.position.y += TILE_SIZE
		})
		break;

		default:
		moveBishop(() => {
			bishop.position.x += TILE_SIZE
			bishop.position.y -= TILE_SIZE
		})
	}

	if((bishop.position.x < MIN_SAFE_BOUND ||
		bishop.position.x > MAX_SAFE_BOUND ||
		bishop.position.y < MIN_SAFE_BOUND ||
		bishop.position.y > MAX_SAFE_BOUND)
		&& !gameOver) {
			bishop.position.x = bishopX
			bishop.position.y = bishopY
	}

	let r = -1,
		c = -1,
		qx = queen.position.x,
		qy = queen.position.y,
		rx = rook.position.x,
		ry = rook.position.y
	//locate position of queen
	for(row of board) {
		for (t of row) {
			if(queen.position.x === t.x) {
				c = t.col
			}
			if(queen.position.y === t.y) {
				r = t.row
			}
		}
	}
	let xMove = 0,
		yMove = 0

	//decide where to move in x-dir
	if (qx > rx) {
		xMove = -TILE_SIZE
	} else if (qx < rx) {
		xMove = TILE_SIZE
	}
	if (qy > ry) {
		yMove = -TILE_SIZE
	} else if (qy < ry) {
		yMove = TILE_SIZE
	}
	console.log('xMove: ' + xMove);
	console.log('yMove: ' + yMove);
	moveQueen(() => {
		queen.position.x += xMove
		queen.position.y += yMove
	})


	if((queen.position.x < MIN_SAFE_BOUND ||
		queen.position.x > MAX_SAFE_BOUND ||
		queen.position.y < MIN_SAFE_BOUND ||
		queen.position.y > MAX_SAFE_BOUND)
		&& !gameOver) {
			queen.position.x = qx
			queen.position.y = qy
	}

	rook.overlap(queen,() => {
		gameOver = true
		rook.visible = false
		rx = rook.position.x
		ry = rook.position.y
		rook.position.x = 0
		rook.position.y = 0
		queen.position.x = rx
		queen.position.y = ry
		setTimeout(function () {
			alert('You were captured by the queen!')
			remove()
		}, 10);
	})
	rook.overlap(bishop,() => {
		gameOver = true
		rook.visible = false
		rx = rook.position.x
		ry = rook.position.y
		rook.position.x = 0
		rook.position.y = 0
		bishop.position.x = rx
		bishop.position.y = ry
		setTimeout(function () {
			alert('You were captured by the bishop!')
			remove()
		}, 10);
	})

	background(25)
	drawSprites()
}

//helper methods
function range(len) {
	let r = []
	for (var i = 0; i < len; i++) {
		r.push(i)
	}
	return r
}
function move(f) {
	if(!bPressed) {
		f()
		bPressed = true
		setTimeout(function () {
			bPressed = false
		}, SPEED_DELAY)
	}
}
function moveBishop(f) {
	if(!bPressed) {
		f()
		bPressed = true
		setTimeout(function () {
			bPressed = false
		}, SPEED_DELAY*4)
	}
}
function moveQueen(f) {
	if(!qPressed) {
		f()
		qPressed = true
		setTimeout(function () {
			qPressed = false
		}, SPEED_DELAY*12)
	}
}
