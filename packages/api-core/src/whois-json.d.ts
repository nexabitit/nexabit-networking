declare module 'whois-json' {
  function whois(query: string): Promise<Record<string, unknown>>;
  export default whois;
}
