# syntax=docker/dockerfile:1
FROM python:3.12 AS draw

RUN --mount=type=bind,source=draw/requirements.txt,target=/tmp/requirements.txt \
    pip install -r /tmp/requirements.txt

COPY draw/draw.py ./

ARG CONFIG=my.conf
RUN --mount=type=bind,source=$CONFIG,target=/tmp/default.conf \
    python draw.py --config /tmp/default.conf --codes codes.json > pairs.json


FROM node:22 AS site

COPY ./site/package*.json ./
RUN npm ci --omit=dev

COPY site ./
COPY --from=draw ./pairs.json ./src/

ARG I18N_LANGUAGE="en" \
    I18N_OVERRIDE_HTML_TITLE="" \
    I18N_OVERRIDE_CODE_PROMPT="" \
    I18N_OVERRIDE_CODE_INVALID="" \
    I18N_OVERRIDE_USER_HI="" \
    I18N_OVERRIDE_USER_WHO="" \
    I18N_OVERRIDE_USER_BACK="" \
    I18N_OVERRIDE_SANTA_PRESENT="" \
    I18N_OVERRIDE_SANTA_EXTRA=""

ENV PUBLIC_I18N_LANGUAGE="${I18N_LANGUAGE}" \
    PUBLIC_I18N_OVERRIDE_HTML_TITLE="${I18N_OVERRIDE_HTML_TITLE}" \
    PUBLIC_I18N_OVERRIDE_CODE_PROMPT="${I18N_OVERRIDE_CODE_PROMPT}" \
    PUBLIC_I18N_OVERRIDE_CODE_INVALID="${I18N_OVERRIDE_CODE_INVALID}" \
    PUBLIC_I18N_OVERRIDE_USER_HI="${I18N_OVERRIDE_USER_HI}" \
    PUBLIC_I18N_OVERRIDE_USER_WHO="${I18N_OVERRIDE_USER_WHO}" \
    PUBLIC_I18N_OVERRIDE_USER_BACK="${I18N_OVERRIDE_USER_BACK}" \
    PUBLIC_I18N_OVERRIDE_SANTA_PRESENT="${I18N_OVERRIDE_SANTA_PRESENT}" \
    PUBLIC_I18N_OVERRIDE_SANTA_EXTRA="${I18N_OVERRIDE_SANTA_EXTRA}"

RUN npm run build


FROM caddy:2

COPY --from=site ./dist /srv
COPY --from=draw ./codes.json /

EXPOSE 80
CMD [ "caddy", "file-server" ]
