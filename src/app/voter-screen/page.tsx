import React from 'react';
import AppLayout from '@/components/AppLayout';
import VoterScreenClient from './components/VoterScreenClient';
import { verifyToken } from '@/lib/token';

export default function VoterScreenPage({ searchParams }: { searchParams?: { token?: string, token_invalid?: string } }) {
  const token = searchParams?.token as string | undefined;
  const tokenInvalidFlag = !!searchParams?.token_invalid;

  let tokenPayload = null;
  let tokenValid = false;

  if (token) {
    tokenPayload = verifyToken(token);
    tokenValid = !!tokenPayload;
  }

  // If token_invalid query param is set (redirect from short link), treat as invalid
  if (!token && tokenInvalidFlag) {
    tokenValid = false;
  }

  return (
    <AppLayout>
      {/* Pass token info to client so it can enable/disable interactions */}
      <VoterScreenClient token={token} tokenValid={tokenValid} tokenPayload={tokenPayload} />
    </AppLayout>
  );
}
