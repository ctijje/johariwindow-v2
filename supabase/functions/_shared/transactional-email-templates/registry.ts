/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as newClaimAdmin } from './new-claim-admin.tsx'
import { template as claimApprovedUser } from './claim-approved-user.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'new-claim-admin': newClaimAdmin,
  'claim-approved-user': claimApprovedUser,
}