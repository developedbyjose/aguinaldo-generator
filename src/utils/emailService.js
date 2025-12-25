import emailjs from '@emailjs/browser'

/**
 * Initialize EmailJS with public key
 */
export function initEmailJS() {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  if (publicKey) {
    emailjs.init(publicKey)
  } else {
    console.error('EmailJS public key not configured')
  }
}

/**
 * Send claim notification email to admin
 * @param {Object} claimData - The claim data
 * @param {string} claimData.name - Claimer's name
 * @param {string} claimData.gcash - GCash number
 * @param {number} claimData.reward - Reward amount
 * @param {boolean} claimData.isGodchild - Whether user is godchild
 * @param {number} claimData.cardIndex - Selected card index
 * @param {number} claimData.timestamp - Claim timestamp
 * @returns {Promise} EmailJS response
 */
export async function sendClaimNotification(claimData) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const recipientEmail = import.meta.env.VITE_RECIPIENT_EMAIL

  // Validate configuration
  if (!serviceId || !templateId) {
    throw new Error('EmailJS not configured. Check environment variables.')
  }

  // Format timestamp to readable date
  const claimDate = new Date(claimData.timestamp).toLocaleString('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Manila'
  })

  // Prepare email template parameters
  const templateParams = {
    to_name: 'Ninong', // Or use your actual name
    to_email: recipientEmail,
    from_name: claimData.name,
    gcash_number: claimData.gcash,
    reward_amount: claimData.reward,
    is_godchild: claimData.isGodchild ? 'Godchild (Inaanak)' : 'Guest',
    card_index: claimData.cardIndex + 1, // Convert 0-based to 1-based
    timestamp: claimDate
  }

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams)
    console.log('Email sent successfully:', response)
    return response
  } catch (error) {
    console.error('Email sending failed:', error)
    throw error
  }
}
