export const list = async ({max}: {max?: number}) => {
  const list = [
    '/images/content/1.png',
    '/images/content/2.png',
    '/images/content/3.png',
    '/images/content/4.png',
    '/images/content/5.png',
    '/images/content/6.png',
    '/images/content/7.png',
    '/images/content/8.png',
    '/images/content/9.png',
    '/images/content/10.png',
    '/images/content/11.png',
    '/images/content/12.png',
    '/images/content/13.png',
    '/images/content/14.png',
    '/images/content/15.png',
    '/images/content/16.png',
    '/images/content/17.png',
    '/images/content/18.png',
    '/images/content/19.png',
    '/images/content/20.png',
  ];

  if (!max) return list;

  return list
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    .slice(0, max);
}
