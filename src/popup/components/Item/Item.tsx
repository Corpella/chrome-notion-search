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

  let dirElements: React.ReactNode | undefined = undefined;
  if (dirs.length > 0) {
    const filteredDirs = dirs.filter((dir) => {
      // https://github.com/Cside/chrome-notion-search/issues/36
      if (dir.record === undefined) {
        console.error(`dir.record is undefined in Item component`, {
          dir: JSON.stringify(dir),
        });
        return false;
      }
      return true;
    });
    if (filteredDirs.length > 0) {
      dirElements = filteredDirs
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
        .reduce((prev, current) => [prev, ' / ', current]);
    }
  }

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
            {dirElements && <p className="dirs">{dirElements}</p>}
            {text !== undefined && (
              <p className="text">{setHighlight(text, query)}</p>
            )}
          </div>
        </div>
      </a>
    </div>
  );
}
