import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import BirthYearForm from "./components/BirthYearForm.jsx";

const App = () => {
  const [page, setPage] = useState("authors");

  return (
    <div>
      <div>
          <button onClick={() => setPage("authors")}>authors</button>
          <button onClick={() => setPage("books")}>books</button>
          <button onClick={() => setPage("add")}>add book</button>
          <button onClick={() => setPage("set")}>set Birthyear</button>
      </div>

        <Authors show={page === "authors"} />

        <Books show={page === "books"} />

        <NewBook show={page === "add"} />

        <BirthYearForm show={page === "set"} />
    </div>
  );
};

export default App;
