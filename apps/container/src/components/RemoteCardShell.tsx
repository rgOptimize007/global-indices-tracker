import { PropsWithChildren } from 'react';

export function RemoteCardShell({ children }: PropsWithChildren) {
  return <div className="remote-slot">{children}</div>;
}
