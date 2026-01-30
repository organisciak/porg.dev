// Helper function to wrap text in canvas
export function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let numberOfLines = 1;

  // Adjust the starting y position to be (approximately) the top, not the baseline
  const font = context.font;
  const fontSize = font ? parseInt(font.match(/\d+/)?.[0] ?? "0", 10) : 0;
  const approximateAscent = fontSize * 0.75;
  y += approximateAscent;

  for (const word of words) {
    const testLine = line + word + " ";
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && line !== "") {
      context.fillText(line, x, y);
      line = word + " ";
      y += lineHeight;
      numberOfLines++;
    } else {
      line = testLine;
    }
  }

  context.fillText(line, x, y);

  // Return total height
  return numberOfLines * lineHeight;
}
