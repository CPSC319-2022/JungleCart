export const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = `${timeInSeconds % 60}`.padStart(2, '0');
  return `${minutes}:${seconds}`;
};
