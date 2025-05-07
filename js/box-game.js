const BOXES = Array.from({ length: 12 }, (_, index) => ({
	id: index + 1,
}))

let attempts = 0
const maxAttempts = 3
let isBoxGameStarted = false
let boxClicked = {}
let prizeBoxIndex = null
let prizeTimeout = null

const boxGame = document.querySelector('#box-game')
const boxContainer = document.querySelector('#box-container')
const boxGameTitle = document.querySelector('#box-game-title')
const boxGameCompleted = document.querySelector('#box-game-completed')
const boxPopup = document.querySelector('#box-popup')
const boxPopupMessage = document.querySelector('#box-popup-message')
const boxPopupBtn = document.querySelector('#box-popup-btn')

function getTriesLeft() {
	return maxAttempts - attempts
}

function showBoxPopup(message, btnText = 'Okay', cb = null) {
	boxPopupMessage.innerHTML = message
	boxPopup.classList.remove('hidden')
	boxPopupBtn.textContent = btnText
	boxPopupBtn.onclick = () => {
		boxPopup.classList.add('hidden')
		if (cb) cb()
	}
}

function renderBoxes() {
	if (prizeBoxIndex === null) {
		prizeBoxIndex = Math.floor(Math.random() * BOXES.length)
	}
	boxContainer.innerHTML = `<div class="box-grid">
		${BOXES.map(
			(box, idx) => `
			<button class="box-outer" data-box-id="${box.id}" data-idx="${idx}" ${
				boxClicked[box.id] ? 'disabled' : ''
			}>
				<div class="box ${
					boxClicked[box.id] ? 'box--opened box--empty' : ''
				}" id="box-${box.id}">
					<div class="box__lid"></div>
					<div class="box__body"></div>
				</div>
			</button>
		`
		).join('')}
	</div>`

	document.querySelectorAll('.box-outer').forEach(btn => {
		if (!boxClicked[btn.dataset.boxId]) {
			btn.onclick = handleBoxClick
		}
	})
}

function handleBoxClick(e) {
	const btn = e.currentTarget
	const boxId = parseInt(btn.dataset.boxId)
	const idx = parseInt(btn.dataset.idx)

	if (boxClicked[boxId] || btn.classList.contains('box--disabled')) return
	if (attempts >= maxAttempts) return

	boxClicked[boxId] = true
	attempts++

	document
		.querySelectorAll('.box-outer')
		.forEach(b => b.classList.add('box--disabled'))
	const boxEl = document.getElementById(`box-${boxId}`)
	boxEl.classList.add('box--opened')

	let isPrize = attempts === maxAttempts
	if (isPrize) {
		boxEl.classList.add('box--prize')
		boxEl.querySelector('.box__body').innerHTML =
			'<img src="img/prize.png" alt="Prize" class="box__prize-img">'

		const showPrizePopup = () => {
			showBoxPopup(
				`<div style='font-size:2rem;'>🎉 Congratulations! You're a winner!</div>
				<div style='margin:1rem 0;'>You've just unlocked your [Product Name]!<br>What's next?</div>
				<ol style='text-align:left; margin:0 auto; max-width:350px;'>
					<li>Click the "Okay" button below.</li>
					<li>You'll be redirected to our partner's page.</li>
					<li>Complete the quick registration and wait for your result.</li>
					<li>Shipping is completely free!</li>
				</ol>`,
				'Okay',
				() => {
					window.location.href = 'https://your-partner-page.com'
				}
			)
		}

		prizeTimeout = setTimeout(showPrizePopup, 2000)
		boxEl.onclick = () => {
			clearTimeout(prizeTimeout)
			showPrizePopup()
		}
	} else {
		boxEl.classList.add('box--empty')
		boxEl.querySelector('.box__body').textContent = ''
		setTimeout(() => {
			showBoxPopup(
				`<div style='font-size:2rem;'>🎁 Oops! Not this time…</div>
				<div style='margin:1rem 0;'>You have ${getTriesLeft()} tries left — go ahead and try again.<br>Your mystery reward might still be waiting!</div>`,
				'🔄 Try Again',
				() => {
					renderBoxes()
				}
			)
		}, 700)
	}
}

window.startBoxGame = function () {
	isBoxGameStarted = true
	attempts = 0
	boxClicked = {}
	prizeBoxIndex = null
	boxGame.classList.add('box-game-started')
	boxContainer.classList.remove('hidden')
	boxGameCompleted.classList.add('hidden')
	renderBoxes()
	boxGameTitle.textContent = 'Choose a box to find your prize!'
	boxPopup.classList.add('hidden')
}
