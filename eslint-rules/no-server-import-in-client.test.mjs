import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';
import rule from './no-server-import-in-client.mjs';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('no-server-import-in-client', rule, {
  valid: [
    // No 'use client' directive — a Server Component or plain lib module,
    // where importing these is exactly the intended usage.
    `import { getAdminSupabaseClient } from '@/lib/supabase/admin';`,
    `import { supabaseDb } from '@/lib/db/supabase.server-side';`,
    `import { cookies } from 'next/headers';`,

    // 'use client' file importing ordinary, client-safe modules.
    `'use client';
     import { useState } from 'react';
     import Link from 'next/link';
     import { cn } from '@/lib/utils';`,

    // Similar-looking but not actually server-only — must not false-positive
    // on a substring match of "server" or "admin" that isn't the convention.
    `'use client';
     import { formatServerTimestamp } from '@/lib/format';
     import { AdminBadge } from '@/components/AdminBadge';`,
  ],
  invalid: [
    {
      code: `'use client';
             import { getAdminSupabaseClient } from '@/lib/supabase/admin';`,
      errors: [{ messageId: 'serverImportInClient' }],
    },
    {
      code: `'use client';
             import { supabaseDb } from '@/lib/db/supabase.server-side';`,
      errors: [{ messageId: 'serverImportInClient' }],
    },
    {
      code: `'use client';
             import { chatbotMessagesServer } from '@/lib/chatbot/messages.server';`,
      errors: [{ messageId: 'serverImportInClient' }],
    },
    {
      code: `'use client';
             import { cookies } from 'next/headers';`,
      errors: [{ messageId: 'serverImportInClient' }],
    },
  ],
});
