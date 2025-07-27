import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlog, currentUser }) => {
  const blogStyle = {
    padding: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [showBlogData, setShowBlogData] = useState(false)
  const hideWhenVisible = { display: showBlogData ? 'none' : '' }
  const showWhenVisible = { display: showBlogData ? '' : 'none' }
  const userCanRemove = { display: currentUser && currentUser.username === blog.user.username ? '' : 'none' }

  const toggleVisibility = () => {
    setShowBlogData(!showBlogData)
  }

  const handleLike = async () => {
    const updatedBlog = await blogService.like(blog)
    updateBlog(updatedBlog)
  }

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.delete(blog)
      updateBlog(null)
    }
  }

  return (
    <div style = {blogStyle}>
      {blog.title} {blog.author}
      <button style={hideWhenVisible} onClick={() => toggleVisibility()}>view</button>
      <button style={showWhenVisible} onClick={() => toggleVisibility()}>hide</button>
      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>{blog.likes} likes <button onClick={() => handleLike()}>like</button></p>
        <p>{blog.user.name}</p>
        <button style={userCanRemove} onClick={() => handleRemove()}>Remove</button>
      </div>
    </div>
  )
}

export default Blog