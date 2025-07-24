const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')


const api = supertest(app)

describe('Blog API tests', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

    await User.deleteMany({})
    await helper.createNewUser('root', 'root', 'root', api)

  })

  describe('when there is initially some blogs saved', () => {
    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('id is named id', async () => {
      const response = await api.get('/api/blogs')

      response.body.forEach(blog => {
        assert.ok(blog.hasOwnProperty('id'))
      })
    })
  })

  describe('adding a new blog', () => {
    test('a valid blog can be added', async () => {
      const token = await helper.userLoginToken('root', 'root', api)

      const newBlog = {
        title: 'New Blog',
        author: 'API Tests',
        url: 'http://example.com/blog',
        likes: 5
      }

      await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201)

      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    })

    test('a unauthorized blog can not be added', async () => {

      const newBlog = {
        title: 'New Blog',
        author: 'API Tests',
        url: 'http://example.com/blog',
        likes: 5
      }

      const result = await api.post('/api/blogs').send(newBlog)

      assert.strictEqual(result.status, 401)
      assert.strictEqual(result.body.error, 'token missing or invalid')
    })

    test('a blog without likes defaults to 0', async () => {
      const token = await helper.userLoginToken('root', 'root', api)
      const newBlog = {
        title: 'Blog without likes',
        author: 'API Tests',
        url: 'http://example.com/blog'
      }

      const response = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201)
      assert.strictEqual(response.body.likes, 0)
    })

    test('a blog without title returns 400', async () => {
      const token = await helper.userLoginToken('root', 'root', api)
      const newBlog = {
          url: 'http://example.com/blog',
        }
      const result = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)
      assert.strictEqual(result.status, 400)
    })

    test('a blog without url returns 400', async () => {
      const token = await helper.userLoginToken('root', 'root', api)
      const newBlog = {
          title: 'Blog without URL',
        }
      const result = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)
      assert.strictEqual(result.status, 400)
    })
  })

  describe('deleting and updating a blog', () => {
    test('a blog can be deleted', async () => {
      const token = await helper.userLoginToken('root', 'root', api)

      const newBlog = {
        title: 'DELETE THIS',
        author: 'API Tests',
        url: 'http://example.com/blog',
        likes: 5
      }

      await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201)
      const blogsAtStart = await api.get('/api/blogs')
      const blogToDelete = blogsAtStart.body[blogsAtStart.body.length - 1]

      await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `Bearer ${token}`).expect(204)

      const blogsAtEnd = await api.get('/api/blogs')
      assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1)
    })

    test('a blog can be updated', async () => {
      const blogsAtStart = await api.get('/api/blogs')
      const blogToUpdate = blogsAtStart.body[0]
      const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

      const response = await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200)
      assert.strictEqual(response.body.likes, updatedBlog.likes)
      
      const blogsAtEnd = await api.get('/api/blogs')
      const updatedBlogInList = blogsAtEnd.body.find(b => b.id === blogToUpdate.id)
      assert.strictEqual(updatedBlogInList.likes, updatedBlog.likes)
    })
  })
})

after(async () => {
    await mongoose.connection.close()
})


