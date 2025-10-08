import { supabase } from './client'

export const loginWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: '/auth',
    },
  })

  if (error) {
    console.error('Error logging in with Google:', error)
    throw error
  }

  // Redirect to the auth page to ensure the URL is updated correctly
  window.location.href = '/auth';
}

export const logout = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error logging out:', error)
    throw error
  }

  // Redirect to the auth page to ensure the URL is updated correctly
  window.location.href = '/auth';
}
