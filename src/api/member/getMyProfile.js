import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import { isBusinessTier, subscriptionTiers } from '../../dictionary/user'
import axios from 'axios'

export async function getMyProfile() {
  const url = urls.getMyProfile()

  return await axios.get(url)
    .then(res => {
      printResponse("getMyProfile", res)
      const { status, data } = res.data

      switch (status) {
        case "SUCCESS": return processSuccess(data)
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}

const processSuccess = ({ user, businesses, employees }) => {
  return {
    user: {
      id: user.id,
      name: user.name || "",
      picture: user.picture || "",
      email: user.email || "",
      phone: user.telephone || "",

      is_beta_tester: user.is_beta_tester || false,
      onboarding_step: user.onboarding_step ?? -1,
      my_services: user.my_services_separated_by_coma
        ? user.my_services_separated_by_coma.split(',')
        : [],

      google_folder_id: user.google_folder_id || "",
      google_root_folder_id: user.google_root_folder_id || "",
      google_changes_token: user.google_changes_token || "",

      is_business: isBusinessTier(user.subscription_tier),
      business_name: user.business_name || "",
      business_picture: user.business_picture || "",
      business_domain: user.business_domain || "",

      // subscription_tier: subscriptionTiers.CREATOR,
      has_paid_plan: user.has_paid_plan,
      subscription_tier: user.subscription_tier || subscriptionTiers.ROOKIE,
      subscription_payed: user.subscription_payed || false,
      subscription_quantity: user.subscription_quantity || 0,
      subscription_trial_used: user.subscription_trial_used || false,
      subscription_trial_active: user.subscription_trial_active || false,
      current_smart_folders: user.current_smart_folders || 0,
      max_smart_folders: user.max_smart_folders || 0,

      is_free_trial_active: user.is_free_trial_active,
      is_free_trial_expired: user.is_free_trial_expired,
      free_trial_ends_at: user.free_trial_ends_at,
    },
    businesses: businesses ?? [],
    employees: employees ?? [],
  }
}