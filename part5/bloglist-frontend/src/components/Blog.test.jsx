import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import Blog from "./Blog";

test("renders content", () => {
  const blog = {
    title: "Test Blog",
    author: "Test Author",
    url: "http://testblog.com",
    likes: 10,
    user: { name: "Test User", username: "testuser" },
  }

  render(<Blog blog={blog} currentUser={{ username: "testuser" }} />)

  const element = screen.getByText("Test Blog Test Author")
  expect(element).toBeDefined()

  const hiddenDiv = screen.getByTestId("blog-details")
  expect(hiddenDiv).not.toBeVisible()

})

test("toggles visibility when view button is clicked", async () => {
  const blog = {
    title: "Test Blog",
    author: "Test Author",
    url: "http://testblog.com",
    likes: 10,
    user: { name: "Test User", username: "testuser" },
  }

  render(<Blog blog={blog} currentUser={{ username: "testuser" }} />)
  
  const viewButton = screen.getByText("view")
  await userEvent.click(viewButton)

  const hiddenDiv = screen.getByTestId("blog-details")
  expect(hiddenDiv).toBeVisible()
})

test("calls event handler when like button is clicked", async () => {
  const blog = {
    title: "Test Blog",
    author: "Test Author",
    url: "http://testblog.com",
    likes: 10,
    user: { name: "Test User", username: "testuser" },
  }

  const mockHandleLike = vi.fn()

  render(<Blog blog={blog} handleLike={mockHandleLike} currentUser={{ username: "testuser" }} />)

  const viewButton = screen.getByText("view")
  await userEvent.click(viewButton)

  const likeButton = screen.getByText("like")
  await userEvent.click(likeButton)
  await userEvent.click(likeButton)

  expect(mockHandleLike.mock.calls).toHaveLength(2)

})