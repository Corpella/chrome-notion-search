import React, { useMemo } from 'react';
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

  return (
    <div className="footer">
      {showsSummary && (
        <div
          className="summary"
          dangerouslySetInnerHTML={{
            __html:
              total > SEARCH_LIMIT
                ? chrome.i18n.getMessage('summaryOfResultOverLimit', [
                    total.toLocaleString(),
                    SEARCH_LIMIT.toLocaleString(),
                  ])
                : chrome.i18n.getMessage(
                    'summaryOfResult',
                    total.toLocaleString(),
                  ),
          }}
        ></div>
      )}
      <div className="icons">
        {isPopup && (
          <LocalResourceLink
            href={() => {
              const url = new URL(location.href);
              url.searchParams.delete('popup');
              return url.toString();
            }}
            title="Open in a new tab"
            target="_blank"
          >
            <img src={chrome.runtime.getURL('images/open-in-new-tab.png')} />
          </LocalResourceLink>
        )}
        <LocalResourceLink
          href={optionsPage}
          title="Open settings"
          target="_blank"
        >
          <img src={chrome.runtime.getURL('images/settings.svg')} />
        </LocalResourceLink>
      </div>
    </div>
  );
};
