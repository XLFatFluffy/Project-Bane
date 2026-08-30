const STORAGE_KEY = 'project-bane.state.v1';
const SCHEMA_VERSION = 2;
export const DEFAULT_STATE = Object.freeze({schemaVersion:SCHEMA_VERSION,view:'dashboard',program:null,nutrition:[],foodLibrary:[],sessions:{},weights:[],sources:{},settings:{programStart:'',goalWeight:250,activeBlock:'Block 1'}});
const clone=v=>JSON.parse(JSON.stringify(v));
export function normalizeState(raw={}){const b=clone(DEFAULT_STATE),s=raw&&typeof raw==='object'?raw:{};return {...b,...s,schemaVersion:SCHEMA_VERSION,settings:{...b.settings,...(s.settings||{})},nutrition:Array.isArray(s.nutrition)?s.nutrition:[],foodLibrary:Array.isArray(s.foodLibrary)?s.foodLibrary:[],weights:Array.isArray(s.weights)?s.weights:[],sessions:s.sessions&&typeof s.sessions==='object'?s.sessions:{},sources:s.sources&&typeof s.sources==='object'?s.sources:{}}}
export function loadState(){try{const raw=localStorage.getItem(STORAGE_KEY);return raw?normalizeState(JSON.parse(raw)):normalizeState()}catch(e){console.error('Bane local data could not be read',e);return normalizeState()}}
export function saveState(state){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(normalizeState(state)));return true}catch(e){console.error('Bane local data could not be saved',e);return false}}
export function makeBackup(state){return JSON.stringify({app:'Project Bane',backupVersion:2,exportedAt:new Date().toISOString(),state:normalizeState(state)},null,2)}
export function parseBackup(text){const p=JSON.parse(text);if(!p||p.app!=='Project Bane'||!p.state)throw new Error('This file is not a valid Project Bane backup.');return normalizeState(p.state)}
export const snapshot=clone;
export {STORAGE_KEY};