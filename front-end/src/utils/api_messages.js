import {BACK_HOST, HTTP_HEADERS} from './constant'


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

export const sendMessageToChannel = async (id, author, content, creation, onSuccess, onError) => {
    try {
        const response = await fetch(`${BACK_HOST}/channels/${id}/messages`, {
            headers: HTTP_HEADERS,
            credentials: "include",
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify({
                author: author,
                content: content,
                creation: creation
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