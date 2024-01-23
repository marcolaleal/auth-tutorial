"use Client"

import { useSession } from "next-auth/react";


const SettingsPage =  () => {
  const session =  useSession();

  return (
    <div>
      {JSON.stringify(session)}
      <form>
        <button type="submit">
          Sign Out
        </button>
      </form>
    </div>
  )
}

export default SettingsPage;
