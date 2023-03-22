import React, { useEffect, useRef } from 'react';
import './styles.pcss';

const INPUT_CLASS_NAME = 'query';

export const SearchBox = ({
  query,
  setQuery,
  workspaceName,
  fromStorage,
  setFromStorage,
}: {
  query: string;
  setQuery: SetQueryParam<string>;
  workspaceName: string;
  fromStorage: boolean;
  setFromStorage: React.Dispatch<React.SetStateAction<boolean>>;
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

  // TODO: rm after refactoring
  useEffect(() => {
    if (fromStorage && inputRef.current) {
      setFromStorage(false);
      inputRef.current.select();
    }
  }, [fromStorage]);

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
