FROM mcr.microsoft.com/devcontainers/python:1-3.9-bookworm

# Install dependencies
RUN apt-get update -y && \
    apt-get install -y wget tar && \
    apt-get clean

# Set environment variables
ENV S2I_VERSION=source-to-image-v1.4.0-d3544c7e-linux-arm64.tar.gz

# Download and install S2I
RUN wget https://github.com/openshift/source-to-image/releases/download/v1.4.0/${S2I_VERSION} -O /tmp/${S2I_VERSION} && \
    tar -xzf /tmp/${S2I_VERSION} -C /usr/local/bin && \
    rm /tmp/${S2I_VERSION}

# Verify installation
RUN s2i version

# Set the default command
CMD ["bash"]
