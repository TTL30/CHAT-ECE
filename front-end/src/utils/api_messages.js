import { BACK_HOST, HTTP_HEADERS } from './constant'


export const getMessagesChannel = async (id, onSuccess, onError) => {
    try {
        const response = await fetch(`${BACK_HOST}/channels/${id}/messages`, {
            headers: HTTP_HEADERS,
            credentials: "include",
            mode: 'cors',
            method: 'GET',
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

export const sendMessageToChannel = async (id, author, content, creation, email, avatar, onSuccess, onError) => {
    try {
        const response = await fetch(`${BACK_HOST}/channels/${id}/messages`, {
            headers: HTTP_HEADERS,
            credentials: "include",
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify({
                author: author,
                content: content,
                creation: creation,
                email: email,
                avatar: avatar
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



export const deleteMessageChannel = async (idM, idC, onSuccess, onError) => {
    try {
        const response = await fetch(`${BACK_HOST}/channels/${idC}/messages/${idM}`, {
            headers: HTTP_HEADERS,
            credentials: "include",
            mode: 'cors',
            method: 'DELETE'
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

export const upMessageChannel = async (idM, idC, message, onSuccess, onError) => {
    try {
        const response = await fetch(`${BACK_HOST}/channels/${idC}/messages/${idM}`, {
            headers: HTTP_HEADERS,
            credentials: "include",
            mode: 'cors',
            method: 'PUT',
            body: JSON.stringify({
                content: message,
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