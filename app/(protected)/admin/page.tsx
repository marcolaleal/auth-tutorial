"use client";

import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const AdminPage =  () => {
  const onApiRouteClick = () => {
    fetch("/api/admin")
      .then((response) => {
        if(response.ok){
          console.log("OK");
        } else {
          console.error("FORBIDDEN");
        }
      })
  }


  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          🔑️ Admin
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate
          allowedRole="ADMIN"
        >
          <FormSuccess message="Você tem permissão para acessar este conteúdo!"/>
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">
            Admin-only API route:
          </p>
          <Button onClick={onApiRouteClick}>
            Testar
          </Button>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">
            Admin-only Server Action:
          </p>
          <Button>
            Testar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AdminPage;
