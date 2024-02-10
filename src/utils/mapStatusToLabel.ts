export type Status = 'commented' | 'paid' | 'not-paid' | 'no-offers' | 'ended' | 'not-collected';

export const mapStatusToLabel = (status: Status) => {
  switch(status) {
    case 'commented':
      return 'Podbite';
    case 'paid':
      return 'Opłacone';
    case 'not-paid':
      return 'Nie opłacone';
    case 'ended':
      return 'Zakończone';
    case 'no-offers':
      return 'Bez ofert';
    case 'not-collected':
      return 'Nie odebrane';
  }
}

export const stringToStatusArray = (text: string) => {
  const array = text.split(',');
  return array.filter(item => {
    if(['commented', 'paid', 'no-offers', 'not-paid', 'ended', 'not-collected'].includes(item)) {
      return true;
    }
    return false;
  }) as Status[];
}