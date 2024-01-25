import { auth } from "@/auth"
import { UserInfo } from "@/components/user-info";

import { currentUser } from "@/lib/auth";

const ClientPage = async () => {
  const user = await currentUser();



  return (
    <div>
      <UserInfo 
        label="🖥️ Server Component"
        user={user}
      />
    </div>
  )
}

export default ClientPage