import SettingsPage from '~/components/shared/SettingsPage';
import { requireRole } from '~/lib/auth';

export function meta() {
  return [{ title: 'GalaCash | Settings' }];
}

export async function clientLoader() {
  await requireRole('bendahara');
  return null;
}

clientLoader.hydrate = true;

export default function Settings() {
  return <SettingsPage />;
}
