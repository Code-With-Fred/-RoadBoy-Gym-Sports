'use client'

import { AlertCircle } from 'lucide-react'
import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Form primitives.
 *
 * Every control is wrapped by `Field`, which owns the label/description/error
 * wiring — that is what keeps `aria-describedby` and `aria-invalid` correct
 * without each form remembering to do it.
 */

const CONTROL =
  'w-full border border-line bg-coal px-4 text-[0.9375rem] text-bone transition-colors duration-200 ' +
  'placeholder:text-slate2 hover:border-white/20 focus:border-ember focus:outline-none ' +
  'disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-500/70'

export function Field({
  label,
  htmlFor,
  error,
  description,
  required,
  children,
  className,
}: {
  label: string
  htmlFor: string
  error?: string
  description?: string
  required?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label
        htmlFor={htmlFor}
        className="font-display text-[0.6875rem] uppercase tracking-[0.18em] text-ash"
      >
        {label}
        {required ? <span className="ml-1 text-ember" aria-hidden>*</span> : null}
        {required ? <span className="sr-only"> (required)</span> : null}
      </label>
      {description ? (
        <p id={`${htmlFor}-description`} className="text-xs text-slate2">
          {description}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(CONTROL, 'h-12', className)} {...props} />
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(CONTROL, 'min-h-[9rem] resize-y py-3.5 leading-relaxed', className)} {...props} />
}

export function Select({ className, children, ...props }: ComponentProps<'select'>) {
  return (
    <select
      className={cn(
        CONTROL,
        'h-12 cursor-pointer appearance-none bg-[length:14px] bg-[right_1rem_center] bg-no-repeat pr-10',
        className,
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238D9199' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
      }}
      {...props}
    >
      {children}
    </select>
  )
}

/** Label + control in one call, for the common case. */
export function LabelledInput({
  label,
  error,
  description,
  className,
  ...props
}: { label: string; error?: string; description?: string } & ComponentProps<'input'>) {
  const generated = useId()
  const id = props.id ?? generated
  return (
    <Field
      label={label}
      htmlFor={id}
      error={error}
      description={description}
      required={props.required}
      className={className}
    >
      <Input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [description ? `${id}-description` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') ||
          undefined
        }
        {...props}
      />
    </Field>
  )
}

export function LabelledTextarea({
  label,
  error,
  description,
  className,
  ...props
}: { label: string; error?: string; description?: string } & ComponentProps<'textarea'>) {
  const generated = useId()
  const id = props.id ?? generated
  return (
    <Field
      label={label}
      htmlFor={id}
      error={error}
      description={description}
      required={props.required}
      className={className}
    >
      <Textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [description ? `${id}-description` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') ||
          undefined
        }
        {...props}
      />
    </Field>
  )
}

/** Square, high-contrast checkbox — used heavily in the workout player. */
export function Checkbox({
  label,
  className,
  ...props
}: { label: ReactNode } & ComponentProps<'input'>) {
  const generated = useId()
  const id = props.id ?? generated
  return (
    <label
      htmlFor={id}
      className={cn('group flex cursor-pointer select-none items-center gap-3 text-sm', className)}
    >
      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center border border-white/25 transition-colors group-hover:border-ember">
        <input
          id={id}
          type="checkbox"
          className="peer absolute inset-0 cursor-pointer opacity-0"
          {...props}
        />
        <span className="pointer-events-none h-2.5 w-2.5 scale-0 bg-ember transition-transform duration-150 peer-checked:scale-100" />
      </span>
      <span className="text-ash transition-colors group-hover:text-bone">{label}</span>
    </label>
  )
}
