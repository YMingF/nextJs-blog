docker start 05a7f7609990 &&
cd /home/blog/app &&
git pull &&
npm install --production=false &&
git apply migration.patch &&
npm run m:run &&
git reset --hard HEAD &&
npm run build &&
docker build -t alex/node-web-app . &&
docker rm -f app &&
docker run --name app --network=host -p 3000:3000 -d alex/node-web-app &&
echo 'OK'
