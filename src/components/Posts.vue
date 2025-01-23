<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import type { Post } from '@/types/post'

import EditPost from '@/components/EditPost.vue'
import SearchPosts from '@/components/SearchPosts.vue'

const appStore = useAppStore()
const router = useRouter()

const isEditingPost = ref(false)

const post = ref<Post | null | undefined>(null)

const addPost = () => {
  post.value = null

  isEditingPost.value = true
}

const editPost = (id?: string) => {
  if (!id) {
    return
  }

  post.value = appStore.currentPage.find((item: Post) => item.id === id)
  if (!post.value) {
    return
  }

  isEditingPost.value = true
}

onMounted(() => {
  appStore.init()
})

watch([() => appStore.q, () => appStore.pageIndex], () => {
  router.push({ query: { q: appStore.q, page: appStore.pageIndex } })
})
</script>

<template>
  <v-container>
    <v-responsive class="align-centerfill-height mx-auto" max-width="900">
      <div class="text-center">
        <h1 class="text-h4 font-weight-bold">My projects</h1>
      </div>

      <div class="py-4" />

      <v-row align="center" justify="center">
        <v-col cols="auto">
          <v-btn @click="addPost">Add Post</v-btn>
        </v-col>
      </v-row>

      <v-row align="center" justify="center">
        <SearchPosts />
      </v-row>

      <v-card class="mx-auto" max-width="900">
        <v-list v-if="!appStore.isMutating">
          <v-list-item
            v-for="post in appStore.currentPage"
            :key="post.id"
            :title="post.name"
            @click="editPost(post.id)"
          >
            <template v-slot:append>
              <v-btn
                color="grey-lighten-1"
                icon="mdi-delete"
                variant="text"
                @click.stop="appStore.removePost(post.id)"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card>

      <v-pagination
        v-model="appStore.pageIndex"
        rounded="circle"
        :length="appStore.pagesCount"
        class="my-4"
      ></v-pagination>

      <EditPost
        v-if="isEditingPost"
        :post="post"
        @close="isEditingPost = false"
        @addPost="appStore.addPost"
        @updatePost="appStore.updatePost"
      />
    </v-responsive>
  </v-container>
</template>
