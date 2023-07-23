export function getColors(ctx, base_color) {
  let color = ctx.createLinearGradient(0, 0, 0, 450);
  color.addColorStop(0, hexToRgba(base_color, 0.4));
  color.addColorStop(0.1, hexToRgba(base_color, 0.2));
  color.addColorStop(0.3, hexToRgba(base_color, 0));
  console.log(base_color);
  return color;
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
