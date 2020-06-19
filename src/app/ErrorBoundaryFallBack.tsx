import React from 'react'

interface Props {
  componentStack?: string
  error?: Error
}

const ErrorBoundaryFallback: React.FC<Props> = ({ componentStack, error }) => (
  <div>
    <p>
      <strong>Oops! An error occured!</strong>
    </p>
    <p>Here’s what we know…</p>
    <p>
      <strong>Error:</strong> {error!.toString()}
    </p>
    <p>
      <strong>Stacktrace:</strong> {componentStack}
    </p>
  </div>
)

export default ErrorBoundaryFallback
