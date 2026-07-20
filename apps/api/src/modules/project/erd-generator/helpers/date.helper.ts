/** Format bulan saat ini sebagai "YYYY-MM" (sesuai unique key usage). */
export function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}
