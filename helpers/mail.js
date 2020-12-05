export const generateMailOpts = (article, id) => {
	const mailOpts = {
		from: `${process.env.user}`,
		to: article.email,
		subject: `${id} - "${article.title}" has been released`,
		replyTo: article.email,
		html: `
        <h1>Hello</h1>
				<p>Your article has been released. (id: ${id})</p>
				<h2>${article.title}</h2>
				<p>${article.article}</p>
				<a href="${process.env.host}/news/${id}">Linky</a>
        `
	}
	return mailOpts
}

const genHtml = (articles, count) => {
	let html = `<h1>Hello</h1>
	<p>Here's the top ${count} news of the day: <p>
	`
	for(let i=0;i<count;i++) {
		html = `${html}<div>
		<h2>${articles[i].title}</h2>
		<h4>by ${articles[i].user}</h4>
		<a href="${process.env.host}/news/${articles[i].id}">Linky</a>
	  <div>`
	}
	return html
}

export const subscriptionMailOpts = (user, articles, count) => {
	const mailOpts = {
		from: `${process.env.user}`,
		to: user.email,
		subject: 'Daily News Digest',
		replyTo: user.email,
		html: genHtml(articles, count)
	}
	return mailOpts
}


