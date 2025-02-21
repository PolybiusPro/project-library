const Book = require("../models/bookModel");
const mongoose = require("mongoose");

mongoose.set("toJSON", { virtuals: true });

const getBook = async (req, res) => {
    try {
        const foundBook = await Book.findById(req.params._id).exec();
        res.json(foundBook);
    } catch (err) {
        res.send("no book exists");
    }
};

const getBooks = async (req, res) => {
    try {
        const foundBooks = await Book.find({}).exec();
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
        if (req.body.comment === "") {
            return res.send("missing required field comment");
        }

        const bookToUpdate = Book.findByIdAndUpdate(
            req.params._id,
            {
                $push: { comments: req.body.comment },
            },
            { new: true }
        );
        res.json(bookToUpdate);
    } catch (err) {
        res.send("no book exists");
    }
};

const deleteBook = async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params._id);
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
