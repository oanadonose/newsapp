# Completed stage 1, 2 and 3 functionality
## https://donoseo-sem1.herokuapp.com/

## Stage 1

The core functionality consists of three screens.

### Part 1

A home page tha should be visible even if a `user` is not logged in. This should display  summaries of all the news articles, each should show:

1. The title.
2. A thumbnail photo.
3. The date added (with the most recent at the top) in the format DD/MM/YYYY.

### Part 2

If the `user` is logged in they should see an **add news** link or button on the homepage that takes the user to the **Add News** page where they can add a new article, this should include:

1. The title.
2. A photo uploaded from their computer.
3. A detailed, multi-line, formatted news article.

### Part 3

Whether a `user` is logged in or not, if they click on a photo or title on the home page they should be taken to a news item page where they will be able to read the article in full, including:

1. The title.
2. The full-sized photo.
3. The username of the author.
4. The date added shown in the format DD/MM/YYYY.
5. The multi-paragraph, formatted news article.

---

## Stage 2

The intermediate tasks require you to make changes to the functionality:

1. All new articles should be marked as pending and hidden from the public's view until an `admin` person logs in, checks the content and flags it as released.
2. `users` can edit existing articles but this will reflag them as pending.
3. When the article is released, the `user` who posted the article should receive an email telling them the article is live, including the article title and with a link to the details page.
4. The `user` should be prompted if they try to add or edit an article with missing fields.

---

## Stage 3

1. `Users` can provide feedback on articles:
    1. Users who view an article are given the option to rate it on a scale of 1-5 stars.
    2. They can also supply a formatted, multiline feedback comment.
2. To encourage people to get involved you will implement some gamification by awarding points for positive behaviours:
    1. `Users` who post an article get 10 points per article rising to 25 points when the article gets approved by admin.
    2. They get the star rating for each piece of feedback added as points.
    3. The home screen should display the top 10 users with the highest scores.
3. `users` can subscribe to a daily news digest which gets sent out each morning and contains the following information for all news articles approved over the last 24 hours:
    1. The title, summary and date/time.
    2. A link to the online article summary page.
