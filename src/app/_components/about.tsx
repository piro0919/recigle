"use client";

import type { MouseEvent, ReactNode } from "react";
import { useCallback, useRef } from "react";

export default function About(): ReactNode {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const handleOpen = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);
  const handleClose = useCallback(() => {
    dialogRef.current?.close();
  }, []);
  // backdrop の押下は dialog 自身への click として届く。
  // 中身は内側の div が受けるので、target が dialog なら外側を押している
  const handleBackdropClick = useCallback(
    (e: MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        dialogRef.current?.close();
      }
    },
    [],
  );

  return (
    <>
      <button
        className="text-sm text-grey-secondary underline-offset-4 hover:underline"
        onClick={handleOpen}
        type="button"
      >
        このサイトについて
      </button>
      {/* 閉じていても HTML には出る。検索エンジンが読むのはこの本文 */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: dialog は Escape で
          閉じられる。キーボードからの経路は最初から用意されている */}
      <dialog
        className="m-auto w-[min(560px,calc(100dvw-2rem))] rounded-lg p-0 backdrop:bg-black/40"
        onClick={handleBackdropClick}
        ref={dialogRef}
      >
        <div className="grid gap-4 p-6 text-sm text-text">
          <h2 className="font-bold text-base">このサイトについて</h2>
          <p className="leading-7">
            料理名や材料を入れて検索すると、個人のブログや動画だけのサイトを除いた
            状態で Google のレシピ検索が開きます。検索そのものは Google
            が行います。
          </p>
          <section>
            <h3 className="pb-1 font-bold">仕組み</h3>
            <ul className="grid list-disc gap-1 pl-6 leading-7">
              <li>入力した言葉に「レシピ」を足します。</li>
              <li>
                除外するドメインを <code>-site:</code>{" "}
                の形で並べ、ひとつの検索式に まとめます。
              </li>
              <li>その検索式で Google の検索結果を新しいタブに開きます。</li>
              <li>除外するドメインの一覧は1日に1回読み込み直しています。</li>
            </ul>
          </section>
          <section>
            <h3 className="pb-1 font-bold">使い方</h3>
            <ol className="grid list-decimal gap-1 pl-6 leading-7">
              <li>料理名か材料を入れます。</li>
              <li>
                入力欄には過去に検索した言葉が候補として出ます。いらないものは
                個別に消せます。
              </li>
              <li>「レシグル 検索」を押すと、Google の検索結果が開きます。</li>
              <li>ホーム画面に追加すると、アプリのように立ち上げられます。</li>
            </ol>
          </section>
          <div className="flex justify-end">
            <button
              className="h-9 rounded border border-grey-bg bg-grey-bg px-4 text-grey-button text-sm hover:border-grey-border"
              onClick={handleClose}
              type="button"
            >
              閉じる
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
