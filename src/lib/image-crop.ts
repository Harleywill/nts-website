/**
 * Calculate CSS styles for applying a crop to an image
 * Crop values are stored as normalized coordinates (0-1)
 */
export function getCropStyles(
  cropX: number = 0,
  cropY: number = 0,
  cropWidth: number = 1,
  cropHeight: number = 1
): React.CSSProperties {
  // Convert normalized crop coordinates to percentage-based object-position
  // object-position is calculated from the top-left of the visible area
  const posX = (cropX * 100) / cropWidth;
  const posY = (cropY * 100) / cropHeight;

  return {
    objectPosition: `${posX}% ${posY}%`,
  };
}

/**
 * Get object-fit styles that maintain aspect ratio while showing crop
 */
export function getCropContainerStyles(
  cropWidth: number = 1,
  cropHeight: number = 1
): React.CSSProperties {
  return {
    aspectRatio: `${cropWidth} / ${cropHeight}`,
    overflow: 'hidden',
  };
}
