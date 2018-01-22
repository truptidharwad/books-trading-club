# Book Trading Club
I've built this app as part of Free Code Camp's Back End certification process. The requirements/example app for the project can be found [on their site](https://www.freecodecamp.com/challenges/manage-a-book-trading-club). It's very much a first iteration, but at the same time, I've more than satisfied all the user stories required, and spent far more time on this than I'd allotted, so I'm not sure how likely I am to invest more time in it in the immediate future.

## What It Does
The site allows you to list books you own that you would like to trade (very easily/quickly thanks to the Google Books API), and to see all the other books that all other users have put up to trade. When you indicate that you want a book, the user who owns it (or users, if multiple users have the same title - the all books page is de-duped, so you'd have no way of knowing) is notified on their trades page that they have a trade pending. They can choose to initiate the trade, if they wish, and contact you by email. Then once you receive the book, you click the 'trade complete' button and BLAM! The book is automatically moved over to your collection.

## User Stories
- User Story: I can view all books posted by every user.
- User Story: I can add a new book.
- User Story: I can update my settings to store my full name, city, and state.
- User Story: I can propose a trade and wait for the other user to accept the trade.

## What's Still to Come
- Better error handling
- Many more tests
- Set up authorization on routes that require it
- Lost/forgot password function
- ~Enter key should trigger submit on login forms~ - Done
- Fix Search button on search results page on mobile
- Paged results for /search and /books

## Tech Stack/Tools Used
- MEAN stack:
    - Node.js
    - Express
    - MongoDB/Mongoose
    - Angular
- Angular Material
- Material Design Icons
- Google Books API / [google-books-search module](https://www.npmjs.com/package/google-books-search)

## Reference materials
(Will collect links later, when I'm not typing on my phone)
- Sitepoint tutorial for MEAN stack token-based authentication
- Codepen of Angular Material login page
- John Papa's Angular Style Guide, which has really helped clarify how Angular apps actually work, as well as how to structure my code so it is readable and modular.
