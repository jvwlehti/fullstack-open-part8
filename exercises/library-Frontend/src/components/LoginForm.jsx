import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ show, handleLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')


    const [ login, result ] = useMutation(LOGIN, {
        onError: (error) => {
            error.graphQLErrors[0].message
        }
    })

    useEffect(() => {
        if ( result.data ) {
            const token = result.data.login.value
            handleLogin(token)
            setUsername("")
            setPassword("")
        }
    }, [result.data])

    if (!show) {
        return null
    }

    const submit = async (event) => {
        event.preventDefault()

        login({ variables: { username, password } })
    }

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    username <input
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                />
                </div>
                <div>
                    password <input
                    type='password'
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                />
                </div>
                <button type='submit'>login</button>
            </form>
        </div>
    )
}

export default LoginForm