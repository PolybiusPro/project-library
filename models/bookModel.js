const { Schema, model } = require("mongoose");

const bookSchema = new Schema(
    {
        title: { type: String, required: true },
        comments: [String],
    },
    {
        virtuals: {
            commentcount: {
                get() {
                    return this.comments.length;
                },
            },
        },
    }
);

const Book = model("Book", bookSchema);

module.exports = Book;
