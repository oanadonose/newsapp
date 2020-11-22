window.addEventListener('DOMContentLoaded', () => {
	console.log('DOMContentLoaded')
	const delay = 2000
	document.querySelector('.msg').hidden = false
	window.setTimeout(() => {
		document.querySelector('.msg').hidden = true
	}, delay)
})

const toggleLeaderboards = () => {
	if (document.querySelector('.table-container').hidden) {
		document.querySelector('.table-container').hidden = false
	} else {
		document.querySelector('.table-container').hidden = true
	}
}

const toggleBtn = document.querySelector('.toggle-btn')
toggleBtn.addEventListener('click', toggleLeaderboards)


