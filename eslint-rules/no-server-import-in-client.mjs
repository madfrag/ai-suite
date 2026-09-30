// Custom architecture-boundary lint rule.
//
// Why this exists: src/lib/supabase/admin.ts holds a Supabase client built
// from SUPABASE_SERVICE_ROLE_KEY — a credential that bypasses Row Level
// Security entirely (see its own file comment). Nothing currently stops a
// 'use client' component from importing it, or the other server-only
// modules this repo names by convention (*.server.ts, *.server-side.ts),
// or Next's own server-only APIs (next/headers). There are zero violations
// today (checked before writing this) — this is a guard rail, not a cleanup.
//
// This is a narrower, static-analysis complement to `server-only` (the npm
// package) — that package throws at build/bundle time if a module tagged
// with it is ever reachable from client code, which is the stronger
// guarantee. This rule catches the same mistake earlier (at edit time, no
// build required) and doesn't depend on every server-only file remembering
// to add the `server-only` import.

const SERVER_ONLY_SOURCE = /(\.server(-side)?)$|\/admin$/;
const SERVER_ONLY_EXACT = new Set(['next/headers']);

function isUseClientDirective(statement) {
  return (
    statement?.type === 'ExpressionStatement' &&
    statement.expression?.type === 'Literal' &&
    statement.expression.value === 'use client'
  );
}

function isServerOnlySource(source) {
  return SERVER_ONLY_EXACT.has(source) || SERVER_ONLY_SOURCE.test(source);
}

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        "Disallow importing server-only modules (*.server.ts, *.server-side.ts, */admin, next/headers) from a 'use client' file.",
    },
    schema: [],
    messages: {
      serverImportInClient:
        "'{{source}}' is server-only (matches this repo's *.server / *.server-side / */admin convention, or is a Next.js server-only API) and can't be imported from a 'use client' file. Pass the data down as a prop from a Server Component, or call it from a Route Handler instead.",
    },
  },
  create(context) {
    let isClientFile = false;

    return {
      Program(node) {
        isClientFile = node.body.length > 0 && isUseClientDirective(node.body[0]);
      },
      ImportDeclaration(node) {
        if (!isClientFile) return;
        const source = node.source.value;
        if (isServerOnlySource(source)) {
          context.report({ node, messageId: 'serverImportInClient', data: { source } });
        }
      },
    };
  },
};

export default rule;
