import process from 'process'
import { Buffer } from 'buffer'
import EventEmitter from 'events'

window.process = process
window.global = window
window.Buffer = Buffer
window.EventEmitter = EventEmitter
