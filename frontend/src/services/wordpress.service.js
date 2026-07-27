import axios from 'axios'

const WORDPRESS_API_URL =
  import.meta.env.VITE_WORDPRESS_API_URL || 'http://localhost:8080/wp-json/wp/v2'

const wordpressApi = axios.create({
  baseURL: WORDPRESS_API_URL,
})

async function getPosts({ page = 1, perPage = 10, signal } = {}) {
  const response = await wordpressApi.get('/posts', {
    params: {
      page,
      per_page: perPage,
      _fields: 'id,date,link,title,excerpt',
    },
    signal,
  })

  return {
    posts: response.data,
    total: Number(response.headers['x-wp-total'] || 0),
    totalPages: Number(response.headers['x-wp-totalpages'] || 1),
  }
}

export { WORDPRESS_API_URL, getPosts }
