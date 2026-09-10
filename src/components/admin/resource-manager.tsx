'use client'

import { useRouter } from 'next/navigation'
import { AlertTriangle, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { Badge, Button } from '@/components/ui'
import { Checkbox, Field, Input, Select, Textarea } from '@/components/ui/field'
import { cn } from '@/lib/utils'

/**
 * The CMS.
 *
 * One component drives every managed collection — programs, trainers,
 * testimonials, gallery, memberships — from a field schema. That is what keeps
 * the promise that the gym owner never edits code to change a price, a photo or
 * a bio: adding a manageable field is one line in a schema, not a new screen.
 *
 * Writes go to /api/admin/[table], which re-checks the admin role and lets Row
 * Level Security have the final word.
 */

export type FieldType = 'text' | 'textarea' | 'number' | 'boolean' | 'list' | 'select' | 'image'

export interface FieldSchema {
  name: string
  label: string
  type: FieldType
  required?: boolean
  help?: string
  options?: readonly string[]
  /** Hide from the create/edit form but keep in the table (e.g. computed ids). */
  readOnly?: boolean
  placeholder?: string
}

export type RecordRow = Record<string, unknown> & { id?: string }

function emptyRecord(fields: FieldSchema[]): RecordRow {
  const record: RecordRow = {}
  for (const field of fields) {
    record[field.name] = field.type === 'boolean' ? false : field.type === 'list' ? [] : field.type === 'number' ? 0 : ''
  }
  return record
}

export function ResourceManager({
  table,
  fields,
  rows,
  singular,
  columns,
  canCreate = true,
  canDelete = true,
  note,
}: {
  table: string
  fields: FieldSchema[]
  rows: RecordRow[]
  singular: string
  /** Which fields to show as table columns, in order. */
  columns: string[]
  canCreate?: boolean
  canDelete?: boolean
  note?: string
}) {
  const router = useRouter()

  const [editing, setEditing] = useState<RecordRow | null>(null)
  const [creating, setCreating] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const open = creating || editing !== null
  const draft = creating ? emptyRecord(fields) : editing

  async function save(form: HTMLFormElement) {
    const data = new FormData(form)
    const record: RecordRow = {}

    for (const field of fields) {
      if (field.readOnly && !creating) continue

      const raw = data.get(field.name)
      if (field.type === 'boolean') record[field.name] = data.get(field.name) === 'on'
      else if (field.type === 'number') record[field.name] = Number(raw ?? 0)
      else if (field.type === 'list') {
        // One item per line — the least fiddly way to edit a string array.
        record[field.name] = String(raw ?? '')
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
      } else record[field.name] = String(raw ?? '')
    }

    setBusy(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/${table}`, {
        method: creating ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creating ? { record } : { id: editing?.id, record }),
      })

      const payload = (await response.json()) as { error?: string }
      if (!response.ok) throw new Error(payload.error ?? 'Could not save.')

      setCreating(false)
      setEditing(null)
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not save.')
    } finally {
      setBusy(false)
    }
  }

  async function remove(row: RecordRow) {
    if (!row.id) return
    const label = String(row.name ?? row.slug ?? 'this record')
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return

    setBusy(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/${table}?id=${encodeURIComponent(row.id)}`, { method: 'DELETE' })
      const payload = (await response.json()) as { error?: string }
      if (!response.ok) throw new Error(payload.error ?? 'Could not delete.')
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not delete.')
    } finally {
      setBusy(false)
    }
  }

  const columnFields = columns
    .map((name) => fields.find((field) => field.name === name))
    .filter((field): field is FieldSchema => Boolean(field))

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        {note ? <p className="max-w-2xl text-sm leading-relaxed text-ash">{note}</p> : <span />}
        {canCreate ? (
          <Button
            onClick={() => {
              setCreating(true)
              setEditing(null)
              setError('')
            }}
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add {singular}
          </Button>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="mt-6 flex items-start gap-3 border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}

      {rows.length ? (
        <div className="mt-8 overflow-x-auto border border-line bg-steel">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <caption className="sr-only">Manage {singular} records</caption>
            <thead>
              <tr className="border-b border-line">
                {columnFields.map((field) => (
                  <th
                    key={field.name}
                    scope="col"
                    className="px-5 py-4 font-display text-[0.5625rem] uppercase tracking-[0.18em] text-slate2"
                  >
                    {field.label}
                  </th>
                ))}
                <th scope="col" className="px-5 py-4 text-right font-display text-[0.5625rem] uppercase tracking-[0.18em] text-slate2">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={String(row.id ?? row.slug ?? index)} className="border-b border-line last:border-0 hover:bg-iron">
                  {columnFields.map((field) => (
                    <td key={field.name} className="max-w-xs px-5 py-4 align-middle text-sm text-ash">
                      <CellValue field={field} value={row[field.name]} />
                    </td>
                  ))}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(row)
                          setCreating(false)
                          setError('')
                        }}
                        aria-label={`Edit ${String(row.name ?? row.slug ?? 'record')}`}
                        className="flex h-8 w-8 items-center justify-center border border-line text-ash transition-colors hover:border-ember hover:text-ember"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden />
                      </button>
                      {canDelete ? (
                        <button
                          type="button"
                          onClick={() => void remove(row)}
                          aria-label={`Delete ${String(row.name ?? row.slug ?? 'record')}`}
                          className="flex h-8 w-8 items-center justify-center border border-line text-ash transition-colors hover:border-red-500 hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-8 border border-line bg-steel p-12 text-center">
          <p className="text-sm text-ash">
            No records yet. The public site is showing the built-in content until you add some here.
          </p>
        </div>
      )}

      {/* Editor drawer */}
      {open && draft ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${creating ? 'Add' : 'Edit'} ${singular}`}
          className="fixed inset-0 z-50 flex justify-end bg-ink/70 backdrop-blur-sm"
          onClick={() => {
            setCreating(false)
            setEditing(null)
          }}
        >
          <div
            className="flex h-full w-full max-w-xl flex-col border-l border-line bg-coal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-display text-lg uppercase leading-none">
                {creating ? `Add ${singular}` : `Edit ${singular}`}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setCreating(false)
                  setEditing(null)
                }}
                aria-label="Close editor"
                className="flex h-9 w-9 items-center justify-center border border-line text-ash transition-colors hover:border-ember hover:text-ember"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                void save(event.currentTarget)
              }}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex-1 space-y-6 overflow-y-auto px-6 py-7">
                {fields.map((field) => {
                  if (field.readOnly && !creating) return null
                  return <FieldControl key={field.name} field={field} value={draft[field.name]} />
                })}
              </div>

              <div className="flex items-center gap-3 border-t border-line px-6 py-5">
                <Button type="submit" disabled={busy}>
                  {busy ? 'Saving…' : creating ? `Create ${singular}` : 'Save changes'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setCreating(false)
                    setEditing(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function CellValue({ field, value }: { field: FieldSchema; value: unknown }) {
  if (field.type === 'boolean') {
    return value ? <Badge tone="success">Yes</Badge> : <span className="text-slate2">No</span>
  }
  if (field.type === 'image' && typeof value === 'string' && value) {
    return <span className="block truncate font-mono text-xs text-slate2">{value.replace(/^https?:\/\//, '')}</span>
  }
  if (field.type === 'list' && Array.isArray(value)) {
    return <span className="text-slate2">{value.length} items</span>
  }
  if (field.type === 'number' && typeof value === 'number') {
    return <span className="font-display tabular-nums text-bone">{value.toLocaleString('en-NG')}</span>
  }
  return <span className={cn('block truncate', field.name === 'name' && 'text-bone')}>{String(value ?? '—')}</span>
}

function FieldControl({ field, value }: { field: FieldSchema; value: unknown }) {
  const id = `field-${field.name}`

  if (field.type === 'boolean') {
    return (
      <div>
        <Checkbox id={id} name={field.name} defaultChecked={Boolean(value)} label={field.label} />
        {field.help ? <p className="ml-8 mt-2 text-xs text-slate2">{field.help}</p> : null}
      </div>
    )
  }

  return (
    <Field label={field.label} htmlFor={id} description={field.help} required={field.required}>
      {field.type === 'textarea' ? (
        <Textarea id={id} name={field.name} defaultValue={String(value ?? '')} required={field.required} placeholder={field.placeholder} />
      ) : field.type === 'list' ? (
        <Textarea
          id={id}
          name={field.name}
          defaultValue={Array.isArray(value) ? value.join('\n') : ''}
          placeholder={field.placeholder ?? 'One item per line'}
        />
      ) : field.type === 'select' ? (
        <Select id={id} name={field.name} defaultValue={String(value ?? '')} required={field.required}>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          id={id}
          name={field.name}
          type={field.type === 'number' ? 'number' : field.type === 'image' ? 'url' : 'text'}
          defaultValue={field.type === 'number' ? Number(value ?? 0) : String(value ?? '')}
          required={field.required}
          placeholder={field.placeholder}
        />
      )}
    </Field>
  )
}
