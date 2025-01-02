<script setup lang="ts">
import { type PropType, type ExtractPublicPropTypes, type ComponentPropsOptions, type ExtractPropTypes } from 'vue'

defineOptions({ name: 'HButton' })
const props = defineProps({
  variant: {
    type: String as PropType<'default' | 'solid' | 'soft' | 'outline' | 'text' | 'pure'>,
    default: 'default',
  },
  color: {
    type: String as PropType<'primary' | 'success' | 'warning' | 'danger'>,
    default: 'primary',
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    default: 'md',
  },
  rounded: Boolean,
  square: Boolean,
  loading: Boolean,
})

export type ButtonProps = typeof props

const emit = defineEmits<{
  click: [value: Event]
}>()

function handleClick(event: Event) {
  emit('click', event)
}
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors cursor-pointer',
      'outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary-500/50',
      // 'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-500/20',
      'disabled:pointer-events-none disabled:opacity-50 ',
      '[&>svg]:pointer-events-none [&>svg]:shrink-0',
      {
        default: 'variant-default shadow-sm shadow-black/5',
        solid: 'variant-solid shadow-sm shadow-black/5',
        soft: 'variant-soft shadow-sm shadow-black/5',
        outline: 'variant-outline shadow-sm shadow-black/5',
        pure: 'variant-pure',
        text: 'variant-text',
      }[variant],
      {
        primary: 'variant-color-primary',
        success: 'variant-color-success',
        warning: 'variant-color-warning',
        danger: 'variant-color-danger',
      }[color],
      {
        sm: `h-8 ${square ? 'w-8 overflow-hidden' : 'px-3'}`,
        md: `h-9 ${square ? 'w-9 overflow-hidden' : 'px-4'}`,
        lg: `h-10 ${square ? 'w-10 overflow-hidden' : 'px-5'}`,
      }[size],
      rounded ? 'rounded-full' : 'rounded-md',
    ]"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
