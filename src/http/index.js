import axios  from "axios";

const API = axios.create({
    baseURL : '',
    headers : {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json'
    }
})

export default API