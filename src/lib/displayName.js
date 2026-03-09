/**
 * Returns the display name to show for a profile.
 * Uses nickname/display_name if set, otherwise falls back to first_name.
 * If matched, reveals real name.
 */
export const getDisplayName = (profile, isMatched = false) => {
  if (!profile) return "Anonymous";
  
  if (isMatched && profile.first_name) {
    return `${profile.first_name} ${profile.last_name?.charAt(0) || ""}.`;
  }
  
  if (profile.display_name) {
    return profile.display_name;
  }
  
  return `${profile.first_name || "User"} ${profile.last_name?.charAt(0) || ""}.`;
};

export const getInitials = (profile, isMatched = false) => {
  if (!profile) return "?";
  
  if (isMatched && profile.first_name) {
    return profile.first_name.charAt(0).toUpperCase();
  }
  
  if (profile.display_name) {
    return profile.display_name.charAt(0).toUpperCase();
  }
  
  return profile.first_name?.charAt(0).toUpperCase() || "?";
};
