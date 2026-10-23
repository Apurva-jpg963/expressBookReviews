const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new customer
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user. Username and password are required." });
});

// ==========================================
// Task 1 & Task 10: Get the list of all books available using Promise / async-await
// ==========================================
public_users.get('/', async function (req, res) {
    try {
        const getBooks = new Promise((resolve) => {
            resolve(books);
        });
        const bookList = await getBooks;
        return res.status(200).send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books" });
    }
});

// ==========================================
// Task 2 & Task 11: Get book details based on ISBN using Promise / async-await
// ==========================================
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const getBookByISBN = new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject("Book not found");
            }
        });
        const bookDetails = await getBookByISBN;
        return res.status(200).send(JSON.stringify(bookDetails, null, 4));
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// ==========================================
// Task 3 & Task 12: Get book details based on Author using Promise / async-await
// ==========================================
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const getBooksByAuthor = new Promise((resolve, reject) => {
            let matchedBooks = [];
            let isbns = Object.keys(books);
            isbns.forEach((isbn) => {
                if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
                    matchedBooks.push({ isbn: isbn, ...books[isbn] });
                }
            });
            if (matchedBooks.length > 0) {
                resolve(matchedBooks);
            } else {
                reject("Author not found");
            }
        });
        const booksFound = await getBooksByAuthor;
        return res.status(200).send(JSON.stringify(booksFound, null, 4));
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// ==========================================
// Task 4 & Task 13: Get all books based on Title using Promise / async-await
// ==========================================
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const getBooksByTitle = new Promise((resolve, reject) => {
            let matchedBooks = [];
            let isbns = Object.keys(books);
            isbns.forEach((isbn) => {
                if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
                    matchedBooks.push({ isbn: isbn, ...books[isbn] });
                }
            });
            if (matchedBooks.length > 0) {
                resolve(matchedBooks);
            } else {
                reject("Title not found");
            }
        });
        const booksFound = await getBooksByTitle;
        return res.status(200).send(JSON.stringify(booksFound, null, 4));
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// ==========================================
// Task 5: Get book reviews based on ISBN
// ==========================================
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// =========================================================================
// Additional implementations using Axios with async/await and Promises
// (Tasks 10, 11, 12, 13 reference functions using Axios)
// =========================================================================

// Task 10: Fetch all books using Axios and async/await
const getBooksAsyncAxios = async (url = "http://localhost:5000/") => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching all books with Axios:", error.message);
        throw error;
    }
};

// Task 11: Fetch book by ISBN using Axios and Promise callback (.then / .catch)
const getBookByISBNAxios = (isbn, baseUrl = "http://localhost:5000/isbn/") => {
    return axios.get(`${baseUrl}${isbn}`)
        .then(response => response.data)
        .catch(error => {
            console.error(`Error fetching book ISBN ${isbn} with Axios:`, error.message);
            throw error;
        });
};

// Task 12: Fetch books by Author using Axios and async/await
const getBooksByAuthorAxios = async (author, baseUrl = "http://localhost:5000/author/") => {
    try {
        const response = await axios.get(`${baseUrl}${encodeURIComponent(author)}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching books by author ${author} with Axios:`, error.message);
        throw error;
    }
};

// Task 13: Fetch books by Title using Axios and async/await
const getBooksByTitleAxios = async (title, baseUrl = "http://localhost:5000/title/") => {
    try {
        const response = await axios.get(`${baseUrl}${encodeURIComponent(title)}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching books by title ${title} with Axios:`, error.message);
        throw error;
    }
};

module.exports.general = public_users;
module.exports.getBooksAsyncAxios = getBooksAsyncAxios;
module.exports.getBookByISBNAxios = getBookByISBNAxios;
module.exports.getBooksByAuthorAxios = getBooksByAuthorAxios;
module.exports.getBooksByTitleAxios = getBooksByTitleAxios;
