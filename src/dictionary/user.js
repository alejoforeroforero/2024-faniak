export const subscriptionTiers = {
  ROOKIE: "ROOKIE_TIER",
  CREATOR: "CREATOR_TIER",
  MANAGER: "MANAGER_TIER",
  STARTER: "STARTER_TIER",
  INDIE: "INDIE_TIER",
  MAJOR: "MAJOR_TIER",
}

const tiers = subscriptionTiers

export const getSubscriptionLabel = (tier) => {
  switch (tier) {
    case tiers.ROOKIE: return "Rookie Plan"
    case tiers.CREATOR: return "Creator Plan"
    case tiers.MANAGER: return "Manager Plan"
    case tiers.STARTER: return "Starter Plan"
    case tiers.INDIE: return "Indie Plan"
    case tiers.MAJOR: return "Major Plan"
    default: return ""
  }
}

export const getPricePerAccount = (tier, monthly) => {
  switch (tier) {
    case tiers.STARTER: return monthly ? 14.99 : 143.90
    case tiers.INDIE: return monthly ? 24.99 : 239.90
    case tiers.MAJOR: return monthly ? 59.99 : 575.90
    default: return 0
  }
}

export const getMaxSmartFolders = (tier) => {
  switch (tier) {
    case tiers.ROOKIE: return 25
    case tiers.CREATOR: return 250
    case tiers.MANAGER: return 1000
    case tiers.STARTER: return 2500
    case tiers.INDIE: return 10000
    case tiers.MAJOR: return -1
    default: return 0
  }
}

export const isBusinessTier = (tier) => {
  return [
    tiers.STARTER,
    tiers.INDIE,
    tiers.MAJOR,
  ].includes(tier)
}