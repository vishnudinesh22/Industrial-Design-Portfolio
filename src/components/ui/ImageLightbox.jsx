import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export default function ImageLightbox({ image, onClose }) {
  const dialogRef = useRef(null);
  const stageRef = useRef(null);
  const dragRef = useRef(null);
  const previousCanvas = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [failed, setFailed] = useState(false);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    dialog.querySelector('[aria-label="Close image viewer"]').focus();
    document.body.style.overflow = 'hidden';
    const resize = new ResizeObserver(() => {
      setViewport({ width: stageRef.current.clientWidth, height: stageRef.current.clientHeight });
    });
    resize.observe(stageRef.current);
    return () => {
      resize.disconnect();
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      image.opener?.focus({ preventScroll: true });
    };
  }, [image.opener]);

  const fit = naturalSize.width ? Math.min((viewport.width - 40) / naturalSize.width, (viewport.height - 40) / naturalSize.height, 1) : 0;
  const width = Math.max(0, naturalSize.width * fit * zoom);
  const height = Math.max(0, naturalSize.height * fit * zoom);
  const changeZoom = direction => setZoom(value => Math.min(5, Math.max(1, value + direction * .5)));
  useEffect(() => {
    const stage = stageRef.current;
    function wheel(event) {
      if (!event.ctrlKey) return;
      event.preventDefault();
      setZoom(value => Math.min(5, Math.max(1, value + (event.deltaY < 0 ? .5 : -.5))));
    }
    stage.addEventListener('wheel', wheel, { passive: false });
    return () => stage.removeEventListener('wheel', wheel);
  }, []);
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const canvas = { width: Math.max(viewport.width, width + 40), height: Math.max(viewport.height, height + 40) };
    const previous = previousCanvas.current;
    if (previous && zoom > 1) {
      stage.scrollLeft = (stage.scrollLeft + viewport.width / 2) / previous.width * canvas.width - viewport.width / 2;
      stage.scrollTop = (stage.scrollTop + viewport.height / 2) / previous.height * canvas.height - viewport.height / 2;
    }
    previousCanvas.current = canvas;
  }, [width, height, viewport, zoom]);
  const reset = () => {
    setZoom(1);
    stageRef.current.scrollTo({ top: 0, left: 0 });
  };

  function startDrag(event) {
    if (zoom <= 1 || event.pointerType === 'touch') return;
    const stage = stageRef.current;
    dragRef.current = { x: event.clientX, y: event.clientY, left: stage.scrollLeft, top: stage.scrollTop };
    stage.setPointerCapture(event.pointerId);
    event.preventDefault();
  }
  function moveDrag(event) {
    const drag = dragRef.current;
    if (!drag) return;
    stageRef.current.scrollLeft = drag.left + drag.x - event.clientX;
    stageRef.current.scrollTop = drag.top + drag.y - event.clientY;
  }
  function keyboard(event) {
    if (event.key === '+' || event.key === '=') { event.preventDefault(); changeZoom(1); }
    if (event.key === '-') { event.preventDefault(); changeZoom(-1); }
    if (event.key === '0') reset();
  }

  return (
    <dialog ref={dialogRef} className="image-viewer" aria-labelledby="image-viewer-title" onCancel={onClose} onKeyDown={keyboard}
      onClick={event => { if (event.target === dialogRef.current) { const bounds = event.target.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose(); } }}>
      <div className="image-viewer-toolbar">
        <h2 id="image-viewer-title">{image.label}</h2>
        <div className="image-viewer-controls">
          <button type="button" aria-label="Zoom out" disabled={zoom <= 1} onClick={() => changeZoom(-1)}>−</button>
          <output aria-live="polite">{Math.round(zoom * 100)}%</output>
          <button type="button" aria-label="Zoom in" disabled={zoom >= 5} onClick={() => changeZoom(1)}>+</button>
          <button type="button" onClick={reset}>Fit</button>
          <button type="button" aria-label="Close image viewer" autoFocus onClick={onClose}>✕</button>
        </div>
      </div>
      <div ref={stageRef} className={'image-viewer-stage ' + (zoom > 1 ? 'is-zoomed' : '')} tabIndex={0} aria-label="Image area. Scroll to pan when zoomed."
        onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={() => { dragRef.current = null; }} onPointerCancel={() => { dragRef.current = null; }}>
        <div className="image-viewer-canvas" style={{ width: Math.max(viewport.width, width + 40), height: Math.max(viewport.height, height + 40) }}>
          {failed ? <p role="alert">Unable to load image.</p> : <img src={image.src} alt={image.label} style={{ width, height }} onLoad={event => setNaturalSize({ width: event.target.naturalWidth, height: event.target.naturalHeight })} onError={() => setFailed(true)} />}
        </div>
      </div>
      <p className="image-viewer-help">Zoom with + / − · Scroll or drag to explore · Escape to close</p>
    </dialog>
  );
}
