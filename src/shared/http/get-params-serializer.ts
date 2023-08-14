export function getParamsSerializer(params: Record<string, unknown>) {
  return new URLSearchParams(params as Record<string, string>).toString()
}
