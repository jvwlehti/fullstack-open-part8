import {useApolloClient, useQuery} from '@apollo/client'
import Persons from "../Components/Persons.jsx";
import PersonForm from "../Components/PersonForm.jsx";
import React, {useState} from "react";
import {ALL_PERSONS} from "./queries.jsx";
import Notify from "../Components/Notify.jsx";
import PhoneForm from "../Components/PhoneForm.jsx";
import LoginForm from "../Components/LoginForm.jsx";

const App = () => {

    const [errorMessage, setErrorMessage] = useState(null)
    const [token, setToken ] = useState(null)

    const result = useQuery(ALL_PERSONS)
    const client = useApolloClient()

    if (result.loading)  {
        return <div>loading...</div>
    }

    const logout = () => {
        setToken(null)
        localStorage.clear()
        client.resetStore()
    }

    const notify = (message) => {
        setErrorMessage(message)
        setTimeout(() => {
            setErrorMessage(null)
        }, 10000)
    }

    if (!token) {
        return (
            <>
                <Notify errorMessage={errorMessage} />
                <LoginForm setToken={setToken} setError={notify} />
            </>
        )
    }

    return (
        <div>
            <Notify errorMessage={errorMessage} />
            <button onClick={logout}>logout</button>
            <Persons persons = {result.data.allPersons} />
            <PersonForm setError={notify} />
            <PhoneForm setError={notify} />
        </div>
    )
}

export default App