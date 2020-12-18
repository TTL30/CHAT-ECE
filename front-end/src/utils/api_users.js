import { Auth } from './auth';
import {BACK_HOST, HTTP_HEADERS} from './constant'

export const login = async (username,password, onSuccess, onError) => {
    try {
        const response = await fetch(`${BACK_HOST}/login`, {
            headers: HTTP_HEADERS,
            credentials: "include",
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (response.ok) {
            const json = await response.json()
            Auth.authenticate(json)
            onSuccess(json)
        }
        else {
            const json = await response.json()
            onError(json)
        }
    } catch (error) {
        console.log(error);
    }
}

export const signIn = async (username, email, password, onSuccess, onError) => {
    try {
        const response = await fetch(`${BACK_HOST}/users`, {
            headers: HTTP_HEADERS,
            credentials: "include",
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                channels:[],
                avatar:"monsterid"
            })
        });

        if (response.ok) {
            const json = await response.json()
            onSuccess(json)
        }
        else {
            const json = await response.json()
            onError(json)
        }
    } catch (error) {
        console.log(error);
    }
}

export const addUsToChan = async (id, username, onSuccess, onError) => {
    try {
        const response = await fetch(`${BACK_HOST}/channels/users/${id}`, {
            headers: HTTP_HEADERS,
            credentials: "include",
            mode: 'cors',
            method: 'PUT',
            body: JSON.stringify({
                username: username,
            })
        });

        if (response.ok) {
            const json = await response.json()
            onSuccess(json)
        }
        else {
            const json = await response.json()
            onError(json)
        }
    } catch (error) {
        console.log(error);
    }
}

export const changeAvat = async (id, avatar, onSuccess, onError) => {
    try {
        const response = await fetch(`${BACK_HOST}/users/${id}`, {
            headers: HTTP_HEADERS,
            credentials: "include",
            mode: 'cors',
            method: 'PUT',
            body: JSON.stringify({
                avatar: avatar,
            })
        });

        if (response.ok) {
            const json = await response.json()
            onSuccess(json)
        }
        else {
            const json = await response.json()
            onError(json)
        }
    } catch (error) {
        console.log(error);
    }
}


