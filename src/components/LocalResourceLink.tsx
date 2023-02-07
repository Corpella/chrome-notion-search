import React, { ReactNode } from 'react';
import { handleClickLocalResource } from '../utils';

export const LocalResourceLink = ({
  href,
  target,
  title,
  children,
}: {
  href: string | (() => string);
  target?: '_blank';
  title?: string;
  children: ReactNode;
}) => {
  return (
    <a
      href="#"
      title="title"
      {...(title && { title })}
      onClick={(event) => {
        return handleClickLocalResource({
          url: typeof href === 'function' ? href() : href,
          event,
          ...(target ? { target } : {}),
        });
      }}
    >
      {children}
    </a>
  );
};
