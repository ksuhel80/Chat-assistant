# AI Chat Assistant Rules

## Stack
- Next.js 14 App Router TypeScript
- Tailwind CSS + inline styles for complex layouts
- @supabase/auth-helpers-nextjs (NOT @supabase/ssr)
- Google Gemini Flash (model: gemini-2.0-flash, apiVersion: v1)
- Sonner for toasts
- Lucide React for icons
- date-fns for dates

## Critical Rules
- createClientComponentClient → client components
- createServerComponentClient → server components  
- createRouteHandlerClient → API routes
- Always try/catch with descriptive errors
- Always add loading and error states
- Mobile responsive always
- Use inline styles when Tailwind conflicts
- Streaming: use ReadableStream for chat API
- Never use @supabase/ssr
- Never use import for CommonJS packages, use require()