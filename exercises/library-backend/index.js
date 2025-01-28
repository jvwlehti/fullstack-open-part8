const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const typeDefs = require("./schema");
const resolvers = require("./resolvers");

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

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req, res }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
            const decodedToken = jwt.verify(
                auth.substring(7), process.env.JWT_SECRET
            )
            const currentUser = await User
                .findById(decodedToken.id)
            return {currentUser}
        }
    },
}).then(({ url }) => {
    console.log(`Server ready at ${url}`)
})