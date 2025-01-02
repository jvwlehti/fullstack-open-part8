import {useState} from "react";
import {useMutation} from "@apollo/client";
import {ALL_AUTHORS, EDIT_AUTHOR} from "../queries.jsx";

const BirthYearForm = (props) => {
    const [name, setName] = useState("")
    const [born, setBorn] = useState("")

    const [ setBornYear ] = useMutation(EDIT_AUTHOR, {
        refetchQueries: [ { query: ALL_AUTHORS } ]
    })

    if (!props.show) {
        return null
    }

    const submit = async (event) => {
        event.preventDefault()

        setBornYear( {variables: {name, setBornTo: parseInt(born)}} )

        setName('')
        setBorn('')
    }

    return (
        <div>
            <h2>Set birthyear</h2>
            <form onSubmit={submit}>
                <div>
                    Author
                    <input
                        value={name}
                        onChange={({ target }) => setName(target.value)}
                    />
                </div>
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