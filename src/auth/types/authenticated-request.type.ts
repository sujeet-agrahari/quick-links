import { Auth } from '../auth.entity';

export type AuthenticatedRequest = Request & { user: Auth };
