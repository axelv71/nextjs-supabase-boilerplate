import 'server-only';
import { loops } from '@/lib/loops';

type ContactProperties = Record<string, string | number | boolean | null>;

export async function insertContactIfNotExists(
  email: string,
  properties?: ContactProperties,
  mailingLists?: Record<string, boolean>,
) {
  // Check if the contact exists
  const contacts = await loops.findContact({ email });

  // If the contact does not exist, create it
  if (contacts.length <= 0) {
    const contact = await loops.createContact(email, properties, mailingLists);

    if (!contact.success) {
      console.error('Failed to create contact in Loops', contact.message);
    }
  }
}
