import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/notification'
import BlogForm from './components/blogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  const blogFormRef = useRef()
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
    }catch (exception) {
      setMessageType('error')
      setMessage('Wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const createBlog = async (newBlog) => {
    try{
      blogFormRef.current.toggleVisibility()

      const savedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(savedBlog))

      setMessageType('success')
      setMessage(`A new blog ${savedBlog.title} by ${savedBlog.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)

    }catch (exception) {
      setMessageType('error')
      setMessage(exception.response.data.error || 'Failed to create blog')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const rePopulateBlogFields = () => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }

  const likeBlog = async (blog) => {
    await blogService.like(blog)
    rePopulateBlogFields()
  }

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.delete(blog)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    }
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <div>
      <h2>Login</h2>
      <Notification message={message} type={messageType} />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  return (
    <div>

      {!user && loginForm()}
      {user && <div>
        <h2>blogs</h2>
        <Notification message={message} type={messageType} />
        <p>Logged in as {user.name} <button onClick={handleLogout}>logout</button></p>
        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm createBlog={createBlog} />
        </Togglable>

        {sortedBlogs.map(blog =>
          <Blog key={blog.id} blog={blog} handleLike={likeBlog} handleRemove={removeBlog} currentUser={user} />
        )}
      </div>
      }
    </div>
  )
}

export default App