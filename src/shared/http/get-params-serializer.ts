export function getParamsSerializer(params: Record<string, unknown>) {
  // JavaScript automatically converts the value toString()
  return new URLSearchParams(params as Record<string, string>).toString()
}
