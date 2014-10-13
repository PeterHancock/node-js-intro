# Installation
# ############
#
# docker build -t <IMAGE_TAG> .
#
# docker run -it --rm <IMAGE_TAG>
FROM node:0.10.32

RUN apt-get -y install vim

ADD shell/.bashrc /

RUN mkdir -p /node-js-talk

ADD . /node-js-talk

WORKDIR /node-js-talk

RUN git clean -d -x -f
