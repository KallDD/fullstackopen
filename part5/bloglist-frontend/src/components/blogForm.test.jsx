import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import BlogForm from "./blogForm";

test('create blog', async () => {
  const mockCreateBlog = vi.fn()
  render(<BlogForm createBlog={mockCreateBlog} />)

  const titleInput = screen.getByPlaceholderText('Title')
  const authorInput = screen.getByPlaceholderText('Author')
  const urlInput = screen.getByPlaceholderText('URL')
  const createButton = screen.getByText('create')

  await userEvent.type(titleInput, 'Test Blog')
  await userEvent.type(authorInput, 'Test Author')
  await userEvent.type(urlInput, 'http://testblog.com')
  await userEvent.click(createButton)

  expect(mockCreateBlog).toHaveBeenCalledWith({
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testblog.com'
  })
})