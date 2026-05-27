/**
 * BlueprintBg - Faint grid overlay for admin UI
 * Creates a subtle 40px grid pattern as background atmosphere
 */
export function BlueprintBg() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-40"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(100,150,255,0.04) 1px, transparent 1px), ' +
          'linear-gradient(to bottom, rgba(100,150,255,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />
  );
}
