const Book = require("./models/book");
const Author = require("./models/author");

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub();

const { GraphQLError } = require("graphql/index");
const mongoose = require("mongoose");

const User = require("./models/user");
const jwt = require("jsonwebtoken");

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            const author = await Author.findOne({ name: args.author })

            const filters = [];

            if (args.author) {
                filters.push({ author: author.id });
            }

            if (args.genre) {
                filters.push({ genres: { $in: [args.genre] } });
            }

            const query = filters.length > 0 ? { $and: filters } : {};
            return Book.find(query).populate("author");
        },
        allAuthors: async () => Author.find({}),
        me: (root, args, context) => {
            return context.currentUser
        },
        allGenres: async () =>  {
            const books = await Book.find({})

            let genres = []

            for (const book of books) {
                genres.push(...book.genres)
            }

            genres = [...new Set(genres)]

            return genres
        }
    },
    Author: {
        bookCount: async (root) => Book.find({author: root.id}).countDocuments(),
    },
    Mutation: {
        addBook: async (root, args, context) => {
            const currentUser = context.currentUser

            if (!currentUser) {
                throw new GraphQLError('Not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }

            try {
                let author = await Author.findOne({ name: args.author });

                if (!author) author = new Author({ name: args.author });
                await author.save();

                const book = new Book({ ...args, author });
                await book.save();

                await pubsub.publish('BOOK_ADDED', {bookAdded: book})

                return book;
            } catch (err) {
                let errorMessage = "Saving book failed";

                if (err instanceof mongoose.Error.ValidationError) {
                    const { name, title } = err.errors;

                    if (name) {
                        errorMessage = "Saving book failed. Author name is not valid.";
                    } else if (title) {
                        errorMessage = "Saving book failed. Book title is not valid.";
                    }

                    throw new GraphQLError(errorMessage, {
                        extensions: { code: "BAD_USER_INPUT" },
                    });

                } else {
                    throw new GraphQLError(`Unexpected error: ${err.message}`);
                }
            }
        },
        editAuthor: async (root, args, context) => {

            const currentUser = context.currentUser

            if (!currentUser) {
                throw new GraphQLError('Not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }

            const author = await Author.findOne({ name: args.name});
            if (author) {
                author.born = args.setBornTo;
            }

            try {
                await author.save();
            } catch (error) {
                throw new GraphQLError('Update author failed', {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: args.author,
                        error
                    },
                })
            }
            return author
        },
        createUser: async (root, args) => {
            const user = new User({ ...args })

            return user.save()
                .catch(error => {
                    throw new GraphQLError('Creating the user failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            error
                        }
                    })
                })
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

            if ( !user || args.password !== 'secret' ) {
                throw new GraphQLError('wrong credentials', {
                    extensions: { code: 'BAD_USER_INPUT' }
                })
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
        },
    },
    Subscription: {
        bookAdded: {
            subscribe: () =>
                pubsub.asyncIterableIterator('BOOK_ADDED')
        },
    },
}

module.exports = resolvers;