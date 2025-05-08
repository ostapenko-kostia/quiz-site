const QUESTIONS = [
	{ text: 'How old are you?', variants: ['18-30', '30-40', '40-50', '50+'] },
	{
		text: 'Do you currently use [Product Name] products?',
		variants: ['Yes', 'No'],
	},
	{
		text: 'What type of skin do you have?',
		variants: ['Dry', 'Oily', 'Normal', 'Combination'],
	},
	{
		text: 'Do you experience any skin issues?',
		variants: ['Yes', 'No'],
	},
	{ text: 'Do you have any allergies?', variants: ['Yes', 'No', 'Not Sure'] },
	{
		text: 'Would you like to try a new [Product Name] product?',
		variants: ['Yes', 'No'],
	},
]

const answers = JSON.parse(window.sessionStorage.getItem('answers')) || []

let currentQuestion = answers.length
let isStarted = answers.length > 0
let isCompleted = answers.length === QUESTIONS.length

console.log(answers)

const quiz = document.querySelector('#quiz')
const title = document.querySelector('#quiz-title')
const boxes = document.querySelector('#quiz-boxes')
const startButton = document.querySelector('#start-button')
const quizCompleted = document.querySelector('#quiz-completed')
const questionVariants = document.querySelector('#question-variants')
const quizCompletedCounting = document.querySelector('#quiz-completed-counting')

const completionMessages = [
	'⏳ Verifying eligibility',
	'⏳ Checking your answers',
	'⏳ Matching with available rewards',
	'This may take a few seconds…',
	'🎉 Congratulations!',
]

let currentMessageIndex = 0

const updateMessageWithCheckmark = message => {
	return message.replace('⏳', '✔️')
}

const rotateCompletionMessage = () => {
	// First, display all messages except Congratulations
	quizCompletedCounting.innerHTML = completionMessages
		.slice(0, -1)
		.map(msg => `<div>${msg}</div>`)
		.join('')

	// Then update each message one by one
	const messages = quizCompletedCounting.children
	let index = 0

	const updateNextMessage = () => {
		if (index < messages.length) {
			messages[index].textContent = updateMessageWithCheckmark(
				messages[index].textContent
			)
			index++

			if (index === messages.length) {
				// When all messages are updated, replace the last one with Congratulations
				messages[messages.length - 1].textContent =
					completionMessages[completionMessages.length - 1]
				quizCompletedCounting.innerHTML = ''
				quizCompleted.classList.add('hidden')

				quiz.classList.add('hidden')
				const boxGame = document.querySelector('#box-game')
				boxGame.classList.add('active')
				startBoxGame()
			} else {
				setTimeout(updateNextMessage, 1000)
			}
		}
	}

	// Start updating messages after 1 second
	setTimeout(updateNextMessage, 1000)
}

startButton.addEventListener('click', () => {
	if (!isStarted) {
		isStarted = true
		quiz.classList.add('quiz-started')
		questionVariants.classList.remove('hidden')
		renderQuestion()
	}
})

const handleVariantClick = e => {
	if (isCompleted) return
	const variant = e.target.dataset.variant
	const question = e.target.dataset.question
	answers.push({ question, variant })
	window.sessionStorage.setItem('answers', JSON.stringify(answers))
	currentQuestion++
	renderQuestion()
}

const renderQuestion = () => {
	const question = QUESTIONS[currentQuestion]
	if (!question) {
		isCompleted = true
		title.classList.add('hidden')
		questionVariants.classList.add('hidden')
		quizCompleted.classList.remove('hidden')
		rotateCompletionMessage()
		return
	}
	title.textContent = question.text
	questionVariants.innerHTML = question.variants
		.map(
			variant =>
				`<button class="quiz__variant" data-question="${question.text}" data-variant="${variant}" onclick="handleVariantClick(event)">${variant}</button>`
		)
		.join('')
}

// Initialize the quiz state based on saved answers
if (isStarted) {
	quiz.classList.add('quiz-started')
	questionVariants.classList.remove('hidden')
	renderQuestion()
}
