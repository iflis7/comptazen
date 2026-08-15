// Central place to register GSAP plugins so every consumer shares one
// registration instead of each animation component calling
// gsap.registerPlugin() redundantly. Only imported from "use client"
// components; registerPlugin() itself doesn't touch the DOM (it just
// registers the plugin object), so it's safe to evaluate during SSR —
// actual DOM/scroll work only happens once a component's effect runs
// client-side and creates a ScrollTrigger instance.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
