const axios = require('axios').default;

function getLadders() {
    return axios.get("/ladders", {
        baseURL: "https://warzone-statistics-backend.herokuapp.com/"
    });
}

function getLadder(ladderId) {
    return axios.get("/ladders/id/" + ladderId, {
        baseURL: "https://warzone-statistics-backend.herokuapp.com/"
    });
}

function getUserById(userId) {
    return axios.get("/users/id/" + userId, {
        baseURL: "https://warzone-statistics-backend.herokuapp.com/"
    });
}

function getUserByName(userName) {
    return axios.get("/users/name/" + userName, {
        baseURL: "https://warzone-statistics-backend.herokuapp.com/"
    });
}

export {
    getLadders,
    getLadder,
    getUserById,
    getUserByName
};
