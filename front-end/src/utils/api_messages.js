import {BACK_HOST, HTTP_HEADERS} from './constant'


export const getMessagesChannel = async (id, onSuccess, onError) => {
    console.log('jai ' + id)
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

export const sendMessageToChannel = async (id, author, content, onSuccess, onError) => {
    try {
        const response = await fetch(`${BACK_HOST}/channels/${id}/messages`, {
            headers: HTTP_HEADERS,
            credentials: "include",
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify({
                author: author,
                content: content
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

export const createChannel = async (id, name, onSuccess, onError) => {
    try {

        const response = await fetch(`${BACK_HOST}/${id}/channels`, {
            headers: HTTP_HEADERS,
            credentials: "include",
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify({
                name: name,
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


export const getTask = async (onSuccess, onError) => {
    try {
        const response = await fetch(`${BACK_HOST}/list`, {
            headers: HTTP_HEADERS,
            credentials: "include",
            mode: 'cors',
            method: 'GET'
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

export const updateTask = async (id_task, description, onSuccess, onError) => {
    try {
        const response = await fetch(`${BACK_HOST}list/update/${id_task}`, {
            headers: HTTP_HEADERS,
            credentials: "include",
            mode: 'cors',
            method: 'PUT',
            body: JSON.stringify({
                description: description,
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

export const deleteTask = async (id_task, onSuccess, onError) => {
    try {
        const response = await fetch(`${BACK_HOST}list/delete/${id_task}`, {
            headers: HTTP_HEADERS,
            credentials: "include",
            mode: 'cors',
            method: 'DELETE',
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