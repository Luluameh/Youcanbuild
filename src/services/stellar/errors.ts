export type StellarErrorCode =
  | "wallet-unavailable"
  | "wallet-rejected"
  | "wrong-network"
  | "account-unfunded"
  | "horizon-error"
  | "submission-uncertain"
  | "transaction-failed"
  | "invalid-marker"
  | "not-ready"
  | "already-verified"
  | "not-found"
  | "validation";

export class StellarServiceError extends Error {
  readonly code: StellarErrorCode;
  readonly causeDetail?: string;
  readonly transactionHash?: string;
  readonly publicKey?: string;

  constructor(
    code: StellarErrorCode,
    message: string,
    options?: { causeDetail?: string; transactionHash?: string; publicKey?: string },
  ) {
    super(message);
    this.name = "StellarServiceError";
    this.code = code;
    this.causeDetail = options?.causeDetail;
    this.transactionHash = options?.transactionHash;
    this.publicKey = options?.publicKey;
  }
}

export function isStellarServiceError(error: unknown): error is StellarServiceError {
  return error instanceof StellarServiceError;
}

export function normalizeHorizonError(error: unknown): StellarServiceError {
  if (isStellarServiceError(error)) {
    return error;
  }

  const response = (error as { response?: { data?: Record<string, unknown>; status?: number } })?.response;
  const extras = response?.data?.extras as { result_codes?: unknown } | undefined;
  const detail =
    typeof response?.data?.detail === "string"
      ? response.data.detail
      : extras
        ? JSON.stringify(extras.result_codes)
        : undefined;

  if (response?.status === 404) {
    return new StellarServiceError(
      "account-unfunded",
      "This Stellar testnet account is not funded yet. Fund it with Friendbot, then try again.",
      { causeDetail: detail },
    );
  }

  return new StellarServiceError(
    "horizon-error",
    "Stellar testnet could not complete the request. Your achievement is still saved locally—try again in a moment.",
    { causeDetail: detail },
  );
}

export function userMessageForStellarError(error: StellarServiceError): string {
  return error.message;
}
