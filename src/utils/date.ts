export function convertTimestampToReadableFormat(timestamp: string): string {
  // Convertir le timestamp en un objet Date
  const date = new Date(timestamp);

  // Obtenir les informations de date
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = months[date.getMonth()]; // Mois en texte (0-11)
  const day = date.getDate(); // Jour du mois

  // Obtenir les heures et les minutes au format 12 heures
  let hours = date.getHours(); // Heure au format 24 heures
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Minutes
  const period = hours >= 12 ? 'PM' : 'AM'; // Déterminer si c'est AM ou PM

  // Convertir l'heure en format 12 heures
  hours = hours % 12 || 12; // Convertit 0 en 12 pour le format 12 heures

  // Formater la chaîne de caractères finale
  return `${month} ${day} at ${hours}:${minutes}${period}`;
}
