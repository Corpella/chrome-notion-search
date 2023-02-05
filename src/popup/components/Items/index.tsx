import React from 'react';
import Item from '../Item';
import './styles.pcss';

export const Items = ({
  isPopup,
  query,
  items,
}: {
  isPopup: boolean;
  query: string;
  items: Item[];
}) => {
  const result =
    items.length > 0 ? (
      items.map((item) => (
        <Item
          key={item.block.id}
          isPopup={isPopup}
          query={query}
          {...item}
        ></Item>
      ))
    ) : (
      <p className="no-results">No results</p>
    );

  return <div className="items">{result}</div>;
};
