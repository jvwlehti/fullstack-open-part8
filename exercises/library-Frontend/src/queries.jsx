import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            bookCount
            born
        }
    }
`

export const ALL_BOOKS = gql`
    query AllBooks ($genre: String)  {
        allBooks (genre: $genre) {
            author {
                name
            }
            published
            title
        }
    }
`

export const CREATE_BOOK = gql`
    mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
        addBook(
            title: $title,
            author: $author,
            published: $published,
            genres: $genres
        ) {
            title
            published
        }
    }
`
export const EDIT_AUTHOR = gql`
    mutation editAuthor($name: String!, $setBornTo: Int!) {
        editAuthor(
            name: $name, 
            setBornTo: $setBornTo
        ) {
            name
            born
        }
    }
`

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password)  {
            value
        }
    }
`
export const ALL_GENRES = gql`
query allGenres {
    allGenres
}`