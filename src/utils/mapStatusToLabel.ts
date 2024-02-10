export type Status = 'commented' | 'paid' | 'not-paid' | 'no-offers'

export const mapStatusToLabel = (status: Status) => {
  switch(status) {
    case 'commented':
      return 'Podbite';
    case 'paid':
      return 'Opłacone';
    case 'not-paid':
      return 'Nie opłacone';
    case 'no-offers':
      return 'Bez ofert';
  }
}

export const stringToStatusArray = (text: string) => {
  const array = text.split(',');
  return array.filter(item => {
    if(['commented', 'paid', 'no-offers', 'not-paid'].includes(item)) {
      return true;
    }
    return false;
  }) as Status[];
}