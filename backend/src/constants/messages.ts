export const MSG = {
  // Auth
  EMAIL_TAKEN: 'Cette adresse email est déjà utilisée.',
  INVALID_CREDENTIALS: 'Email ou mot de passe incorrect.',

  // Users
  USER_NOT_FOUND: 'Utilisateur introuvable.',
  WRONG_PASSWORD: 'Mot de passe actuel incorrect.',

  // Animals
  ANIMAL_NOT_FOUND: 'Animal introuvable.',
  ANIMAL_FORBIDDEN: 'Vous ne pouvez modifier que vos propres animaux.',
  ANIMAL_DELETE_FORBIDDEN: 'Vous ne pouvez supprimer que vos propres animaux.',

  // Sitter profile
  SITTER_PROFILE_NOT_FOUND: 'Profil sitter introuvable.',
  SITTER_PROFILE_EXISTS: 'Un profil sitter existe déjà pour cet utilisateur.',

  // Bookings
  BOOKING_NOT_FOUND: 'Réservation introuvable.',
  BOOKING_DATE_INVALID: 'La date de fin doit être postérieure à la date de début.',

  // Reviews
  REVIEW_BOOKING_NOT_FOUND: 'Réservation introuvable.',
  REVIEW_BOOKING_INVALID_STATUS: 'Vous ne pouvez laisser un avis que pour une réservation confirmée ou terminée.',
  REVIEW_ALREADY_EXISTS: 'Un avis existe déjà pour cette réservation.',
} as const;
