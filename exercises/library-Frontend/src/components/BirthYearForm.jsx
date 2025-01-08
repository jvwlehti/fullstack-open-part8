import {useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import Select from "react-select"
import {ALL_AUTHORS, EDIT_AUTHOR} from "../queries.jsx";

const BirthYearForm = (props) => {
    const [name, setName] = useState("")
    const [born, setBorn] = useState("")

    const [ setBornYear ] = useMutation(EDIT_AUTHOR, {
        refetchQueries: [ { query: ALL_AUTHORS } ]
    })

    const result = useQuery(ALL_AUTHORS);

    if (!props.show) {
        return null
    }

    if (result.loading) {
        return <div>loading...</div>;
    }

    const authors = result.data.allAuthors;
    const options = authors.map((author) => {
        return{
            value: author.name,
            label: author.name,
        }
    })

    const submit = async (event) => {
        event.preventDefault()

        setBornYear( {variables: {name: name.value, setBornTo: parseInt(born)}} )

        setName(null)
        setBorn('')
    }

    return (
        <div>
            <h2>Set birthyear</h2>
            <form onSubmit={submit}>
                <Select
                    value={name}
                    onChange={setName}
                    options={options}
                />
                <div>
                    set birthyear
                    <input
                        type="number"
                        value={born}
                        onChange={({ target }) => setBorn(target.value)}
                    />
                </div>
                <button type="submit">Set</button>
            </form>
        </div>
    )
}

export default BirthYearForm