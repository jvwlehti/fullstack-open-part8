import {ALL_BOOKS} from "../queries.jsx";
import { useQuery } from "@apollo/client";

const Recommend = ({ show, favoriteGenre }) => {

    const { data: booksData, loading: booksLoading } = useQuery(ALL_BOOKS, {
        variables: { genre: favoriteGenre },
        skip: !favoriteGenre
    });

    if (booksLoading) {
        return <div>loading...</div>;
    }
    if (!show) {
        return null;
    }
    const books = booksData.allBooks;

    return !favoriteGenre ? (
        <div>
            <h2>Recommendation</h2>

            <p>
                You have no recommendations
            </p>
        </div>
    ) : (
        <div>
            <h2>Recommendation</h2>

            <p>
                Here's recommendations based on your favorite genre <><strong>{favoriteGenre}</strong></>
            </p>

            <table>
                <tbody>
                <tr>
                    <th></th>
                    <th>author</th>
                    <th>published</th>
                </tr>
                {books.map((a) => (
                    <tr key={a.title}>
                        <td>{a.title}</td>
                        <td>{a.author.name}</td>
                        <td>{a.published}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

};

export default Recommend;
