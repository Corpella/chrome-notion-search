import React, { useEffect, useRef } from 'react';
import './styles.pcss';

const INPUT_CLASS_NAME = 'query';

export const SearchBox = ({
  query,
  setQuery,
  workspaceName,
  hasLastSearchQuery,
}: {
  query: string;
  setQuery: SetQueryParam<string>;
  workspaceName: string;
  hasLastSearchQuery: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.appendChild(
      document.createTextNode(
        `.${INPUT_CLASS_NAME}::-webkit-search-cancel-button {
          background-image: url("${chrome.runtime.getURL(
            'images/clear-query.svg',
          )}");
        }`,
      ),
    );
    document.body.appendChild(style);
  }, []);

  useEffect(() => {
    if (hasLastSearchQuery && inputRef.current) inputRef.current.select();
  }, [hasLastSearchQuery]);

  return (
    <div className="search-box">
      <img
        className="icon-search"
        src={chrome.runtime.getURL('images/search.svg')}
      ></img>
      <input
        ref={inputRef}
        type="search"
        className={INPUT_CLASS_NAME}
        placeholder={chrome.i18n.getMessage('searchPlaceholder', workspaceName)}
        autoFocus
        onChange={(event) => setQuery(event.target.value)}
        onFocus={(event) => event.target.select()}
        value={query}
      />
    </div>
  );
};
