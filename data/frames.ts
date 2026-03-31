export const frames = Array.from({ length: 192 }, (_, i) => {
  const frame = String(i + 1).padStart(4, "0");
  return `/ani1/frame_${frame}.png`;
});