import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div>
          <p>
            <strong>Oops! An error occured!</strong>
          </p>
          <p>Here’s what we know…</p>
          <p>
            <strong>Error:</strong> {this.state.error!.toString()}
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

export default GlobalErrorBoundary
