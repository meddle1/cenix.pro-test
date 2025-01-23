<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const q = ref('')
let timerId: number

const debouncedSearch = () => {
  clearTimeout(timerId)

  timerId = setTimeout(() => {
    if (q.value?.length < 3) {
      return
    }

    appStore.search(q.value)
  }, 600)
}

const resetSearch = () => {
  q.value = ''
  appStore.resetSearch()
}

watch(
  () => appStore.q,
  () => {
    q.value = appStore.q
  }
)
</script>

<template>
  <v-text-field
    v-model="q"
    label="Search"
    prepend-inner-icon="mdi-magnify"
    append-inner-icon="mdi-close"
    @update:modelValue="debouncedSearch"
    @click:append-inner="resetSearch()"
  ></v-text-field>
</template>
