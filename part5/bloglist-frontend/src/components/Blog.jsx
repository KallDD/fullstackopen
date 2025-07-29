import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, handleLike, handleRemove, currentUser }) => {
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

  return (
    <div style = {blogStyle} className="blog">
      {blog.title} {blog.author}
      <button style={hideWhenVisible} onClick={() => toggleVisibility()}>view</button>
      <button style={showWhenVisible} onClick={() => toggleVisibility()}>hide</button>
      <div style={showWhenVisible} data-testid="blog-details">
        <p>{blog.url}</p>
        <p>{blog.likes} likes <button onClick={() => handleLike(blog)}>like</button></p>
        <p>{blog.user.name}</p>
        <button style={userCanRemove} onClick={() => handleRemove(blog)}>Remove</button>
      </div>
    </div>
  )
}

export default Blog