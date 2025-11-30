const Colors = { ALIVE: '#FCF951', DEAD: 'black' /* '#422057' */ }
const WIDTH = document.body.clientWidth
const HEIGHT = document.body.clientHeight
const CELL_SIZE = 5
const CELLS_WIDTH = WIDTH / CELL_SIZE
const CELLS_HEIGHT = HEIGHT / CELL_SIZE

const rulesNumber = document.getElementById('rules-number')
rulesNumber.value = Math.floor(Math.random() * 256)
rulesNumber.addEventListener('change', function (ev) {
	civilization.length = 0
	civilization.push(createFirstGeneration())
	rules = numberToByteArray(ev.target.value)
})

const aliveRatio = document.getElementById('alive-ratio')
aliveRatio.value = 50;
aliveRatio.addEventListener('change', function () {
	civilization.length = 0
	civilization.push(createFirstGeneration())
})
const aliveRatioControl = document.getElementById('alive-ratio-control')

const initialGenStrategy = document.getElementById('initial-gen-strategy')
initialGenStrategy.addEventListener('change', function (ev) {
	strategy = ev.target.selectedOptions[0].value
	if (strategy == 'random') {
		aliveRatioControl.classList.remove('hidden')
	} else {
		aliveRatioControl.classList.add('hidden')
	}
	civilization.length = 0
	civilization.push(createFirstGeneration())
})

let strategy = initialGenStrategy.selectedOptions[0].value;

let rules = numberToByteArray(rulesNumber.value)

const canvas = document.createElement('canvas')
canvas.width = WIDTH
canvas.height = HEIGHT

const container = document.getElementById('container')
container.append(canvas)

let civilization = []
civilization.push(createFirstGeneration())

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

function createFirstGeneration() {
	const strategies = {
		random: function () {
			const getRandomCell = () => (Math.random() * 100 < aliveRatio.value) ? 1 : 0
			const generation = []
			for (let i = 0; i < CELLS_WIDTH; i++) generation.push(getRandomCell())
			// for (let i = 0; i < CELLS_WIDTH; i++) generation.push(0)
			// generation[Math.floor(CELLS_WIDTH / 2)] = 1
			return generation
		},
		'only-1': function () {
			const generation = []
			for (let i = 0; i < CELLS_WIDTH; i++) generation.push(0)
			generation[Math.floor(CELLS_WIDTH / 2)] = 1
			return generation
		},
		'all-but-1': function () {
			const generation = []
			for (let i = 0; i < CELLS_WIDTH; i++) generation.push(1)
			generation[Math.floor(CELLS_WIDTH / 2)] = 0
			return generation
		},
		none: function () {
			const generation = []
			for (let i = 0; i < CELLS_WIDTH; i++) generation.push(0)
			return generation
		},
		even: function () {
			const generation = []
			for (let i = 0; i < CELLS_WIDTH; i++) generation.push((i % 2 === 0) ? 1 : 0)
			return generation
		},
		half: function () {
			const generation = []
			for (let i = 0; i < CELLS_WIDTH; i++) generation.push((i < CELLS_WIDTH / 2) ? 1 : 0)
			return generation
		}
	}

	return strategies[strategy]()
}



function numberToByteArray(number) {
	return ('0000000' + (parseInt(number, 10)).toString(2)).slice(-8).split('').map(x => parseInt(x, 2)).reverse()
}

// const context = canvas.getContext('2d')
// context.clearRect(0, 0, WIDTH, HEIGHT)
// let currentRow = 0;

(function draw() {
	function getRandom2DigitHex() {
		return Math.floor(Math.random() * 15).toString(16)
	}

	function getRandomAliveColor() {
		return `#${getRandom2DigitHex()}${getRandom2DigitHex()}${getRandom2DigitHex()}`
	}

	function renderSquare(context, x, y, color) {
		context.fillStyle = color
		context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
	}

	const context = canvas.getContext('2d')
	context.clearRect(0, 0, WIDTH, HEIGHT)

	// const j = currentRow

	for (let i = 0; i < CELLS_WIDTH; i++) {
		for (let j = 0; j < CELLS_HEIGHT; j++) {
			const cellColor = civilization[j] && civilization[j][i] === 1 ? Colors.ALIVE : Colors.DEAD
			// const cellColor = civilization[j] && civilization[j][i] === 1 ? getRandomAliveColor() : Colors.DEAD
			renderSquare(context, i, j, cellColor)
		}
	}

	// currentRow = (currentRow < CELLS_HEIGHT) ? currentRow + 1 : 0

	if (civilization.length < CELLS_HEIGHT) {
		civilization.push(getNextGeneration(civilization[civilization.length - 1]))
	} else {
		civilization.length = 0
		civilization.push(createFirstGeneration())
		// rules = numberToByteArray(rulesNumber.value)
	}

	setTimeout(() => {
		requestAnimationFrame(draw)
	}, 50)
})()
