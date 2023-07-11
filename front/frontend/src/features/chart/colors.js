export function getColors(ctx) {
  let colors = [];

  let dark_blue = ctx.createLinearGradient(0, 0, 0, 450);
  dark_blue.addColorStop(0, 'rgba(1,42,94,0.6)');
  dark_blue.addColorStop(0.2, 'rgba(1,42,94,0.4)');
  dark_blue.addColorStop(0.7, 'rgba(1,42,94,0)');

  let orange = ctx.createLinearGradient(0, 0, 0, 450);
  orange.addColorStop(0, 'rgba(37,153,190, 0.6)');
  orange.addColorStop(0.2, 'rgba(37,153,190, 0.4)');
  orange.addColorStop(0.7, 'rgba(37,153,190, 0)');

  let red = ctx.createLinearGradient(0, 0, 0, 450);
  red.addColorStop(0, 'rgba(218,100,94, 0.6)');
  red.addColorStop(0.2, 'rgba(218,100,94, 0.4)');
  red.addColorStop(0.7, 'rgba(218,100,94, 0)');

  colors.push([dark_blue, 'rgb(1,42,94)']);
  colors.push([orange, 'rgb(37,153,190)']);
  colors.push([red, 'rgb(218,100,94)']);
  return colors;
}
