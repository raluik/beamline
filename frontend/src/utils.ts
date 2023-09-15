import { countries } from './countries';

export function getFlagEmoji(countryName: string) {
  const code = countries.find(country => country.name.toLowerCase() === countryName.toLowerCase())?.['alpha-2'];
  if (!code) return '';
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}