window.addEventListener('DOMContentLoaded', () => {
	console.log('DOMContentLoaded')
	const delay = 2000
	document.querySelector('.msg').hidden = false
	window.setTimeout(() => {
		document.querySelector('.msg').hidden = true
	}, delay)
})
