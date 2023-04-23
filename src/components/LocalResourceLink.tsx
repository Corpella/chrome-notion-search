import React, { ReactNode } from 'react';
import { handleClickLocalResource } from '../utils';

export const LocalResourceLink = ({
  href,
  target,
  children,
}: {
  href: string;
  target?: '_blank';
  children: ReactNode;
}) => {
  return (
    <a
      href="#"
      title="title"
      onClick={(event) => {
        return handleClickLocalResource({
          url: href,
          event,
          ...(target ? { target } : {}),
        });
      }}
    >
      {children}
    </a>
  );
};
