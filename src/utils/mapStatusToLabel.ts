export type Status = 'commented' | 'paid' | 'not-paid' | 'no-offers' | 'ended' | 'not-collected' | 'archived' | 'to-delete' | 'to-end';

export const mapStatusToLabel = (status: Status) => {
  switch(status) {
    case 'to-end':
      return 'Do zakończenia dzisiaj';
    case 'commented':
      return 'Podbite';
    case 'paid':
      return 'Opłacone';
    case 'not-paid':
      return 'Nieopłacone';
    case 'ended':
      return 'Zakończone';
    case 'no-offers':
      return 'Bez ofert';
    case 'not-collected':
      return 'Nieodebrane';
    case 'to-delete':
      return 'Do usunięcia';
    case 'archived':
      return 'Usunięte';
  }
}

export const stringToStatusArray = (text: string) => {
  const array = text.split(',');
  return array.filter(item => {
    if(['commented', 'paid', 'no-offers', 'not-paid', 'ended', 'not-collected', 'to-delete', 'archived', 'to-end'].includes(item)) {
      return true;
    }
    return false;
  }) as Status[];
}

export const stringToStatus = (text: string) => {
    if(['commented', 'paid', 'no-offers', 'not-paid', 'ended', 'not-collected', 'to-delete', 'archived', 'to-end'].includes(text)) {
      return text as Status;
    }
    return undefined;;
}