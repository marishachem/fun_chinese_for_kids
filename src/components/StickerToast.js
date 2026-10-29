import React, { useEffect } from 'react';

export default function StickerToast({ sticker, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="sticker-toast" onClick={onDone}>
      <img src={sticker} alt="New sticker!" className="sticker-toast-img" />
      <div className="sticker-toast-text">
        <div className="sticker-toast-title">🎉 New Sticker!</div>
        <div className="sticker-toast-sub">Keep writing to earn more</div>
      </div>
    </div>
  );
}
