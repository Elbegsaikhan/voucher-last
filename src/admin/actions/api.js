class Api {
    static login = (url,data) => {
        return fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            credentials:'include',
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
    };
    static checkToken = (url) => {
        return fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "GET",
            credentials:'include',
        })
    }
}

export default Api