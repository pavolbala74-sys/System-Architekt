'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  componentName?: string
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

/**
 * ErrorBoundary — Runtime Error Monitoring
 * Catches render errors, logs them, and displays a graceful fallback.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })

    // Runtime monitoring: log to console (replace with Sentry/Datadog in production)
    console.group(`[ErrorBoundary] ${this.props.componentName ?? 'Unknown'}`)
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
    console.error('Component stack:', errorInfo.componentStack)
    console.groupEnd()

    // In production: send to error monitoring service
    if (process.env.NODE_ENV === 'production') {
      try {
        // Example: window.analytics?.track('render_error', { ... })
        console.info('[Monitoring] Error event would be sent to monitoring service')
      } catch {
        // Silently fail monitoring
      }
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div
          className="p-8 border border-[var(--color-border)] bg-[var(--color-bg-alt)]"
          role="alert"
        >
          <div className="label-engineering mb-2 text-red-500">Component Error</div>
          <p className="text-[13px] font-300 text-[var(--color-text-muted)]">
            {this.props.componentName
              ? `The ${this.props.componentName} component encountered an error.`
              : 'A component encountered an error.'}
            {' '}The rest of the page remains functional.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="mt-4 p-4 bg-red-50 text-red-700 text-[11px] overflow-auto rounded font-mono">
              {this.state.error.message}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * withErrorBoundary — HOC wrapper
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const WithBoundary = (props: P) => (
    <ErrorBoundary componentName={componentName ?? WrappedComponent.displayName}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  )
  WithBoundary.displayName = `withErrorBoundary(${componentName ?? WrappedComponent.displayName})`
  return WithBoundary
}
