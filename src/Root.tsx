import { Composition } from 'remotion';
import { NorLeadsAd } from './NorLeadsAd';
import { IgnoredAds } from './IgnoredAds';
import { ThumbStopper } from './ThumbStopper';
import { HotelRiviera } from './HotelRiviera';
import { ColumbiAd } from './ColumbiAd';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NorLeadsAd"
        component={NorLeadsAd}
        durationInFrames={500}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="IgnoredAds"
        component={IgnoredAds}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ThumbStopper"
        component={ThumbStopper}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HotelRiviera"
        component={HotelRiviera}
        durationInFrames={1650}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ColumbiAd"
        component={ColumbiAd}
        durationInFrames={620}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
