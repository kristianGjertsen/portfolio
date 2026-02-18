import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type SplineViewerElementProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  url?: string
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': SplineViewerElementProps
    }
  }
}
