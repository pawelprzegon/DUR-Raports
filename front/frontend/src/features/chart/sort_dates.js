export function sort_dates(labels) {
  const referenceList = [
    'styczeń',
    'luty',
    'marzec',
    'kwiecień',
    'maj',
    'czerwiec',
    'lipiec',
    'sierpień',
    'wrzesień',
    'październik',
    'listopad',
    'grudzień',
  ];

  labels.sort((a, b) => {
    const monthA = a.split(' ')[0];
    const monthB = b.split(' ')[0];

    return referenceList.indexOf(monthA) - referenceList.indexOf(monthB);
  });
  return labels;
}
