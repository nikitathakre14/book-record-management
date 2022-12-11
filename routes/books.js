const express = require("express");
const { books } = require("../data/books.json");
const { users } = require("../data/users.json");
const router = express.Router();

/**
 *Route: /books
 *Method : GET
 *Description: Get all books
 *Acess: Public
 *Parameters: none
 */
router.get("/", (req, res) => {
    res.status(200).json({ success: true, data: books });
});

/**
 *Route: /books/:id
 *Method : GET
 *Description: Get book by id
 *Acess: Public
 *Parameters: id
 */
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const book = books.filter((each) => each.id === id);

    if (!book)
        return res.status(404).json({
            success: false,
            message: "Book not found",
        });
    return res.status(200).json({
        success: true,
        data: book,
    });
});

/**
 *Route: /books/issued/by-user
 *Method : GET
 *Description: Get all issued books
 *Acess: Public
 *Parameters: none
 */
router.get("/issued/by-user", (req, res) => {
    const userWithIssuedBooks = users.filter((each) => {
        if (each.issuedBook) return each;
    });
    const issuedBooks = [];
    userWithIssuedBooks.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook);
        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooks.push(book);
    });

    if (issuedBooks.length === 0)
        return res.status(404).json({
            success: false,
            message: "No books issued yet",
        });
    return res.status(200).json({
        success: true,
        data: issuedBooks,
    });
});

/**
 *Route: /books/issued/by-user
 *Method : POST
 *Description:Create new book
 *Acess: Public
 *Parameters: none
 Data : author,name genre ,price,publisher,id
 */
router.post("/", (req, res) => {
    const { data } = req.body;

    if (!data) {
        return res.status(400).json({
            success: false,
            message: "No data provided",
        });
    }


    const book = books.find((each) => each.id === data.id);
    if (book) {
        return res.status(404).json({
            success: false,
            message: "Book already exists with this id, please use a unique id",
        });
    }
    const allBooks = [...books, data];

    return res.status(201).json({
        sucess: true,
        data: allBooks,
    });
});

/**
 *Route: /books/:id
 *Method : PUT
 *Description: Update book
 *Acess: Public
 *Parameters: none
 Data : author, name, genre ,price, publisher, id
 */

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    const book = books.find((each) => each.id === id);

    if (!book) {
        return res.status(400).json({
            success: false,
            message: "Book not found with this particular id",
        });
    }

    const updateData = books.map((each) => {
        if (each.id === id) {
            return { ...each, ...data };
        }
        return each;
    });

    return res.status(200).json({
        sucess: true,
        data: updateData,
    });
});


// default export
module.exports = router;