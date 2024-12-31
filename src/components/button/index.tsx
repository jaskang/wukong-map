import type { ComponentProps } from 'react'
import { clsx } from 'kotl'
import { createVariantClass } from '../internal-style'

type ButtonProps = Omit<ComponentProps<'button'>, 'size'> & {
  variant?: 'default' | 'solid' | 'soft' | 'outline' | 'text' | 'pure'
  color?: 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
  square?: boolean
  loading?: boolean
}

// Dependencies: pnpm install lucide-react

function style(props: ButtonProps) {
  const { variant = 'default', color = 'primary', size = 'md', rounded = false, square = false } = props

  return clsx(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors cursor-pointer',
    'outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary-500/50',
    // 'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-500/20',
    'disabled:pointer-events-none disabled:opacity-50 ',
    '[&>svg]:pointer-events-none [&>svg]:shrink-0',
    {
      default: 'variant-default shadow-sm',
      solid: 'variant-solid shadow-sm',
      soft: 'variant-soft shadow-sm',
      outline: 'variant-outline shadow-sm',
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
    rounded ? 'rounded-full' : 'rounded-md'
  )
}

export function Button(props: ButtonProps) {
  const { variant, color, size, rounded, square, loading, className: _className, children, ...rest } = props
  const fullClassName = style(props)
  return (
    <button {...rest} className={fullClassName}>
      {children}
    </button>
  )
}
