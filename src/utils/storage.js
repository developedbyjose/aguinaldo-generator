const STORAGE_PREFIX = 'aguinaldo_claim_';
const SESSION_KEY = 'aguinaldo_session';

/**
 * Generate localStorage key for a given GCash number
 * @param {string} gcash - GCash number (11 digits)
 * @returns {string} localStorage key
 */
export function getClaimKey(gcash) {
  return `${STORAGE_PREFIX}${gcash}`;
}

/**
 * Save a claim to localStorage
 * @param {string} gcash - GCash number
 * @param {Object} claimData - Claim data object
 * @param {string} claimData.name - User's name
 * @param {string} claimData.gcash - GCash number
 * @param {boolean} claimData.isGodchild - Whether user is a godchild
 * @param {number} claimData.cardIndex - Index of selected card (0-5)
 * @param {number} claimData.reward - Reward amount
 * @returns {boolean} True if saved successfully, false otherwise
 */
export function saveClaim(gcash, claimData) {
  try {
    const key = getClaimKey(gcash);
    const data = {
      ...claimData,
      timestamp: Date.now(),
      claimed: true
    };
    localStorage.setItem(key, JSON.stringify(data));
    console.log('Claim saved successfully:', data);
    return true;
  } catch (error) {
    console.error('Failed to save claim:', error);

    // Show warning toast if SweetAlert2 is available
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Save',
        text: 'Your selection could not be saved. You may be in private browsing mode.',
        toast: true,
        position: 'top',
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: 'mobile-toast'
        }
      });
    }

    return false;
  }
}

/**
 * Get a claim from localStorage
 * @param {string} gcash - GCash number
 * @returns {Object|null} Claim data or null if not found
 */
export function getClaim(gcash) {
  try {
    const key = getClaimKey(gcash);
    const data = localStorage.getItem(key);

    if (!data) {
      return null;
    }

    const parsed = JSON.parse(data);

    // Validate structure
    if (!parsed.gcash || !parsed.name || typeof parsed.cardIndex !== 'number') {
      console.warn('Invalid claim data structure, removing corrupted entry');
      localStorage.removeItem(key);
      return null;
    }

    // Validate cardIndex range
    if (parsed.cardIndex < 0 || parsed.cardIndex > 5) {
      console.warn('Invalid cardIndex in claim data, removing corrupted entry');
      localStorage.removeItem(key);
      return null;
    }

    console.log('Found existing claim:', parsed);
    return parsed;
  } catch (error) {
    console.error('Failed to retrieve claim:', error);
    // Remove corrupted data
    const key = getClaimKey(gcash);
    localStorage.removeItem(key);
    return null;
  }
}

/**
 * Check if a user has already claimed
 * @param {string} gcash - GCash number
 * @returns {boolean} True if user has claimed, false otherwise
 */
export function hasClaimed(gcash) {
  const claim = getClaim(gcash);
  return claim !== null && claim.claimed === true;
}

/**
 * Save session data (form submission) to localStorage
 * @param {Object} sessionData - Session data object
 * @param {string} sessionData.name - User's name
 * @param {string} sessionData.gcash - GCash number
 * @param {boolean} sessionData.isGodchild - Whether user is a godchild
 * @returns {boolean} True if saved successfully, false otherwise
 */
export function saveSession(sessionData) {
  try {
    const data = {
      ...sessionData,
      timestamp: Date.now()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
    console.log('Session saved:', data);
    return true;
  } catch (error) {
    console.error('Failed to save session:', error);
    return false;
  }
}

/**
 * Get session data from localStorage
 * @returns {Object|null} Session data or null if not found
 */
export function getSession() {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) {
      return null;
    }

    const parsed = JSON.parse(data);

    // Validate structure
    if (!parsed.name || !parsed.gcash || typeof parsed.isGodchild !== 'boolean') {
      console.warn('Invalid session data, removing');
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    console.log('Found existing session:', parsed);
    return parsed;
  } catch (error) {
    console.error('Failed to retrieve session:', error);
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

/**
 * Clear session data from localStorage
 */
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  console.log('Session cleared');
}
