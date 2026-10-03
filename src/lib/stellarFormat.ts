export function truncateStellarAddress(value: string, head = 4, tail = 4): string {
  if (value.length <= head + tail + 3) {
    return value;
  }
  return `${value.slice(0, head + 1)}…${value.slice(-tail)}`;
}

export function truncateTransactionHash(hash: string, head = 6, tail = 6): string {
  if (hash.length <= head + tail + 3) {
    return hash;
  }
  return `${hash.slice(0, head)}…${hash.slice(-tail)}`;
}

export async function copyTextToClipboard(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}
