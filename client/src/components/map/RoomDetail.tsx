"use client"

import { useMapTransactionContext } from "@/context/MapContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RoomDetailProps {
  id: number;
  roomName: string;
  roomImage: string;
  password: string;
  description: string;
  roomLatitude: number;
  roomLongitude: number;
}

export const RoomDetail = ({nowRoom}: any) => {
  const {setIsRoomDetailModal} = useMapTransactionContext();
  const[password, setPassWord] = useState("");
  const router = useRouter();

  const handlePushToRoom = () => {
    if(password === nowRoom.password){
      setIsRoomDetailModal(false)
      router.push(
        `/chat?room=${encodeURIComponent(
          nowRoom.roomName.trim()
        )}&password=${encodeURIComponent(nowRoom.password.trim())}`
      )
    }else{
      alert("パスワードが違います。")
    }

  }
  return (
    <>
      <div className="absolute top-1/2 transform -translate-x-48 -translate-y-1/2 z-50 w-40 m-48">
        <div className="rounded shadow-md w-96 ">
          <div className="flex justify-center min-h-screen ">
        <div className="rounded shadow-md w-96 ">

            <div className="">
              <div className="bg-gray-500 rounded-lg bg-opacity-90 m-10 p-10">
                <p className="text-center text-2xl font-bold mb-5">
                  ルームの詳細
                </p>
                <div className="flex flex-col gap-3">
                  <h2 className="font-bold">集会所名 : {nowRoom.roomName}</h2>
                  <h2 className="font-bold">ルームの説明</h2>
                  <p className="border-2 p-1 rounded-md bg-slate-100">
                    {nowRoom.description}
                  </p>
                  <h2 className="font-bold">ルームパスワード</h2>
                  <input
                    className="rounded-xl text-sm p-2"
                    placeholder="パスワードを入力してください"
                    onChange={(e) => setPassWord(e.target.value)}
                  />
                  <button className="bg-yellow-300 text-black text-xl rounded-2xl p-3" onClick={() => handlePushToRoom()}>
                    入室
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

    </>
  );
};
