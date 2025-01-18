export const RoomDetail = () => {
  return (
    <>
      <div className="flex justify-center bg-gray-100">
        <div className="rounded shadow-md w-96 ">
          <div className="flex p-4 bg-black bg-opacity-80 text-slate-100 justify-between">
            <h1 className="text-2xl font-bold ">MapChat</h1>
          </div>
        </div>
      </div>
      <div className="flex justify-center min-h-screen bg-gray-100">
        <div className="rounded shadow-md w-96 ">
          <div className="bg-gray-800 text-slate-100 min-w-56 bg-opacity-90 px-11  py-24 ">
            <div className="flex flex-col gap-4 mb-4">
              <h1 className="font-bold text-4xl m-1">MapChat</h1>
            </div>
            <div className="bg-gray-500 bg-opacity-40 rounded-lg">
              <div className="">
                <p className="text-center text-2xl p-3 font-bold">
                  ルームの詳細
                </p>
                <div className="flex  flex-col gap-6 p-12 ">
                  <h2 className="font-bold">集会所名 : カオスマッチング</h2>
                  <h2 className="font-bold">アイコンの画像セット</h2>
                  <p className="border-2 p-1 rounded-md">icon icon icon</p>
                  <h2 className="font-bold">ルームの説明</h2>
                  <p className="border-2 p-1 rounded-md">
                    いろんな大学から集まった方々が交流するためのチャットです。
                  </p>
                  <h2 className="font-bold">ルームパスワード</h2>
                  <input
                    className="rounded-xl text-sm p-2"
                    placeholder="パスワードを入力してください"
                  />
                  <button className="bg-yellow-300 text-black text-xl rounded-2xl p-3">
                    入室
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
