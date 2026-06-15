# Buddy Script

## Stack

- Next.js 16 (app router)
- React 19
- TypeScript
- MongoDB + Mongoose
- Auth is plain JWT in a cookie
- Images go to freeimage.host
- Toasts with react-hot-toast

## Running it

```bash
npm install
npm run dev
```

You need a `.env.local`:

```env
MONGODB_URI=...
JWT_SECRET=...            # any long random string
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FREEIMAGE_API_KEY=...
```

For google login to work you also have to add this redirect URI in the google cloud console:
`http://localhost:3000/api/auth/google/callback`

Then open http://localhost:3000.

## What works

Auth:
- register (first name, last name, email, password), login, logout
- passwords hashed with bcrypt, jwt stored in an httpOnly cookie
- google sign in too (also just sets the same cookie)
- `/feed` is protected — handled in `proxy.ts` (next 16 renamed middleware to proxy)

Feed:
- create posts with text + image
- newest first
- public/private posts (private = only you see it)
- reactions: like / love / wow / sad / angry, on posts, comments and replies
- comments + replies, each can be reacted to
- click the reaction count to see who reacted
- infinite scroll (loads 5 at a time)

## Some decisions

used plain jwt instead of next-auth.
already had the cookie and proxy guard working so i didnt wanted to rip it out.
google login is done by hand so it end up on the same cookie.

reactions is stored as `[{ user, type }]` instead of a likes array.
this way like/unlike still work but you also get the 5 reaction type and can show who reacted.

replies is one level only.
reply to a reply just go in the same thread, same like fb/instagram. kept it simple.

feed use cursor pagination (`_id < cursor`) not skip/limit.
so it dont get slow when there is alot of posts.

image is not uploaded when you pick it, only when you press post.
it get compressed with sharp on the server first then send to freeimage.
post button stay disabled until the preview is loaded.

## Models

nothing fancy, just 3 collections.

- User: firstName, lastName, email, password (optional, google users dont have one), googleId, avatar, provider
- Post: author, text, image, visibility, reactions[]
- Comment: post, author, parent (null = top level), text, reactions[]

## Notes

- old posts made before reactions existed just show 0 reactions, the old likes field is ignored
- the video / event buttons in the composer don't do anything, task only needed image
- there's a 2s fake delay on "load more" so the loading shows up in the demo video, remove it for real use
