export function humanTimeAgo(timestamp: number, short = true) {
  let text: string;

  const now = new Date();

  // Time ago in milliseconds
  const timeAgo: number = now.getTime() - timestamp;

  const seconds = timeAgo / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days / 7;
  const years = weeks / 52;

  if (seconds <= 45) {
    const count = Math.round(seconds);
    const plural = (!short && count > 1 && 's') || '';
    const append = short ? 's' : ' second' + plural;
    text = count + append;
  } else if (minutes <= 50) {
    const count = Math.round(minutes);
    const plural = (!short && count > 1 && 's') || '';
    const append = short ? 'm' : ' minute' + plural;
    text = Math.round(minutes) + append;
  } else if (hours <= 22) {
    const count = Math.round(hours);
    const plural = (!short && count > 1 && 's') || '';
    const append = short ? 'h' : ' hour' + plural;
    text = count + append;
  } else if (days <= 25) {
    const count = Math.round(days);
    const plural = (!short && count > 1 && 's') || '';
    const append = short ? 'd' : ' day' + plural;
    text = count + append;
  } else if (weeks < 52) {
    const count = Math.round(weeks);
    const plural = (!short && count > 1 && 's') || '';
    const append = short ? 'w' : ' week' + plural;
    text = count + append;
  } else {
    const count = Math.round(years);
    const plural = (!short && count > 1 && 's') || '';
    const append = short ? 'y' : ' year' + plural;
    text = count + append;
  }

  return text;
}
