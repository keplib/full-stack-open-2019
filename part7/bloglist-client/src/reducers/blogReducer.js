import blogService from '../services/blogs'
import { notify } from './notificationReducer'

const INIT_BLOGS = 'INIT_BLOGS'

const blogReducer = (state = [], action) => {
  switch (action.type) {
  case INIT_BLOGS:
    return action.data
  default:
    return state
  }
}

export const initBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: INIT_BLOGS,
      data: blogs
    })
  }
}

export const addBlog = (blog, token) => {
  return async dispatch => {
    try {
      const created = await blogService.create(blog, token)
      dispatch(notify(`a new blog ${created.title} by ${created.author} added`, 'info'))
      await dispatch(initBlogs())
      return Promise.resolve()
    } catch(err) {
      dispatch(notify(`${err}`, 'error'))
      return Promise.reject()
    }
  }
}

export const likeBlog = (blog, token) => {
  return async dispatch => {
    const updated = { ...blog, likes: blog.likes + 1 }
    try {
      const res = await blogService.update(updated, token)
      dispatch(notify(`liked ${res.title} by ${res.author}`, 'info'))
      dispatch(initBlogs())
    } catch(err) {
      dispatch(notify(`${err}`, 'error'))
    }
  }
}

export default blogReducer
