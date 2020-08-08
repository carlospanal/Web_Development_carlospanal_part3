import axios from 'axios'
//const baseUrl = 'http://localhost:3001/api/persons'
const baseUrl = '/api/persons'


const create = newObject => {
    console.log('personsjs')
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const initGet = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const deleteId = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

const updateId = (id,newObject) => {
    console.log(id,newObject)
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}



export default {create,initGet,deleteId,updateId}
