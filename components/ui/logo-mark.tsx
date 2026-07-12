export type LogoMarkProps = React.SVGAttributes<SVGSVGElement>;

export function LogoMark({ className, ...props }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 115 87"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M101.69 32.7109L13.503 62.7616L0.714844 86.749H87.4268C112.272 85.953 124.063 55.6901 106.742 37.8985L101.69 32.7242V32.7109Z" />
      <path d="M114.242 0H27.5298C2.68468 0.796043 -9.10644 31.059 8.21468 48.8505L13.2661 54.0248L101.454 23.9742L114.242 0Z" />
    </svg>
  );
}
