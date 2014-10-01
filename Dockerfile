# Installation
# ############
#
# docker build -t <IMAGE_TAG> .
#
# docker run -it --rm -p 8080:8080 --name <CONTAINER_NAME> <IMAGE_TAG>

FROM node:0.10-onbuild

EXPOSE 8080

