import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import BirthYearForm from "./components/BirthYearForm.jsx";
import LoginForm from "./components/LoginForm.jsx";
import {useApolloClient} from "@apollo/client";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);

  const client = useApolloClient();

    const logout = () => {
        setToken(null)
        localStorage.clear()
        client.resetStore()
        setPage("authors");
    }

    const login = (token) => {
        setToken(token)
        localStorage.setItem('library-user-token', token)
        setPage("authors");
    }

    if (!token) {
        return (
            <div>
                <div>
                    <button onClick={() => setPage("authors")}>authors</button>
                    <button onClick={() => setPage("books")}>books</button>
                    <button onClick={() => setPage("login")}>login</button>
                </div>

                <Authors show={page === "authors"}/>

                <Books
                    show={page === "books"}
                />

                <LoginForm
                    show={page === "login"}
                    handleLogin={login}
                />


            </div>
        )
    }

    return (
        <div>
            <div>
                <button onClick={() => setPage("authors")}>authors</button>
                <button onClick={() => setPage("books")}>books</button>
                <button onClick={() => setPage("add")}>add book</button>
                <button onClick={() => setPage("set")}>set Birthyear</button>
                <button onClick={logout}>logout</button>
            </div>

            <Authors show={page === "authors"}/>

            <Books show={page === "books"}/>

            <NewBook show={page === "add"}/>

            <BirthYearForm show={page === "set"} />
    </div>
  );
};

export default App;
