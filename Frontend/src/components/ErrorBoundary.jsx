import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Could send to logging service
    // console.error(error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{height: '100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#111', color:'#fff', padding:20}}>
          <div>
            <h2>Something went wrong</h2>
            <pre style={{whiteSpace:'pre-wrap'}}>{String(this.state.error)}</pre>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
