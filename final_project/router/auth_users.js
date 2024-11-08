const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{    
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ 
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.query.username;
    const password = req.query.password;
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
// Extract email parameter from request URL
    const isbn = req.params.isbn;
    const username = req.query.username;
    const review = req.query.review;

    console.log(isbn,username,review)
    // let book = books[isbn];  
    // if (book) {  
    //     if (username && review) {
    //         book["reviews"]["username"]["review"] = review;
    //         books[isbn] = book
    //     }
    //     res.send(`Review for book with isbn ${isbn} updated.`);
    // } else {
       
    //     res.send("Unable to add review!");
    // }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.body.username;
    
    let book = books[isbn]; 
    if (book) {  // Check if friend exists
        if (username) {
            delete book["reviews"]["username"]["review"]

        }
        res.send(`Review for book with isbn ${isbn} deleted.`);
    } else {
        // Respond if friend with specified email is not found
        res.send("Unable to delete review!");
    }

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
