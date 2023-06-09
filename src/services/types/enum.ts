export enum MarketType {
  OnSale = "OnSale",
  NotForSale = "NotForSale",
}
export enum AttributesMapType {
  String = "string",
  Number = "number",
  Boolean = "boolean",
  Object = "object",
}
export enum Status {
  Active = "active",
  DeActive = "deActive",
}
export enum SalePeriod {
  Week = 604800,
  TwoWeek = 1209600,
  Month = 2592000,
}

export enum SaleType {
  Sale = 1,
  MakeOffer = 2,
}

export enum OfferStatus {
  pending = "pending",
  accepted = "accepted",
  cancelled = "cancelled",
  expired = "expired",
}

export enum HistoryType {
  Mint = "mint",
  Transfer = "transfer",
  CreateSale = "createSale",
  Sale = "sale",
  Burn = "burn",
}

export enum Roles {
  user = "User",
  superAdmin = "Supper Admin",
}

export enum BundleStatus {
  onSale = "onSale",
  sold = "sold",
  expired = "expired",
  cancelled = "cancelled",
}

export enum NotificationStatus {
  Seen = "Seen",
  UnSeen = "UnSeen",
}