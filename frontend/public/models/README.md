# Sacred Geometry Models

Place your GLB models here. Expected filenames (you can change by passing custom urls via props):

- seed-of-life.glb
- flower-of-life.glb
- fibonacci-spiral.glb
- metatrons-cube.glb
- sri-yantra.glb
- merkaba.glb

Recommended:

- Use Draco-compressed glTF (glb) to reduce size.
- Orient models so +Z faces the camera, centered at origin, and sized ~2 units across.
- Keep polycounts modest for 60 FPS.

Notes:

- Components preload these paths at app start.
- If a model is missing or fails to load, the visualization will continue and you may see the procedural fallback (or an error boundary message).
