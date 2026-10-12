import { useSyncExternalStore } from 'react'

/**
 * What Kween is currently saying and feeling, shared between the roaming
 * mascot and whichever section is driving her (the demo, mostly). A tiny
 * external store, same idea as src/mascot/store.ts in the app. It also keeps
 * the plushes' fur colours (the gang section lets you pick them) and tells
 * listeners when Kween is tapped.
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
/** A passing reaction (a friend walks by, the hanger lands on her): said wherever she is, then back to what she was saying. */
export function kweenReact(line, mood = 'happy', ms = 2200) {
  const before = state
  state = { line, mood, talking: true, at: Date.now(), perch: null, react: true }
  emit()
  setTimeout(() => { if (state.line === line && state.react) { state = { ...before, talking: false, at: Date.now() }; emit() } }, ms)
}
export function kweenMood(mood, talking = state.talking) { state = { ...state, mood, talking }; emit() }
export function kweenState() { return state }
export function useKween() {
  return useSyncExternalStore(l => { listeners.add(l); return () => listeners.delete(l) }, () => state, () => state)
}

// ── the plushes' fur colours (the app's defaults) ──
let looks = { kween: 'blush', teddy: 'cream', plain: 'mint' }
const lookListeners = new Set()
export function setLook(persona, color) { looks = { ...looks, [persona]: color }; lookListeners.forEach(l => l()) }
export function useLooks() {
  return useSyncExternalStore(l => { lookListeners.add(l); return () => lookListeners.delete(l) }, () => looks, () => looks)
}

// ── taps on the roaming Kween, for sections that play with her ──
const tapListeners = new Set()
export function onKweenTap(fn) { tapListeners.add(fn); return () => tapListeners.delete(fn) }
export function kweenTapped() { tapListeners.forEach(l => l()) }
