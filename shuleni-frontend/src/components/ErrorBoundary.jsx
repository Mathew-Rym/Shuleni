import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="mt-5">
          <Alert variant="danger" className="text-center">
            <Alert.Heading>Oops! Something went wrong</Alert.Heading>
            <p>
              We&apos;re sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <hr />
            <div className="d-flex justify-content-center gap-3">
              <Button 
                variant="outline-danger" 
                onClick={this.handleReload}
              >
                Refresh Page
              </Button>
              <Button 
                variant="danger" 
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </Button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-3 text-start">
                <summary>Error Details (Development Mode)</summary>
                <pre className="mt-2 p-3 bg-light border rounded">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
