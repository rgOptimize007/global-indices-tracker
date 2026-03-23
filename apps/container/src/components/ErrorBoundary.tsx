import { Component, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  title: string;
  description: string;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Remote module failed to render.', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <article className="remote-card remote-card--fallback" role="alert">
          <p className="eyebrow">Remote error</p>
          <h3>{this.props.title}</h3>
          <p>{this.props.description}</p>
        </article>
      );
    }

    return this.props.children;
  }
}
