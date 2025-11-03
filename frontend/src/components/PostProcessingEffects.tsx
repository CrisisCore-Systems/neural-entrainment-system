import React from 'react';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

const PostProcessingEffects: React.FC = () => {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.2}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        height={300}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.001, 0.001] as [number, number]}
      />
    </EffectComposer>
  );
};

export default PostProcessingEffects;
