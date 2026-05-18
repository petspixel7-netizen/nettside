import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from 'remotion';

export const HelloWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    fps,
    frame,
    config: { damping: 10, stiffness: 200 },
  });

  const jiggle = Math.sin(frame * 0.4) * 10;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1
        style={{
          fontFamily: 'sans-serif',
          fontSize: 80,
          color: 'black',
          transform: `scale(${scale}) rotate(${jiggle}deg)`,
        }}
      >
        Hello World
      </h1>
    </AbsoluteFill>
  );
};
