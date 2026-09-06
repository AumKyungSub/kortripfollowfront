export function reviewLink(item) {
  try {
    const url = new URL(item?.review?.link);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

export function reviewBackground(item) {
  const prefix = item?.img?.link;
  const images = prefix ? [`${prefix}Review.jpg`, `${prefix}3R.jpg`] : [];
  images.push('/images/emptyImage.jpg');
  return images.map(path => `url(${JSON.stringify(path)})`).join(', ');
}
