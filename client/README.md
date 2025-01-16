useNavigate フックを react-router-dom からインポート
→Next.js は使用しないので削除しました

useRouter を next/router からインポートに変更して使用

useRouter に変更して
useEffect(() => {
setIsClient(true); // クライアントサイドでのみ実行
}, []);

このようにして、クライアントサイドでのみ呼び出されるようにする
→SSR によりサーバサイドで呼び出される可能性があるため（わからない方は岸に聞くか、レッツ生成 AI）

npm install animate.css
