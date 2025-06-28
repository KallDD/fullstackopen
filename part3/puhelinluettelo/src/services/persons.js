import axios from "axios";
const baseUrl = 'api/persons'

const getAll = () => {
  return axios.get(baseUrl).then(response => response.data)
}

const create = newObject => {
    return axios.post(baseUrl, newObject).then(response => response.data)
}

const update = (id, newObject) => {
  const url = `${baseUrl}/${id}`
   return axios.put(url, newObject).then(response => response.data)
}

const deletePerson = id => {
  const url = `${baseUrl}/${id}`
  return axios.delete(url)
}

export default {
  getAll: getAll,
  create: create,
  update: update,
  delete: deletePerson
}