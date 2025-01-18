"use client"

import { useMapTransactionContext } from "@/context/MapContext"
import { faLocationPin, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from "react";

export const FirstView = () => {
    const {setIsFirstViewModal} = useMapTransactionContext();
    const [currentStep, setCurrentStep] = useState<number>(1);
    const closeModal = () => {
        setIsFirstViewModal(false)
    }
    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const backStep = () => {
        setCurrentStep(currentStep - 1);
    }

    const submitDatas = () => {
        setIsFirstViewModal(false)
    }

    return (
        <>
        {/* 背景オーバーレイ */}
        <div
            className="fixed inset-0 bg-slate-800 bg-opacity-80"
            onClick={closeModal}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 iphone:w-full iphone:h-full" >
            {currentStep === 1 && (
                <div className="bg-gray-800 text-slate-100 w-full h-full bg-opacity-90 px-10 py-80 iphone:py-40">
                    <div className="flex flex-col gap-4 mb-8">
                    <h1 className="font-bold text-4xl ">MapChat</h1>
                    <p>誰でも簡単に、<br/>近くの人と情報をシェア</p>
                    </div>
                    <div className="bg-gray-500 bg-opacity-40 rounded-lg">
                        <div className="grid grid-cols-2 gap-10 p-10">
                            <div>
                                <button onClick={() => nextStep()}>
                                    <div className="bg-yellow-300 text-black text-4xl rounded-xl p-6 mb-2">
                                        <FontAwesomeIcon icon={faPlus}/>
                                    </div>
                                    <p>ルームを作る</p>
                                </button>
                            </div>
                            <div>
                                <button onClick={() => setIsFirstViewModal(false)}>
                                    <div className="bg-yellow-300 text-black text-4xl rounded-xl p-6 mb-2">
                                        <FontAwesomeIcon icon={faLocationPin}/>
                                    </div>
                                    <p>ルームを探す</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {currentStep === 2 && (
                <div className="bg-gray-800 text-slate-100 min-w-56 bg-opacity-90 px-11  py-72 rounded-md">
                    <div className="flex flex-col gap-4 mb-4">
                    <h1 className="font-bold text-4xl m-1">MapChat</h1>
                    </div>
                    <div className="bg-gray-500 bg-opacity-40 rounded-lg">
                        <div className="">
                            <p className="text-center text-xl p-3 font-bold">ルームの作成</p>
                            <div className="m-14">
                                <p>ルーム名</p>
                                <input type="text"/>
                                <p>ルームアイコン</p>
                                <input type="file"/>
                                <p>ルームの説明</p>
                                <input type="text"/>
                                <p>ルームパスワード</p>
                                <input type="text"/>
                            </div>
                            <div className="flex gap-5 items-center justify-center pb-4">
                                <button className="bg-yellow-300 rounded-lg text-black p-2" onClick={() => backStep()}>← 戻る</button>
                                <button className="bg-yellow-300 rounded-lg text-black p-2" onClick={() => nextStep()}>つづける →</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {currentStep === 3 && (
                <div className="absolute top-80 -right-32 w-60">
                    <button className="bg-yellow-300 bg-opacity-90 rounded-lg text-black text-sm p-3" onClick={() => submitDatas()}>チャットを作りたい場所を選択してください</button>
                </div>
            )}
        </div>
        </>
    )
} 