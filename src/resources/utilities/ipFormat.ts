export const ipFormat = (ip: string): string => {
  let ip_format = ip;
  if (ip_format && ip_format.slice(0, 7) === '::ffff:') {
    ip_format = ip_format.slice(7);
  }
  return ip_format;
};
