import { useAuth } from "../context/AuthContext";

import Reveal from "../components/ui/Reveal";

export default function Profile() {
  const { profile } = useAuth();

  return (
    <div>
      {profile && <title>{`${profile.name} - EVENTRIX`}</title>}
      <section>
        <div className="flex border-b-4 border-zinc-900">
          <h2 className="-mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
            <Reveal variant="type">My Profile</Reveal>
          </h2>
        </div>
      </section>
    </div>
  )
}