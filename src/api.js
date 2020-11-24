import axios from 'axios'

export default () => {
    return axios.create({
        // baseURL: process.env.VUE_APP_API_URL,
        // baseURL: "http://localhost:3000",
        baseURL: "https://jklukjsonstore.herokuapp.com",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}