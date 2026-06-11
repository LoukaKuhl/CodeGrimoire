-- Sécurisation multi-utilisateur de la table snippets (Row Level Security)
-- Exécuté dans le SQL Editor de Supabase le 11/06/2026.

-- 1. Colonne de propriétaire, renseignée automatiquement à la création
alter table public.snippets
  add column user_id uuid references auth.users(id) default auth.uid();

-- 2. Activation de la Row Level Security
alter table public.snippets enable row level security;

-- 3. Policies : chaque utilisateur n'accède qu'à ses propres snippets
create policy "Lecture de ses snippets"
  on public.snippets for select
  using (auth.uid() = user_id);

create policy "Insertion de ses snippets"
  on public.snippets for insert
  with check (auth.uid() = user_id);

create policy "Modification de ses snippets"
  on public.snippets for update
  using (auth.uid() = user_id);

create policy "Suppression de ses snippets"
  on public.snippets for delete
  using (auth.uid() = user_id);
