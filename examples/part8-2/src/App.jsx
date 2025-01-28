import {useApolloClient, useQuery, useSubscription} from '@apollo/client'
import Persons from "../Components/Persons.jsx";
import PersonForm from "../Components/PersonForm.jsx";
import React, {useState} from "react";
import {ALL_PERSONS, PERSON_ADDED} from "./queries.jsx";
import Notify from "../Components/Notify.jsx";
import PhoneForm from "../Components/PhoneForm.jsx";
import LoginForm from "../Components/LoginForm.jsx";

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedPerson) => {
// helper that is used to eliminate saving same person twice
  const uniqByName = (a) => {
  let seen = new Set()
      return a.filter((item) => {
      let k = item.name
          return seen.has(k) ? false : seen.add(k)
    })
}

cache.updateQuery(query, ({ allPersons }) => {
    return {
        allPersons: uniqByName(allPersons.concat(addedPerson)),
    }
})}

const App = () => {

    const [errorMessage, setErrorMessage] = useState(null)
    const [token, setToken ] = useState(null)

    const result = useQuery(ALL_PERSONS)
    const client = useApolloClient()

    useSubscription(PERSON_ADDED, {
        onData: ({ data }) => {
            const addedPerson = data.data.personAdded
            notify(`${addedPerson.name} added`)
            updateCache(client.cache, { query: ALL_PERSONS }, addedPerson)
        }
    })

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