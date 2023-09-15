export class UrlUtil {
  static buildUrl(baseUrl: string, path: string, query: Readonly<Record<string, unknown>> = {}): URL {
    const url = new URL(path, baseUrl);
    Object.entries(query).forEach(([key, value]) => url.searchParams.append(key, encodeURIComponent(`${value}`)));
    return url;
  }
}
