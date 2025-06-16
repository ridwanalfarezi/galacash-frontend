import type { IconProps } from '.'

const ArrowDownCircle = ({ size = 32, className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 33 33"
      fill="none"
      className={className}
      style={{ width: size, height: size }}
    >
      <path
        d="M11 16.625L16.3333 21.9583M16.3333 21.9583L21.6667 16.625M16.3333 21.9583V11.2917M29.6667 16.625C29.6667 23.9888 23.6971 29.9583 16.3333 29.9583C8.96954 29.9583 3 23.9888 3 16.625C3 9.2612 8.96954 3.29166 16.3333 3.29166C23.6971 3.29166 29.6667 9.2612 29.6667 16.625Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ArrowDownCircle
