import { useQuery } from '@apollo/client'
import Persons from "../Components/Persons.jsx";
import PersonForm from "../Components/PersonForm.jsx";
import React, {useState} from "react";
import {ALL_PERSONS} from "./queries.jsx";
import Notify from "../Components/Notify.jsx";
import PhoneForm from "../Components/PhoneForm.jsx";

const App = () => {

    const [errorMessage, setErrorMessage] = useState(null)

    const result = useQuery(ALL_PERSONS)

    if (result.loading)  {
        return <div>loading...</div>
    }

    const notify = (message) => {
        setErrorMessage(message)
        setTimeout(() => {
            setErrorMessage(null)
        }, 10000)
    }

    return (
        <div>
            <Notify errorMessage={errorMessage} />
            <Persons persons = {result.data.allPersons} />
            <PersonForm setError={notify} />
            <PhoneForm setError={notify} />
        </div>
    )
}

export default App