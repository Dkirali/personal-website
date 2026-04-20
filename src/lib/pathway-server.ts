import { cookies } from 'next/headers';
import { PATHWAY_KEY, parsePathway, type Pathway } from './pathway';

export async function readPathwayFromRequest(): Promise<Pathway | null> {
  const store = await cookies();
  return parsePathway(store.get(PATHWAY_KEY)?.value ?? null);
}
