import { defineConfig } from "vite"

export default defineConfig({
	base: "/merge-game",
	server: {
		hmr: {
			overlay: false
		}
	}
})

