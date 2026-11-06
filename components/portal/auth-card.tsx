'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { PixelButton, PixelInput } from '@/components/mario/pixel-ui'

export type AuthField = {
  name: string
  label: string
  type?: string
  placeholder?: string
  options?: string[]
}

export function AuthCard({
  mode,
  world,
  title,
  subtitle,
  fields,
  redirectTo,
  switchHref,
  cardClass,
  buttonVariant,
  art,
}: {
  mode: 'login' | 'register'
  world: string
  title: string
  subtitle: string
  fields: AuthField[]
  redirectTo: string
  switchHref: string
  cardClass?: string
  buttonVariant: 'red' | 'yellow' | 'orange' | 'green'
  art?: ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      toast.success(mode === 'login' ? 'Player 1 ready! Loading world...' : 'Account created! Welcome, Guardian.')
      router.push(redirectTo)
    }, 600)
  }

  return (
    <div className="mx-auto w-full max-w-md">
      {art && <div className="mb-6 flex justify-center">{art}</div>}
      <div className={cn('pixel-box animate-rise-in p-7', cardClass ?? 'bg-cream text-ink')}>
        <span className="inline-block bg-ink px-2 py-1 font-pixel text-[8px] text-coin">World {world}</span>
        <h1 className="mt-4 font-pixel text-sm uppercase leading-relaxed">{title}</h1>
        <p className="mt-2 text-sm opacity-80">{subtitle}</p>
        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          {fields.map((f) =>
            f.options ? (
              <label key={f.name} htmlFor={f.name} className="flex flex-col gap-2">
                <span className="font-pixel text-[9px] uppercase text-current">{f.label}</span>
                <select
                  id={f.name}
                  name={f.name}
                  required
                  className="border-[3px] border-ink bg-white px-3 py-2.5 text-sm text-ink focus-visible:ring-3 focus-visible:ring-coin"
                >
                  {f.options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
            ) : (
              <PixelInput
                key={f.name}
                id={f.name}
                name={f.name}
                label={f.label}
                type={f.type ?? 'text'}
                placeholder={f.placeholder}
                required
              />
            ),
          )}
          <PixelButton type="submit" variant={buttonVariant} disabled={loading} className="mt-2 w-full">
            {loading ? 'Loading...' : mode === 'login' ? 'Press start' : 'Create player'}
          </PixelButton>
        </form>
        <p className="mt-5 text-center text-sm">
          {mode === 'login' ? 'New here? ' : 'Already a player? '}
          <Link href={switchHref} className="font-bold underline underline-offset-4">
            {mode === 'login' ? 'Create an account' : 'Log in'}
          </Link>
        </p>
      </div>
      <p className="mt-6 text-center">
        <Link href="/" className="font-pixel text-[9px] uppercase underline underline-offset-4">
          {'< Back to world select'}
        </Link>
      </p>
    </div>
  )
}
