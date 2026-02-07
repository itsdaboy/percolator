// ABI
export {
  encU8,
  encU16,
  encU32,
  encU64,
  encI64,
  encU128,
  encI128,
  encPubkey,
  encBool,
} from "./abi/encode";

export {
  IX_TAG,
  encodeInitUser,
  encodeDepositCollateral,
  encodeWithdrawCollateral,
  encodeKeeperCrank,
  encodeTradeCpi,
  encodeTradeNoCpi,
  encodeCloseAccount,
  encodeLiquidateAtOracle,
  encodeTopUpInsurance,
} from "./abi/instructions";
export type {
  InitUserArgs,
  DepositCollateralArgs,
  WithdrawCollateralArgs,
  KeeperCrankArgs,
  TradeCpiArgs,
  TradeNoCpiArgs,
  CloseAccountArgs,
  LiquidateAtOracleArgs,
  TopUpInsuranceArgs,
} from "./abi/instructions";

export {
  ACCOUNTS_INIT_USER,
  ACCOUNTS_DEPOSIT_COLLATERAL,
  ACCOUNTS_WITHDRAW_COLLATERAL,
  ACCOUNTS_KEEPER_CRANK,
  ACCOUNTS_TRADE_CPI,
  ACCOUNTS_TRADE_NOCPI,
  ACCOUNTS_CLOSE_ACCOUNT,
  ACCOUNTS_LIQUIDATE_AT_ORACLE,
  ACCOUNTS_TOPUP_INSURANCE,
  buildAccountMetas,
  WELL_KNOWN,
} from "./abi/accounts";
export type { AccountSpec } from "./abi/accounts";

export {
  PERCOLATOR_ERRORS,
  decodeError,
  getErrorName,
  getErrorHint,
  parseErrorFromLogs,
} from "./abi/errors";

// Solana
export {
  fetchSlab,
  parseHeader,
  parseConfig,
  parseParams,
  parseEngine,
  parseAccount,
  parseAllAccounts,
  parseUsedIndices,
  isAccountUsed,
  maxAccountIndex,
  readNonce,
  readLastThrUpdateSlot,
  AccountKind,
} from "./solana/slab";
export type {
  SlabHeader,
  MarketConfig,
  EngineState,
  RiskParams,
  Account,
  InsuranceFund,
} from "./solana/slab";

export { deriveVaultAuthority, deriveLpPda } from "./solana/pda";
export { getAta, fetchTokenAccount } from "./solana/ata";

// Validation
export {
  ValidationError,
  validatePublicKey,
  validateIndex,
  validateAmount,
  validateU128,
  validateI64,
  validateI128,
  validateU64,
  validateU16,
  validateBps,
} from "./validation";

// Math
export {
  computeUnrealizedPnl,
  computeEffectiveCapital,
  computeMarginRatio,
  computeNotional,
  computeLeverage,
  computeLiquidationPrice,
} from "./math";

// Types
export type {
  MarketState,
  MarketAddresses,
  PositionView,
  OracleData,
} from "./types";
