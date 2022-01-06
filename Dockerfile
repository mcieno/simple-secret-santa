from python:3 as draws

copy ./scripts/requirements.txt ./requirements.txt

run pip install -r requirements.txt

copy ./scripts/draw.py ./default.conf ./

run python draw.py --config default.conf > pairs.json


from node:16 as builder

copy ./package*.json ./

run npm install

copy ./ ./

run npm run build


from caddy

copy --from=builder ./dist /srv
copy --from=draws ./pairs.json /srv

expose 80
cmd [ "caddy", "file-server" ]
