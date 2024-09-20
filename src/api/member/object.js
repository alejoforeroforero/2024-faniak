export const parseMember = (data) => {
  return {
    id: data.id || data.member_id || 0,
    name: data.name || "",
    artistic_name: data.artistic_name || "",
    full_name: data.full_name || "",
    picture: data.picture || "",
    default_credits: parseDefaultCredits(data.default_credits || {}),
    email: data.email || "",
    address: data.address || "",
    birthday: data.birthday || "",
    country: data.country || "",
    gender: data.gender || "",
    ipi_cae_number: data.ipi_cae_number || "",
    isni: data.isni || "",
    ipn: data.ipn || "",
    external_memberships: data.external_memberships || {},
    postal_code: data.postal_code || "",
    phone: data.telephone || "",
  }
}

const parseDefaultCredits = (data) => {
  return {
    name: data.name ?? "",
    played: data.played || [],
    wrote: data.wrote || [],
    others: data.others || [],
  }
}