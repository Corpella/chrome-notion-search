import React, { useMemo } from 'react';
import { isPopup as isPopupFn } from '../../../utils';
import { ICON_TYPE } from '../../constants';
import './styles.pcss';
import { setHighlight } from './utils';

const getType = (block: SearchApi.Block) =>
  'debug-block-' + block.type.replaceAll('_', '-');

export default function Item({
  query,
  icon,
  title,
  url,
  dirs,
  text,
  block,
}: { query: string } & Item) {
  const iconElement =
    icon.type === ICON_TYPE.EMOJI ? (
      <>{icon.value}</>
    ) : (
      <img
        className={`page-icon ${
          icon.value.match(/^https?:\/\/.+\.svg/) ? 'svg' : ''
        }`}
        src={icon.value}
      />
    );
  const isPopup = useMemo(isPopupFn, []);

  const dirElements = dirs.length > 0 && (
    <p className="dirs">
      {dirs
        .filter((dir) => {
          // https://github.com/Cside/chrome-notion-search/issues/36
          if (dir.record === undefined) {
            console.error(`dir.record is undefined in Item component`);
          }
          return true;
        })
        .map<React.ReactNode>((dir) => (
          <span
            key={dir.record.id}
            className={getType(block)}
            onClick={(event) => {
              console.info(dir.record);
              event.stopPropagation();
            }}
          >
            {dir.title}
          </span>
        ))
        .reduce((prev, current) => [prev, ' / ', current])}
    </p>
  );

  return (
    <div
      className={`item test-item-${block.id} debug-record ${getType(block)}`}
    >
      <a
        className="url"
        {...(isPopup && { target: '_blank' })}
        href={url}
        onClick={() => console.info(block)}
      >
        <div className="page-icon-container">
          <div className="page-icon-wrapper">{iconElement}</div>
        </div>
        <div className="texts-container">
          <div className="texts">
            <p className={`title ${query.trim().length > 0 ? '' : 'no-query'}`}>
              {setHighlight(title, query)}
            </p>
            {dirElements}
            {text !== undefined && (
              <p className="text">{setHighlight(text, query)}</p>
            )}
          </div>
        </div>
      </a>
    </div>
  );
}
