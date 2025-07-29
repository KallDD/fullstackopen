const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = page.locator('form[name="loginForm"]')
    await expect(loginForm).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.fill('input[name="username"]', 'mluukkai')
      await page.fill('input[name="password"]', 'salainen')
      await page.getByRole('button', { name: 'login' }).click();

      const text = page.getByText('Logged in as Matti Luukkainen')
      await expect(text).toContainText('Logged in as Matti Luukkainen')
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.fill('input[name="username"]', 'mluukkai')
      await page.fill('input[name="password"]', 'wrong')
      await page.getByRole('button', { name: 'login' }).click();

      const notification = page.getByText('Wrong username or password')
      await expect(notification).toBeVisible()
      await expect(notification).toHaveClass(/error/)
      await expect(notification).toHaveText('Wrong username or password')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.fill('input[name="username"]', 'mluukkai')
      await page.fill('input[name="password"]', 'salainen')
      await page.getByRole('button', { name: 'login' }).click();

      const text = page.getByText('Logged in as Matti Luukkainen')
      await expect(text).toContainText('Logged in as Matti Luukkainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await page.click('button:has-text("create new blog")')
      await page.fill('input[name="title"]', 'Test Blog')
      await page.fill('input[name="author"]', 'Test Author')
      await page.fill('input[name="url"]', 'http://test.com')
      await page.getByRole('button', { name: 'create' }).click();

      const notification = page.getByText('A new blog Test Blog by Test Author added')
      await expect(notification).toBeVisible()
      await expect(notification).toHaveClass(/success/)
      await expect(notification).toHaveText('A new blog Test Blog by Test Author added')

      const blog = page.getByText('Test Blog Test') 
      //Playwright löytää blogin oudolla otsikolla varmistin käyttämällä codegen työkalua
      await expect(blog).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await page.click('button:has-text("create new blog")')
        await page.fill('input[name="title"]', 'Test Blog')
        await page.fill('input[name="author"]', 'Test Author')
        await page.fill('input[name="url"]', 'http://test.com')
        await page.getByRole('button', { name: 'create' }).click();

        const blog = page.getByText('Test Blog Test')
        await expect(blog).toBeVisible()
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByTestId('blog-details')).toContainText('0 likes')
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByTestId('blog-details')).toContainText('1 likes')
      })

      test('the user who created the blog can remove it', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

        page.once('dialog', async (dialog) => {
          console.log(`Dialog message: ${dialog.message()}`);
          await dialog.accept();
        });
        await page.getByRole('button', { name: 'remove' }).click()

        const blog = page.getByText('Test Blog Test')
        await expect(blog).not.toBeVisible()
      })

      test('a user cannot see remove button for a blog created by New user', async ({ page, request }) => {
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Kalle Korpela',
            username: 'Kall',
            password: 'salainen'
          }
        })
        await page.getByRole('button', { name: 'logout' }).click();
        await page.fill('input[name="username"]', 'Kall')
        await page.fill('input[name="password"]', 'salainen')
        await page.getByRole('button', { name: 'login' }).click();

        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })

      test('blogs are ordered by likes', async ({ page }) => {
        await page.click('button:has-text("create new blog")')
        await page.fill('input[name="title"]', 'New Blog')
        await page.fill('input[name="author"]', 'New Author')
        await page.fill('input[name="url"]', 'http://New.com')
        await page.getByRole('button', { name: 'create' }).click();

        const NewBlog = page.getByText('New Blog New Author')
        await expect(NewBlog).toBeVisible()

        let blogs = page.locator('.blog')
        let firstBlog = blogs.nth(0)
        let secondBlog = blogs.nth(1)

        await expect(firstBlog).toContainText('Test Blog Test Author')
        await expect(secondBlog).toContainText('New Blog New Author')

        await NewBlog.getByRole('button', { name: 'view' }).click()
        await NewBlog.getByRole('button', { name: 'like' }).click()

        blogs = page.locator('.blog')
        firstBlog = blogs.nth(0)
        secondBlog = blogs.nth(1)

        await expect(firstBlog).toContainText('New Blog New Author')
        await expect(secondBlog).toContainText('Test Blog Test Author')
      })
    })
  })
})