/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let testId = "";

suite("Functional Tests", function () {
    /*
     * ----[EXAMPLE TEST]----
     * Each test should completely test the response of the API end-point including response status code!
     */
    test("#example Test GET /api/books", function (done) {
        chai.request(server)
            .get("/api/books")
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(
                    res.body,
                    "response should be an array"
                );
                assert.property(
                    res.body[0],
                    "commentcount",
                    "Books in array should contain commentcount"
                );
                assert.property(
                    res.body[0],
                    "title",
                    "Books in array should contain title"
                );
                assert.property(
                    res.body[0],
                    "_id",
                    "Books in array should contain _id"
                );
                done();
            });
    });
    /*
     * ----[END of EXAMPLE TEST]----
     */

    suite("Routing tests", function () {
        suite(
            "POST /api/books with title => create book object/expect book object",
            function () {
                test("Test POST /api/books with title", function (done) {
                    chai.request(server)
                        .keepOpen()
                        .post("/api/books")
                        .send({ title: "The Giver" })
                        .end((err, res) => {
                            assert.strictEqual(res.status, 200);
                            assert.property(res.body, "_id");
                            assert.strictEqual(
                                res.body.title,
                                "The Giver"
                            );
                            testId = res.body._id;
                            done();
                        });
                });

                test("Test POST /api/books with no title given", function (done) {
                    chai.request(server)
                        .keepOpen()
                        .post("/api/books")
                        .send({ title: "" })
                        .end((err, res) => {
                            assert.strictEqual(res.status, 200);
                            assert.strictEqual(
                                res.text,
                                "missing required field title"
                            );
                            done();
                        });
                });
            }
        );

        suite("GET /api/books => array of books", function () {
            test("Test GET /api/books", function (done) {
                chai.request(server)
                    .keepOpen()
                    .get("/api/books")
                    .end((err, res) => {
                        assert.strictEqual(res.status, 200);
                        assert.isArray(res.body);
                        res.body.forEach((item) => {
                            assert.property(item, "_id");
                            assert.property(item, "title");
                            assert.property(item, "comments");
                            assert.property(item, "commentcount");
                        });
                        done();
                    });
            });
        });

        suite(
            "GET /api/books/[id] => book object with [id]",
            function () {
                test("Test GET /api/books/[id] with id not in db", function (done) {
                    chai.request(server)
                        .keepOpen()
                        .get("/api/books/invalidid")
                        .end((err, res) => {
                            assert.strictEqual(res.status, 200);
                            assert.strictEqual(
                                res.text,
                                "no book exists"
                            );
                            done();
                        });
                });

                test("Test GET /api/books/[id] with valid id in db", function (done) {
                    chai.request(server)
                        .keepOpen()
                        .get("/api/books/" + testId)
                        .end((err, res) => {
                            assert.strictEqual(res.status, 200);
                            assert.property(res.body, "_id");
                            assert.strictEqual(
                                res.body.title,
                                "The Giver"
                            );
                            assert.isArray(res.body.comments);
                            assert.isNumber(res.body.commentcount);
                            done();
                        });
                });
            }
        );

        suite(
            "POST /api/books/[id] => add comment/expect book object with id",
            function () {
                test("Test POST /api/books/[id] with comment", function (done) {
                    chai.request(server)
                        .keepOpen()
                        .post("/api/books/" + testId)
                        .send({ comment: "Great Book 10/10" })
                        .end((err, res) => {
                            assert.strictEqual(res.status, 200);
                            assert.property(res.body, "_id");
                            assert.strictEqual(
                                res.body.title,
                                "The Giver"
                            );
                            assert.include(
                                res.body.comments,
                                "Great Book 10/10"
                            );
                            assert.notEqual(res.body.commentcount, 0);
                            done();
                        });
                });

                test("Test POST /api/books/[id] without comment field", function (done) {
                    chai.request(server)
                        .keepOpen()
                        .post("/api/books/" + testId)
                        .send({ comment: "" })
                        .end((err, res) => {
                            assert.strictEqual(res.status, 200);
                            assert.strictEqual(
                                res.text,
                                "missing required field comment"
                            );
                            done();
                        });
                });

                test("Test POST /api/books/[id] with comment, id not in db", function (done) {
                    chai.request(server)
                        .keepOpen()
                        .post("/api/books/invalidid")
                        .send({
                            comment: "This book isn't even real!",
                        })
                        .end((err, res) => {
                            assert.strictEqual(res.status, 200);
                            assert.strictEqual(
                                res.text,
                                "no book exists"
                            );
                            done();
                        });
                });
            }
        );

        suite(
            "DELETE /api/books/[id] => delete book object id",
            function () {
                test("Test DELETE /api/books/[id] with valid id in db", function (done) {
                    chai.request(server)
                        .keepOpen()
                        .delete("/api/books/" + testId)
                        .end((err, res) => {
                            assert.strictEqual(res.status, 200);
                            assert.strictEqual(
                                res.text,
                                "delete successful"
                            );
                            done();
                        });
                });

                test("Test DELETE /api/books/[id] with  id not in db", function (done) {
                    chai.request(server)
                        .keepOpen()
                        .delete("/api/books/invalidid")
                        .end((err, res) => {
                            assert.strictEqual(res.status, 200);
                            assert.strictEqual(
                                res.text,
                                "no book exists"
                            );
                            done();
                        });
                });
            }
        );
    });
});
