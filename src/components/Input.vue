<script setup lang="ts">
import { type PropType, type ExtractPublicPropTypes, type ComponentPropsOptions, type ExtractPropTypes } from 'vue'

defineOptions({ name: 'HInput' })
const props = defineProps({
  value: {
    type: String,
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    default: 'md',
  },
  disabled: Boolean,
})

export type InputProps = typeof props

const emit = defineEmits<{
  'update:value': [value: string]
  input: [value: string]
  change: [value: string]
}>()

function handleInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('update:value', value)
  emit('input', value)
}

function handleChange(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('change', value)
}
</script>

<template>
  <div>
    <input
      :class="[
        'flex w-full border border-natural-300 bg-white px-3 py-2 text-sm text-natural-700 shadow-sm shadow-black/5 transition-shadow',
        'placeholder:text-natural-400 ',
        'focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-500/20 ',
        'disabled:cursor-not-allowed disabled:opacity-50',
        {
          sm: 'h-8',
          md: 'h-9',
          lg: 'h-10',
        }[size],
        'rounded-md',
      ]"
      :value="value"
      @input="handleInput"
      @change="handleChange"
    />
  </div>
</template>
