import { useState } from 'react'
import Router from 'next/router'

import useRequest from '../../hooks/use-request'

export default function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { doRequest, renderError } = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: {
            email, password,
        },
        onSuccess: () => Router.push('/')
    })

    const onSbmit = async (e) => {
        e.preventDefault()

        doRequest()
    }

    return (
        <form onSubmit={onSbmit}>
            <h1>Sign In</h1>
            {renderError('email')}
            {renderError()}
            <div className="form-group">
                <label>Email Address</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="form-control"/>
            </div>
            {renderError('password')}
            <div className="form-group mb-2">
                <label>Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control"/>
            </div>
            <button className="btn btn-primary">Sign In</button>
        </form>
    )
}