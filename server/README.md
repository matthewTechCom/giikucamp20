➀GiikuCamp20 - PostgreSQL Docker 構築手順 & テーブル追加手順

Docker 起動方法
→DockerDesktop 開いてください
→server ディレクトリに移動

docker-compose up -d

テーブル追加したいとき

psql -h localhost -p 5435 -U giikucamp20 -d giikucamp20

→ ここで Create 文で追加