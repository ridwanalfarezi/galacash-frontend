import clsx from 'clsx'
import type { ComponentProps } from 'react'

const X = (props: ComponentProps<'svg'>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="15"
      viewBox="0 0 16 15"
      fill="none"
      className={clsx('fill-current', props.className)}
      {...props}
    >
      <path
        d="M14 1.25L2 13.25M2 1.25L14 13.25"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default X
