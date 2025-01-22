import { defineStore } from 'pinia'
import { PostsPerPage, DefaultPosts } from '@/constants/posts'

export interface Post {
  id: string
  name: string
}

interface AppStore {
  q: string
  pageIndex: number
  items: Post[]
  isMutating: boolean
}

const initItems = (): Post[] => {
  const items = localStorage.getItem('posts')

  if (!!items) {
    return JSON.parse(items)
  }

  return JSON.parse(JSON.stringify(DefaultPosts))
}

const updateLocalStorage = (items: Post[]) => {
  localStorage.setItem('posts', JSON.stringify(items))
}

const items = initItems()

export const useAppStore = defineStore('app', {
  state: (): AppStore => ({
    q: '',
    pageIndex: 1,
    items,
    isMutating: true,
  }),

  getters: {
    posts(state) {
      return !!state.q
        ? this.items.filter((post) => post.name.includes(state.q))
        : this.items
    },
    pagesCount() {
      return Math.ceil(this.posts.length / PostsPerPage)
    },
    currentPage(state) {
      const start = (state.pageIndex - 1) * PostsPerPage
      const end = start + PostsPerPage

      return this.posts.slice(start, end)
    },
  },

  actions: {
    search(value: string) {
      this.isMutating = true

      this.$patch({
        q: value,
        pageIndex: 1,
      })

      this.isMutating = false
    },
    resetSearch() {
      this.isMutating = true

      this.$patch({
        q: '',
        pageIndex: 1,
      })

      this.isMutating = false
    },
    addPost(value: Post) {
      this.isMutating = true

      this.q = ''
      this.items.push(value)
      this.pageIndex = this.pagesCount

      updateLocalStorage(this.items)

      this.isMutating = false
    },
    updatePost(value: Post) {
      if (!value?.id) {
        return
      }

      const item = this.items.find((item: Post) => item.id === value.id)

      if (!item) {
        return
      }

      this.isMutating = true

      item.name = value.name
      updateLocalStorage(this.items)

      this.isMutating = false
    },
    removePost(id: string) {
      if (!id) {
        return
      }

      this.isMutating = true

      this.items = this.items.filter((item: Post) => item.id !== id)
      updateLocalStorage(this.items)

      this.isMutating = false
    },
    init() {
      const route = useRoute()

      this.$patch({
        q: route.query?.q || '',
        pageIndex: parseInt(route.query?.page) || 1,
      })

      this.isMutating = false
    },
  },
})
