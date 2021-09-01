class Api {
    static login(url,data) {
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
}

export default Api