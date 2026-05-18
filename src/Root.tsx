import { Composition } from 'remotion';
import { NorLeadsAd } from './NorLeadsAd';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="NorLeadsAd"
      component={NorLeadsAd}
      durationInFrames={500}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
