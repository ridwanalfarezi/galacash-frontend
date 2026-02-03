'use client'

import { Toaster as SonnerToaster } from 'sonner'
import type { ToasterProps as SonnerToasterProps } from 'sonner'

export function Toaster(props: SonnerToasterProps) {
  return <SonnerToaster {...props} />
}

export default Toaster
