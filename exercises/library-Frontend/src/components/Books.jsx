import { ALL_BOOKS, ALL_GENRES } from "../queries.jsx";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { useState } from "react";

const Books = ({ show }) => {
    const [selectedGenre, setSelectedGenre] = useState(null);

    // ex_8.21 - already done using backend
    const { data: booksData, loading: booksLoading } = useQuery(ALL_BOOKS, {
        variables: { genre: selectedGenre },
    });

    const { data: genresData, loading: genresLoading } = useQuery(ALL_GENRES);

    if (!show) {
        return null;
    }

    if (booksLoading || genresLoading) {
        return <div>loading...</div>;
    }

    const books = booksData.allBooks;
    const genres = genresData.allGenres;

    const options = [
        { value: null, label: "All" },
        ...genres.map((genre) => ({
            value: genre,
            label: genre,
        })),
    ];

    const genreChange = (selectedOption) => {
        setSelectedGenre(selectedOption.value);
    };

    return (
        <div>
            <h2>books</h2>

            <p>
                Showing {selectedGenre ? <>genre: <strong>{selectedGenre}</strong></> : "all genres"}
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
            <Select
                value={options.find((option) => option.value === selectedGenre)}
                onChange={genreChange}
                options={options}
            />
        </div>
    );
};

export default Books;
