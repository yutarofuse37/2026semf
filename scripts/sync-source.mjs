import { copyFileSync } from 'node:fs'

copyFileSync(new URL('../slides.md', import.meta.url), new URL('../public/seminar.md', import.meta.url))
