import UserDetailClient from './UserDetails';

export default async function UserDetailPage({
  params,
}: {
  params: { email: string };
}) {
  await new Promise(resolve => setTimeout(resolve, 0));
  const email = params.email;
  
  return (
    <div>
      <UserDetailClient email={email} />
    </div>
  );
}