import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import {
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// Bridges GSAP and Remotion: the timeline is built once (paused), and every
// Remotion frame seeks it to the matching timestamp so renders stay
// deterministic. Selectors used inside the factory are scoped to the
// returned ref via gsap.context.
export const useGsapTimeline = <T extends HTMLElement>(
  timelineFactory: () => gsap.core.Timeline
) => {
  const scopeRef = useRef<T>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [handle] = useState(() => delayRender('Building GSAP timeline'));
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = timelineFactory();
      tl.pause();
      timelineRef.current = tl;
      continueRender(handle);
    }, scopeRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    timelineRef.current?.seek(frame / fps, false);
  }, [frame, fps]);

  return scopeRef;
};
