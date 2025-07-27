import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newBlog => {
  const config = { headers: { authorization: token }, }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const like = async likedBlog => {
  likedBlog = { ...likedBlog, likes: likedBlog.likes + 1, user: likedBlog.user.id }
  const response = await axios.put(`${baseUrl}/${likedBlog.id}`, likedBlog)
  return response.data
}

const deleteBlog = async blog => {
  const config = { headers: { authorization: token }, }
  const reqUrl = `${baseUrl}/${blog.id}`
  console.log(reqUrl)

  const response = await axios.delete(reqUrl, config)
  return response.data
}

export default { getAll, setToken, create, like, delete: deleteBlog }