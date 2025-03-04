const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register the new user
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books), 4, null)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    res.json(books[isbn]);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.query.author;

  if (author) {
    let booksByAuthor = [];
    for (let isbn in books) {
      if (books[isbn].author === author) {
        booksByAuthor.push(books[isbn]);
      }
    }
    res.json(booksByAuthor);
  } else { 
    res.status(400).json({ message: "Author name is required" });
  }
  return res.status(404).json({ message: "No books found by this author" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase(); // Convert input to lowercase for case-insensitive search

  let booksByTitle = Object.values(books).filter(book =>
    book.title.toLowerCase().includes(title)
  );

  if (booksByTitle.length > 0) {
    return res.json(booksByTitle); // Return matching books
  } else {
    return res.status(404).json({ message: "No books found by this title" });
  }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn] && books[isbn].reviews) {
    res.json(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found or has no reviews" });
  }
  return res.status(404).json({ message: "No reviews found for this book" });
});

module.exports.general = public_users;
