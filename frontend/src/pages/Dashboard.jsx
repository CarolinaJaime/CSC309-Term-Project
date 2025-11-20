import { useAuth } from "../auth/AuthContext";

export default function Dashboard() {
    const user = useAuth().user
  return (
    <div className="mt-8 space-y-4">
      <h1 className="text-3xl font-semibold">Dashboard</h1>

      <div className="bg-white shadow-md p-6 rounded-xl space-y-3">
        <h2 className="text-xl font-medium">Your Profile</h2>

        <div className="text-gray-700">
          <p>
            <span className="font-semibold">UTORid:</span> {user.utorid}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Role:</span>{" "}
            <span className="uppercase">{user.role}</span>
          </p>
        </div>
      </div>
    </div>
  );
}