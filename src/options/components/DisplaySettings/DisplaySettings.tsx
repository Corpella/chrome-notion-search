import React, { useEffect, useState } from 'react';
import { storage } from '../../../storage';


type AnchorTarget = '_blank' | 'popup'

export const DisplaySettings = () => {
  const [target, setTarget] = useState<AnchorTarget>()

  useEffect(() => {
    (async () => {
      const target = await storage.get('display')

      setTarget(target || '_blank')
    })();
  });

  const setNewTarget = async (display: AnchorTarget) => {
    await storage.set({ display })
    setTarget(display)
  }

  return (
    <tr>
      <th className="table-secondary">
        Content Display
      </th>
      <td>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="NewTab" id="newtab" value="_blank" checked={target === '_blank'} onChange={(e) => setNewTarget(e.target.value as AnchorTarget)} />
          <label className="form-check-label" htmlFor="newtab">
            New Tab
          </label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="Popup" id="popup" value="popup" checked={target === 'popup'} onChange={(e) => setNewTarget(e.target.value as AnchorTarget)} />
          <label className="form-check-label" htmlFor="popup">
            Popup
          </label>
        </div>
      </td>
    </tr>
  );
};
