import React, { useCallback, useMemo } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { LocalResourceLink } from '../../../components/LocalResourceLink';
import { isPopup as isPopupFn } from '../../../utils';
import { SEARCH_LIMIT } from '../../constants';
import './styles.pcss';

export const Footer = ({
  total,
  showsSummary,
}: {
  total: number;
  showsSummary: boolean;
}) => {
  const isPopup = useMemo(isPopupFn, []);

  const optionsPage = useMemo(() => {
    const page = chrome.runtime.getManifest().options_page;
    if (!page) throw new Error('options_page is defined in manifest.json');
    return chrome.runtime.getURL(page);
  }, []);

  const summaryHtml =
    total > SEARCH_LIMIT
      ? chrome.i18n.getMessage('summaryOfResultOverLimit', [
          total.toLocaleString(),
          SEARCH_LIMIT.toLocaleString(),
        ])
      : chrome.i18n.getMessage('summaryOfResult', total.toLocaleString());

  const nonPopupUrl = useCallback(() => {
    const url = new URL(location.href);
    url.searchParams.delete('popup');
    return url.toString();
  }, []);

  return (
    <div className="footer">
      {showsSummary && (
        <div
          className="summary"
          dangerouslySetInnerHTML={{ __html: summaryHtml }}
        ></div>
      )}
      <div className="icons">
        {isPopup && (
          <>
            <LocalResourceLink href={nonPopupUrl} target="_blank">
              <img
                src={chrome.runtime.getURL('images/open-in-new-tab.png')}
                id="open-in-new-tab"
              />
            </LocalResourceLink>
            <Tooltip anchorId="open-in-new-tab" content="Open in new tab" />
          </>
        )}
        <>
          <LocalResourceLink href={optionsPage} target="_blank">
            <img
              src={chrome.runtime.getURL('images/settings.svg')}
              id="open-options"
            />
          </LocalResourceLink>
          <Tooltip anchorId="open-options" content="Open options" />
        </>
      </div>
    </div>
  );
};
