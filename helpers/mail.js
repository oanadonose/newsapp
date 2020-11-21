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

export const subscriptionMailOpts = (user, articles) => {
  const mailOpts = {
    from: `${process.env.user}`,
    to: user.email,
    subject: `Daily News Digest`,
    replyTo: user.email,
    html: `
          <h1>Hello</h1>
          <p>Here's the top 3 news of the day: <p>
          <div>
            <h2>${articles[0].title}</h2>
			<h4>by ${articles[0].user}</h4>
			<a href="${process.env.host}/news/${articles[0].id}">Linky</a>
          <div>
          <div>
            <h2>${articles[1].title}</h2>
			<h4>by ${articles[1].user}</h4>
			<a href="${process.env.host}/news/${articles[1].id}">Linky</a>
          <div>
          <div>
            <h2>${articles[2].title}</h2>
			<h4>by ${articles[2].user}</h4>
			<a href="${process.env.host}/news/${articles[2].id}">Linky</a>
          <div>
          `
  }
  return mailOpts
}



