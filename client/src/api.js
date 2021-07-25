const axios = require('axios').default;
// const BASE_URL = "https://warzone-statistics-backend.herokuapp.com/";
const BASE_URL = "http://localhost:9000";

function getLadders() {
    return axios.get("/ladders", {
        baseURL: BASE_URL
    });
}

function getLadder(ladderId) {
    return axios.get("/ladders/id/" + ladderId, {
        baseURL: BASE_URL
    });
}

function getColours() {
    return axios.get("/colours", {
        baseURL: BASE_URL
    });
}

function getUsers() {
    return axios.get("/users", {
        baseURL: BASE_URL
    });
}

function getUserById(userId) {
    return axios.get("/users/id/" + userId, {
        baseURL: BASE_URL
    });
}

function getUserByName(userName) {
    return axios.get("/users/name/" + userName, {
        baseURL: BASE_URL
    });
}

export {
    getLadders,
    getLadder,
    getColours,
    getUsers,
    getUserById,
    getUserByName
};
