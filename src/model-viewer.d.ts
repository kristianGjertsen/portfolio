import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type ModelViewerElementProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  src?: string
  alt?: string
  ar?: boolean
  'auto-rotate'?: boolean
  'camera-controls'?: boolean
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerElementProps
    }
  }
}
