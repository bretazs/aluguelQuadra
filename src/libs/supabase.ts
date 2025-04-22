import { AppState } from 'react-native'
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import { anonKey, supaUrl, files } from '../global/supabase'
import * as SecureStore from 'expo-secure-store'


const supabaseUrl = supaUrl
const supabaseAnonKey = anonKey


const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key)
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value)
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key)
  },
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})


AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})
