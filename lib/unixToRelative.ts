  // Create human readable string (years, months, days, hours, minutes, seconds)
export default function unixToRelative(millis: number): string {
  const years = Math.floor(millis / (1000 * 60 * 60 * 24 * 365))
  const months = Math.floor((millis % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
  const days = Math.floor((millis % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24))
  const hours = Math.floor((millis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((millis % (1000 * 60 * 60)) / (1000 * 60))
  const timeStrings = [
    years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '',
    months > 0 ? `${months} month${months > 1 ? 's' : ''}` : '',
    days > 0 ? `${days} day${days > 1 ? 's' : ''}` : '',
    hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : '',
    minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : '',
  ]
  return timeStrings.filter(str => str != '').join(', ')
}