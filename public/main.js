window.addEventListener('DOMContentLoaded', () => {
	console.log('DOMContentLoaded')
	const delay = 2000
	if(document.querySelector('.msg'))
		document.querySelector('.msg').hidden = false
	window.setTimeout(() => {
		if(document.querySelector('.msg'))
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

const toggleNav = () => {
	const links = document.querySelector('header ul')
	if(!links.style.display) links.style.display= 'flex'
	if(links.style.display==='none') links.style.display = 'flex'
	else links.style.display='none'
}

const toggleBtn = document.querySelector('.toggle-btn')
if(toggleBtn) {
	toggleBtn.addEventListener('click', toggleLeaderboards)
}

const navBtn = document.getElementById('hamburger')
navBtn.addEventListener('click', toggleNav)
