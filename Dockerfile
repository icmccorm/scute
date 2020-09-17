FROM emscripten/emsdk:latest
RUN sudo apt-get update
RUN sudo apt-get upgrade
RUN sudo apt-get install python3.7