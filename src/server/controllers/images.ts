export const list = async ({max}: {max?: number}) => {
  const list = [
    '/images/content/1.jpeg',
    '/images/content/2.jpeg',
    '/images/content/3.jpeg',
    '/images/content/4.jpeg',
    '/images/content/5.jpeg',
    '/images/content/6.jpeg',
    '/images/content/7.jpeg',
    '/images/content/8.jpeg',
  ];

  if (!max) return list;

  return list
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    .slice(0, max);
}
