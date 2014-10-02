# Installation
# ############
#
# docker build -t <IMAGE_TAG> .
#
# docker run -it --rm <IMAGE_TAG>
FROM node:0.10.32

RUN mkdir -p /usr/src/app

ADD . /usr/src/app

WORKDIR /usr/src/app

RUN git clean -d -x -f
