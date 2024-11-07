import { ProfileForm } from "@/components/formUser";

export default async function User({ params }: { params: Promise<{ user: string }> }) {
  const user = (await params).user;
  console.log(user);
  return (
    <div className=" p-4">
      <h1>Usuario</h1>
      <ProfileForm id={user} />
    </div>
  );
}
