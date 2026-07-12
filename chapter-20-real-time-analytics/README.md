# Chapter 20: Real-Time Analytics Dashboard

Ye chapter ek simple short URL system aur uska live analytics dashboard banata hai. Aapko yeh samajhna hai:

- kaise short URL banta hai
- kaise original URL ko Redis cache aur MongoDB se fetch karte hain
- kaise click count track karte hain
- kaise dashboard HTML page se real-time data dikhate hain

## Folder structure

- `src/index.ts` — main server code
- `src/model.ts` — MongoDB schema/URL model
- `src/test/db.ts` — MongoDB connect code
- `src/dashboard.html` — browser dashboard page

## Kaam ka flow (blueprint)

### 1. Short URL generate karna

- Client `POST /user` request bhejta hai.
- Body me `originalUrl` hona chahiye.
- Server `nanoid` se ek random `shortCode` banata hai.
- MongoDB me record save hota hai: `{ originalUrl, shortCode, clickCount: 0 }`.
- Response me short URL bheja jata hai, jaise `http://localhost:3000/abc1234`.

### 2. Short URL use karna

- Jab koi `GET /:shortCode` karta hai, server sabse pehle Redis cache check karta hai.
- Agar cache me original URL milta hai:
  - Redis se direct redirect hota hai
  - `cache:hits` increment hota hai
  - click count Redis aur MongoDB dono me update hota hai
- Agar cache me nahi milta:
  - MongoDB se URL dhundha jata hai
  - agar nahi mila to `Url not found` error aata hai
  - agar mila to Redis me store kar diya jata hai (cache miss gina jata hai)
  - redirect hota hai original URL pe

### 3. Cache-aside logic

- Redis key banate hain `url:<shortCode>`
- Cache hit: key exists, direct use karo
- Cache miss: MongoDB se load karo, phir Redis me store karo
- Redis TTL 3600 seconds set hai (1 ghanta)

### 4. Click tracking

- Har redirect pe do jagah count update hota hai:
  - Redis key `click:<shortCode>`
  - MongoDB field `clickCount`
- Isliye hum real-time click count aur database analytics dono rakhe hain.

### 5. Analytics routes

- `GET /dashboard` — browser ke liye HTML page serve karta hai
- `GET /analytics/overview` — JSON analytics data
- `GET /analytics/link/:shortCode` — ek specific short URL ka detail
- `GET /ttl/:shortCode` — Redis me cache TTL check karta hai

## Route summary

| Route                        | Method | Kya karta hai                       |
| ---------------------------- | ------ | ----------------------------------- |
| `/user`                      | POST   | Naya short URL banata hai           |
| `/:shortCode`                | GET    | Short URL redirect kar deta hai     |
| `/dashboard`                 | GET    | HTML dashboard page serve karta hai |
| `/analytics/overview`        | GET    | Summary analytics JSON deta hai     |
| `/analytics/link/:shortCode` | GET    | Single link analytics deta hai      |
| `/ttl/:shortCode`            | GET    | Cache key ka TTL dekhta hai         |

## Kaise run karein

1. `cd d:\projects\redis-queue\chapter-20-real-time-analytics`
2. `npm install`
3. `npm run dev`
4. Browser me open karo: `http://localhost:3000/dashboard`

## Important files aur unka role

### `src/index.ts`

- Express server banata hai
- Redis aur MongoDB dono connect karta hai
- Routes define karta hai
- Dashboard HTML serve karta hai

### `src/model.ts`

- MongoDB schema define karta hai
- `clickCount` field track karta hai kitni baar short URL access hua

### `src/test/db.ts`

- MongoDB connect code
- local MongoDB URI `mongodb://localhost:27017/akash_redis_db`

### `src/dashboard.html`

- Browser side UI
- Use fetch se `/analytics/overview` data le karta hai
- Har 5 second me refresh kar ke live dikhta hai

## Easy language mein logic

1. Aap `POST /user` se URL save karte ho.
2. Aapko ek chhota code milta hai.
3. Jab koi woh chhota code open kare, server ya to cache se `originalUrl` laayega, ya MongoDB se.
4. Fir user ko woh asli website pe bheja jayega.
5. Saath hi click count aur cache statistics nikalte hain.
6. Dashboard page `GET /dashboard` pe browser me live view ke liye data fetch karta hai.

## Example workflow

1. `POST /user` body:
   ```json
   { "originalUrl": "https://example.com" }
   ```
2. Response:
   ```json
   {
     "success": true,
     "message": "Short url generated successfully",
     "shortUrl": "http://localhost:3000/abc1234"
   }
   ```
3. Browser me `http://localhost:3000/abc1234` kholne se original site open hogi.
4. Dashboard me sab count aur cache stats dikhna shuru ho jayega.

## Notes

- `dashboard.html` direct browser se nahi kholenge. Hamesha `http://localhost:3000/dashboard` se kholna hai.
- Agar `Url not found` aata hai, short code galat hoga ya database me record nahi hoga.
- Agar dashboard khali dikhe, to server aur Redis/DB dono check karo.

---

Yeh README tumko step-by-step blueprint deta hai. Agar chahiye to main isme ek aur section bhi add kar sakta hun: `How to build from scratch` with exact simple code ideas.
