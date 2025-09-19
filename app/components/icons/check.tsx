import clsx from 'clsx'
import type { ComponentProps } from 'react'

const Check = (props: ComponentProps<'svg'>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="14"
      viewBox="0 0 20 14"
      fill="none"
      className={clsx('fill-current', props.className)}
      {...props}
    >
      <path
        d="M18 1.25L7 12.25L2 7.25"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Check
