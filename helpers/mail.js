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
