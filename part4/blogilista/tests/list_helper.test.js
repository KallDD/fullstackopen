const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const emptyBlogs = []
const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

test('dummy returns one', () => {
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const singleBlog = [{ title: 'Single Blog', author: 'Single Author', url: 'http://example.com/single', likes: 7 }]
  const blogs = [
    { _id: '1', title: 'Blog 1', author: 'Author 1', url: 'http://example.com/1', likes: 5 , _V: '0'},
    { _id: '2', title: 'Blog 2', author: 'Author 2', url: 'http://example.com/2', likes: 10, _V: '0'},
    { _id: '3', title: 'Blog 3', author: 'Author 3', url: 'http://example.com/3', likes: 15, _V: '0'},
    { _id: '4', title: 'Blog 4', author: 'Author 4', url: 'http://example.com/4', likes: null, _V: '0'}
  ]

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyBlogs)
    assert.strictEqual(result, 0)
  })

  test('when list has one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(singleBlog)
    assert.strictEqual(result, 7)
  })

  test('of a bigger list is calculated correctly', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 30)
  })
})

describe('favorite blog', () => {
  const blogs = [
    { _id: '1', title: 'Blog 1', author: 'Author 1', url: 'http://example.com/1', likes: 5 , _V: '0'},
    { _id: '2', title: 'Blog 2', author: 'Author 2', url: 'http://example.com/2', likes: 10, _V: '0'},
    { _id: '3', title: 'Blog 3', author: 'Author 3', url: 'http://example.com/3', likes: 10, _V: '0'},
    { _id: '4', title: 'Blog 4', author: 'Author 4', url: 'http://example.com/4', likes: null, _V: '0'}
  ]

  test('of list is correctly identified', () => {
    const result = listHelper.favoriteBlog(blogs)
    const expectedBlog2 = { _id: '2', title: 'Blog 2', author: 'Author 2', url: 'http://example.com/2', likes: 10, _V: '0' }
    const expectedBlog3 = { _id: '3', title: 'Blog 3', author: 'Author 3', url: 'http://example.com/3', likes: 10, _V: '0' }
    
    const isValidResult = JSON.stringify(result) === JSON.stringify(expectedBlog2) || 
                         JSON.stringify(result) === JSON.stringify(expectedBlog3)
    
    assert.ok(isValidResult)
  })
})

describe('most blogs', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostBlogs(emptyBlogs)
    assert.strictEqual(result, null)
  })

  test('of a list with multiple authors returns the author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    const expected = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    assert.deepStrictEqual(result, expected)
  })
})

describe('most likes', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostLikes(emptyBlogs)
    assert.strictEqual(result, null)
  })

  test('of a list with multiple authors returns the author with most likes', () => {
    const result = listHelper.mostLikes(blogs)
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 12
    }
    assert.deepStrictEqual(result, expected)
  })
})