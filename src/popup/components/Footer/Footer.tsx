import React, { useCallback, useMemo } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { LocalResourceLink } from '../../../components/LocalResourceLink';
import { isPopup as isPopupFn } from '../../../utils';
import './styles.pcss';

export const Footer = ({
  total,
  countPerPage,
  showsSummary,
}: {
  total: number;
  countPerPage: number;
  showsSummary: boolean;
}) => {
  const isPopup = useMemo(isPopupFn, []);

  const optionsPage = useMemo(() => {
    const page = chrome.runtime.getManifest().options_page;
    if (!page) throw new Error('options_page is defined in manifest.json');
    return chrome.runtime.getURL(page);
  }, []);

  const summaryHtml =
    total > countPerPage
      ? chrome.i18n.getMessage('summaryOfResultOverLimit', [
          total.toLocaleString(),
          countPerPage.toLocaleString(),
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
            {/* TODO: Fix me if popup=true become deprecated */}
            <LocalResourceLink href={nonPopupUrl} target="_blank">
              <img
                src={chrome.runtime.getURL('images/open-in-new-tab.png')}
                data-tooltip-id="open-in-new-tab"
              />
            </LocalResourceLink>
            <Tooltip id="open-in-new-tab" content="Open in new tab" />
          </>
        )}
        <>
          <a href={optionsPage} target="_blank" rel="noreferrer">
            <img
              src={chrome.runtime.getURL('images/settings.svg')}
              data-tooltip-id="open-options"
            />
          </a>
          <Tooltip id="open-options" content="Open options" />
        </>
      </div>
    </div>
  );
};
