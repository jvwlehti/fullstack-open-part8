const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
require('dotenv').config()

mongoose.set('strictQuery', false)

const MONGODB_URI = process.env.MONGODB_URI

console.log(`connecting to: ${MONGODB_URI}`)

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log(`Connected to ${MONGODB_URI}`)
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err.message)
    })

let authors = [
    {
        name: 'Robert Martin',
        id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
        born: 1952,
    },
    {
        name: 'Martin Fowler',
        id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
        born: 1963
    },
    {
        name: 'Fyodor Dostoevsky',
        id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
        born: 1821
    },
    {
        name: 'Joshua Kerievsky', // birthyear not known
        id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
    },
    {
        name: 'Sandi Metz', // birthyear not known
        id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
    },
]

let books = [
    {
        title: 'Clean Code',
        published: 2008,
        author: 'Robert Martin',
        id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring']
    },
    {
        title: 'Agile software development',
        published: 2002,
        author: 'Robert Martin',
        id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
        genres: ['agile', 'patterns', 'design']
    },
    {
        title: 'Refactoring, edition 2',
        published: 2018,
        author: 'Martin Fowler',
        id: "afa5de00-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring']
    },
    {
        title: 'Refactoring to patterns',
        published: 2008,
        author: 'Joshua Kerievsky',
        id: "afa5de01-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring', 'patterns']
    },
    {
        title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
        published: 2012,
        author: 'Sandi Metz',
        id: "afa5de02-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring', 'design']
    },
    {
        title: 'Crime and punishment',
        published: 1866,
        author: 'Fyodor Dostoevsky',
        id: "afa5de03-344d-11e9-a414-719c6709cf3e",
        genres: ['classic', 'crime']
    },
    {
        title: 'Demons',
        published: 1872,
        author: 'Fyodor Dostoevsky',
        id: "afa5de04-344d-11e9-a414-719c6709cf3e",
        genres: ['classic', 'revolution']
    },
]

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }
  
  type Author {
    name: String!
    born : Int
    id: ID!
    
    bookCount: Int!
  }
  
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
  
  type Mutation {
    addBook(
      title: String!,
      published: Int!,
      author: String!,
      genres: [String!]!,
    ): Book
    editAuthor(
      name: String!,
      setBornTo: Int! 
    ): Author
  }
`

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
    },
    Author: {
        bookCount: async (root) => Book.find({author: root.id}).countDocuments(),
    },
    Mutation: {
        addBook: async (root, args) => {
            try {
                let author = await Author.findOne({ name: args.author });

                if (!author) author = new Author({ name: args.author });
                await author.save();

                const book = new Book({ ...args, author });
                await book.save();

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
        editAuthor: async (root, args) => {
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
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

startStandaloneServer(server, {
    listen: { port: 4000 },
}).then(({ url }) => {
    console.log(`Server ready at ${url}`)
})