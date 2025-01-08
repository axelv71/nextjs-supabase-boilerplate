'use server';

import { Enums } from '@/types/database.types';
import { createClient } from '@/lib/supabase/server';

export async function setProposalsStatus(
  proposalCodes: string[],
  organizationId: string,
  status: Enums<'proposal_status'>,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('proposals')
    .update({ status })
    .in('code', proposalCodes)
    .eq('organization_id', organizationId);

  if (error) {
    console.error(error);
    throw new Error('Error updating proposal status');
  }
}

export async function deleteProposals(
  proposalCodes: string[],
  organizationId: string,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('proposals')
    .update({ is_deleted: true })
    .in('code', proposalCodes)
    .eq('organization_id', organizationId);

  if (error) {
    console.error(error);
    throw new Error('Error deleting proposal');
  }
}
