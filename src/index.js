const Colors = { ALIVE: 'purple', DEAD: ' lightcyan' }
const WIDTH = document.body.clientWidth
const HEIGHT = document.body.clientHeight
const CELL_SIZE = 5
const CELLS_WIDTH = WIDTH / CELL_SIZE
const CELLS_HEIGHT = HEIGHT / CELL_SIZE

const rulesNumber = document.getElementById('rules-number')
rulesNumber.value = Math.floor(Math.random() * 256)

rulesNumber.addEventListener('change', function (ev) {
	civilization.length = 0
	civilization.push(createFirstGeneration(CELLS_WIDTH))
	rules = numberToByteArray(ev.target.value)
})

let rules = numberToByteArray(rulesNumber.value)

const canvas = document.createElement('canvas')
canvas.width = WIDTH
canvas.height = HEIGHT

const container = document.getElementById('container')
container.append(canvas)

let civilization = []
civilization.push(createFirstGeneration(CELLS_WIDTH))

function draw() {
	const context = canvas.getContext('2d')
	context.clearRect(0, 0, WIDTH, HEIGHT)

	for (let i = 0; i < CELLS_WIDTH; i++) {
		for (var j = 0; j < CELLS_HEIGHT; j++) {
			const cellColor = civilization[j] && civilization[j][i] === 1 ? Colors.ALIVE : Colors.DEAD
			renderSquare(context, i, j, cellColor)
		}
	}

	if (civilization.length < CELLS_HEIGHT) {
		civilization.push(getNextGeneration(civilization[civilization.length - 1]))
	} else {
		civilization.length = 0
		civilization.push(createFirstGeneration(CELLS_WIDTH))
		rules = numberToByteArray(rulesNumber.value)
	}

	requestAnimationFrame(draw)
}

function renderSquare(context, x, y, color) {
	context.fillStyle = color
	context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
}

draw()

function getNextGeneration(currentGeneration) {
	const size = currentGeneration.length
	const nextGeneration = []
	for (let i = 0; i < size; i += 1) {
		const leftCell = (i === 0) ? currentGeneration[size - 1] : currentGeneration[i - 1]
		const currentCell = currentGeneration[i]
		const rightCell = (i === size - 1) ? currentGeneration[0] : currentGeneration[i + 1]
		nextGeneration.push(evolve(leftCell, currentCell, rightCell))
	}
	return nextGeneration
}

function evolve(leftCell, currentCell, rightCell) {
	return rules[parseInt(`${leftCell}${currentCell}${rightCell}`, 2)]
}

function createFirstGeneration(size) {
	const getRandomCell = () => (Math.floor(Math.random() * 1000) > 500) ? 1 : 0
	const generation = []
	for (let i = 0; i < size; i++) generation.push(getRandomCell())
	return generation
}

function numberToByteArray(number) {
	return ('0000000' + (parseInt(number, 10)).toString(2)).slice(-8).split('').map(x => parseInt(x, 2))
}
