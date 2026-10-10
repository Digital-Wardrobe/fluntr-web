import { useSyncExternalStore } from 'react'

/**
 * What Kween is currently saying and feeling, shared between the roaming
 * mascot and whichever section is driving her (the demo, mostly). A tiny
 * external store, same idea as src/mascot/store.ts in the app.
 */
let state = { line: null, mood: 'idle', talking: false, at: 0, perch: null }
const listeners = new Set()
const emit = () => listeners.forEach(l => l())

/**
 * Give her a line to say (and a face to hold while saying it). `perch` scopes
 * it: the roamer only shows a scoped line while standing on that perch, so the
 * demo's commentary does not follow her to the waitlist.
 */
export function kweenSay(line, mood = 'idle', { talkMs = 1100, perch = null } = {}) {
  state = { line, mood, talking: talkMs > 0, at: Date.now(), perch }
  emit()
  if (talkMs > 0) setTimeout(() => { if (state.line === line) { state = { ...state, talking: false }; emit() } }, talkMs)
}
export function kweenMood(mood, talking = state.talking) { state = { ...state, mood, talking }; emit() }
export function kweenState() { return state }
export function useKween() {
  return useSyncExternalStore(l => { listeners.add(l); return () => listeners.delete(l) }, () => state, () => state)
}
