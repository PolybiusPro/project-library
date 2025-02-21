/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const {
    getBook,
    getBooks,
    postBook,
    postComment,
    deleteBook,
    deleteBooks,
} = require("../controllers/bookController");

module.exports = function (app) {
    app.route("/api/books")
        .get(function (req, res) {
            getBooks(req, res);
        })

        .post(function (req, res) {
            postBook(req, res);
        })

        .delete(function (req, res) {
            deleteBooks(req, res);
        });

    app.route("/api/books/:id")
        .get(function (req, res) {
            getBook(req, res);
        })

        .post(function (req, res) {
            postComment(req, res);
        })

        .delete(function (req, res) {
            deleteBook(req, res);
        });
};
