"use client";
import ActionCards from "@/components/action-cards";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import moment from "moment";
import { formTypes } from "@/type";

function Dashboard() {
  const router = useRouter();

  const { fullName, signOut, profile } = useUser();

  console.log(profile);

  return (
    <div className="flex flex-col w-full justify-center items-center  gap-4 p-4 md:gap-6 md:p-10">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="w-full flex  justify-between items-center">
          <div>
            <h3 className="font-semibold text-base lg:text-lg font-poppins">
              HI, {fullName}
            </h3>
            <p className="text-black lg:mt-1 text-sm opacity-70">
              {moment(moment.now()).format("ll")}
            </p>
          </div>

          <Button onClick={signOut} variant="ghost" className="bg-card">
            Logout
            <LogOut />
          </Button>
        </div>
      </div>
      {profile?.category && (
        <ActionCards type={profile?.category as formTypes} />
      )}
      {/* <LagossMap /> */}
      {/* Add a beautiful google map of lagos with tgoogle map with information about the lagos ste lovernment Produce for Lagos Progrem */}
    </div>
  );
}

export default Dashboard;
