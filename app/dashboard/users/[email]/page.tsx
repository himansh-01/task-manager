import { Suspense } from 'react';
import UserDetailClient from './UserDetails';

// Main page component must be async for App Router
export default async function UserDetailPage({ 
  params 
}: { 
  params: { email: string } 
}) {
  // Extract the email from params
  const email = params.email;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserDetailClient email={email} />
    </Suspense>
  );
}