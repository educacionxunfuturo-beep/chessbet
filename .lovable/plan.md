

## Plan: Upgrade to BSC Mainnet + Major Feature Additions

This is a large request with multiple features. I'll break it into prioritized phases.

---

### Phase 1: Switch to BSC Mainnet

**Changes:**
- `src/lib/contract.ts`: Update `CONTRACT_ADDRESS` to the mainnet address (same: `0x7fEfDf9C86e0E27991f44086942E82CEDbdF8610`). Change `switchToBSC` default to `false` (mainnet). Update all `switchToBSC(true)` calls across the codebase to `switchToBSC(false)`.
- `src/lib/tokens.ts`: Update `getTokenAddress` default to mainnet (`false`).
- `src/hooks/useWallet.ts`, `src/components/CreateGameModal.tsx`: Change all `switchToBSC(true)` to `switchToBSC(false)`.
- Update UI labels from "BSC Testnet" to "BNB Smart Chain".

---

### Phase 2: Time Controls (5, 10, 15, 30, 60 min)

**Changes:**
- `src/components/CreateGameModal.tsx`: Replace time control options with exactly: 5 min, 10 min, 15 min, 30 min, 1 hora.
- `src/pages/Matchmaking.tsx`: Same time controls. Matching requires **exact same** time control + stake + currency.
- Remove increment-based time controls (1+0, 3+0, 15+10). Simplify to flat minutes only.

---

### Phase 3: Improved Chess Board (2D/3D Toggle)

**Changes:**
- `src/components/ChessBoard.tsx`: Add a view toggle (2D/3D). 
  - **2D mode**: Professional wood-textured board using CSS gradients (dark walnut + cream squares matching the uploaded image style). Styled piece fonts with proper shadows.
  - **3D mode**: CSS perspective/transform to create an isometric 3D effect on the board (pure CSS, no WebGL needed). Tilt the board ~30deg with perspective.
- Copy the uploaded chessboard image to `src/assets/` as a reference, but implement the look via CSS (wood colors: `#b58863` light, `#6d4c2e` dark, with wood grain gradients).
- Add rank numbers (1-8) on the left side.

---

### Phase 4: Direct Wallet Payout on Game End

**Changes:**
- Currently the smart contract holds funds in `playerBalances`/`playerTokenBalances` and requires a manual `withdraw()`. The contract's `finishGame()` already credits the winner's internal balance.
- Add an **auto-withdraw trigger** in the frontend: when a game ends and the winner is confirmed, automatically call `withdraw()` or `withdrawToken()` from the contract to send funds directly to the winner's wallet.
- `src/pages/Play.tsx`: After `handleGameEnd`, if the game is a smart contract game, call `withdrawBalance(currency)` automatically.
- Show a toast with the tx hash confirming the payout.

---

### Phase 5: Profile - Total Winnings Display

**Database migration:**
- Add `total_won` column to `profiles` table (numeric, default 0).
- Create a trigger or update logic: when a game finishes with a winner, increment `total_won` by the prize amount.

**Changes:**
- `src/pages/Profile.tsx`: Replace "Depositado" stat with "Total Ganado" showing `profile.total_won`. Only show winnings, not losses.
- `src/contexts/AuthContext.tsx`: Add `total_won` to Profile interface.

---

### Phase 6: Deposit Page (Internal Balance)

The deposit feature already exists via `DepositModal`. The internal balance is stored in Supabase `profiles.balance` / `profiles.balance_usdt`. When a user deposits:
1. They send BNB/USDT to the smart contract via `deposit()` / `depositToken()`.
2. The app updates their profile balance in the database.
3. This balance is auto-used when creating/joining games with "Balance App" payment method.

**Security consideration for holding funds:** The safest approach is the current one -- funds deposited via the smart contract stay in the contract's `playerBalances` mapping (on-chain, trustless). The Supabase balance is just a mirror/tracker. No changes needed here; the architecture is already sound.

---

### Phase 7: Friends System

**Database migration:**
- Create `friendships` table:
  ```sql
  CREATE TABLE public.friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    friend_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, accepted, rejected
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, friend_id)
  );
  ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
  ```
- RLS policies: users can see their own friendships, insert requests, update status on received requests.

- Create `game_invites` table:
  ```sql
  CREATE TABLE public.game_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id UUID REFERENCES public.profiles(id) NOT NULL,
    to_user_id UUID REFERENCES public.profiles(id) NOT NULL,
    game_id UUID REFERENCES public.games(id),
    stake_amount NUMERIC DEFAULT 0,
    currency TEXT DEFAULT 'BNB',
    time_control INTEGER DEFAULT 600,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
  );
  ALTER TABLE public.game_invites ENABLE ROW LEVEL SECURITY;
  ```
- Enable realtime on both tables.

**Frontend:**
- New `src/pages/Friends.tsx`: List friends, search users by display name, send/accept/reject friend requests.
- Add "Invite to Game" button on each friend card, which creates a `game_invite` record.
- Add notification indicator in the header for pending invites/requests.
- Add route `/friends` in `App.tsx`.
- Add friends icon to `BottomNav`.

---

### Summary of File Changes

| Area | Files Modified/Created |
|------|----------------------|
| Mainnet switch | `contract.ts`, `tokens.ts`, `useWallet.ts`, `CreateGameModal.tsx`, `Matchmaking.tsx` |
| Time controls | `CreateGameModal.tsx`, `Matchmaking.tsx` |
| Chess board UI | `ChessBoard.tsx` (major rewrite with 2D/3D toggle) |
| Auto-payout | `Play.tsx`, `useContract.ts` |
| Total winnings | DB migration, `Profile.tsx`, `AuthContext.tsx` |
| Friends system | DB migration (2 tables), new `Friends.tsx`, `App.tsx`, `BottomNav.tsx`, `AppHeader.tsx` |

