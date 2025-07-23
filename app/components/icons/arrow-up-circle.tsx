import clsx from 'clsx'
import type { ComponentProps } from 'react'

const ArrowUpCircle = (props: ComponentProps<'svg'>) => {
  return (
    <svg
      width="33"
      height="33"
      viewBox="0 0 33 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx('stroke-current', props.className)}
      {...props}
    >
      <path
        d="M22.0007 16.625L16.6673 11.2917M16.6673 11.2917L11.334 16.625M16.6673 11.2917V21.9583M30.0007 16.625C30.0007 23.9888 24.0311 29.9583 16.6673 29.9583C9.30352 29.9583 3.33398 23.9888 3.33398 16.625C3.33398 9.2612 9.30352 3.29166 16.6673 3.29166C24.0311 3.29166 30.0007 9.2612 30.0007 16.625Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ArrowUpCircle
