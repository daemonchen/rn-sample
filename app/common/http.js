var queryString = require('query-string')

var Request = {}

Request.get = function (url, params) {
    if (params) {
        url += '?' + queryString.stringify(params)
    }
    return fetch(url)
        .then(res => res.json())
}


Request.post = function (url, body) {
    let fetchOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }

    return fetch(url, fetchOptions)
        .then(res => res.json())
}


module.exports = Request