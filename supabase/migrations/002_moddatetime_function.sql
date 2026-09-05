-- Create the moddatetime function for automatic updated_at timestamps
create or replace function moddatetime (timestamptz)
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';