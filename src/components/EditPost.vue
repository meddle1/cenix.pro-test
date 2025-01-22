<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { minLength, required } from '@vuelidate/validators'
import { v4 } from 'uuid'
import { computed } from 'vue'
import { Post } from '@/stores/app'

interface PropTypes {
  post?: Post | null
}

const props = withDefaults(defineProps<PropTypes>(), {
  post: { id: '', name: '' },
} as PropTypes)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'addPost', value: Post): void
  (e: 'updatePost', value: Post): void
}>()

const title = !!props.post?.id ? 'Edit post' : 'Add post'

const name = ref<string>(props.post?.name || '')

const shouldValidate = ref(false)

const rules = {
  name: {
    minLength: minLength(5),
    required,
  },
}

const v$ = useVuelidate(rules, { name })

const errorMessage = computed(() => {
  if (!shouldValidate.value) {
    return ''
  }

  if (!v$.value.$errors?.length) {
    return ''
  }

  return v$.value.$errors[0].$message
})

const save = async () => {
  shouldValidate.value = true

  const isValid = await v$.value.$validate()

  if (!isValid) {
    return
  }

  if (!!props.post?.id) {
    emit('updatePost', { id: props.post.id, name: name.value })
  } else {
    emit('addPost', { id: v4() as string, name: name.value })
  }

  emit('close')
}
</script>

<template>
  <v-dialog
    :model-value="true"
    max-width="600"
    @update:modelValue="emit('close')"
  >
    <v-card prepend-icon="mdi-post" :title="title">
      <v-card-text>
        <v-text-field v-model="name" label="Post name*" required></v-text-field>

        <p class="text-red text-10 font-bold">
          {{ errorMessage }}
        </p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text="Close" variant="plain" @click="emit('close')"></v-btn>

        <v-btn
          color="primary"
          text="Save"
          variant="tonal"
          @click="save"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
