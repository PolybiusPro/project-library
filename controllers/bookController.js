const Book = require("../models/bookModel");
const mongoose = require("mongoose");

mongoose.set("toJSON", { virtuals: true });

const getBook = async (req, res) => {
    try {
        const foundBook = await Book.findById(req.params.id);
        if (!foundBook) throw new Error();
        res.json(foundBook);
    } catch (err) {
        res.send("no book exists");
    }
};

const getBooks = async (req, res) => {
    try {
        const foundBooks = await Book.find({});
        res.json(foundBooks);
    } catch (err) {
        res.status(500).json({ error: "server error" });
    }
};

const postBook = async (req, res) => {
    try {
        const newBook = new Book({ title: req.body.title });
        await newBook.save();
        res.json(newBook);
    } catch (err) {
        res.send("missing required field title");
    }
};

const postComment = async (req, res) => {
    try {
        if (!req.body.comment) {
            return res.send("missing required field comment");
        }

        const bookToUpdate = await Book.findByIdAndUpdate(
            req.params.id,
            {
                $push: { comments: req.body.comment },
            },
            { new: true }
        );

        if (!bookToUpdate) throw new Error();

        res.json(bookToUpdate);
    } catch (err) {
        res.send("no book exists");
    }
};

const deleteBook = async (req, res) => {
    try {
        const bookToDelete = await Book.findByIdAndDelete(
            req.params.id
        );
        if (!bookToDelete) throw new Error();
        res.send("delete successful");
    } catch (err) {
        res.send("no book exists");
    }
};

const deleteBooks = async (req, res) => {
    try {
        await Book.deleteMany({});
        res.send("complete delete successful");
    } catch (err) {
        res.status(500).json({ error: "server error" });
    }
};

module.exports = {
    getBook,
    getBooks,
    postBook,
    postComment,
    deleteBook,
    deleteBooks,
};
