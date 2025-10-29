FROM mcr.microsoft.com/devcontainers/base:noble

# Install oc cli
RUN curl -s -L https://downloads-openshift-console.apps.silver.devops.gov.bc.ca/arm64/linux/oc.tar | \
    tar -xv -C /usr/local/bin

# Install openshift-developer-tools scripts
RUN curl -L -O https://github.com/BCDevOps/openshift-developer-tools/archive/refs/heads/master.zip && \
    unzip master.zip && \
    mv ./openshift-developer-tools-master/bin /usr/local/bin/openshift-developer-tools && \
    rm -rf ./openshift-developer-tools-master master.zip

# Install dev-tools (for docker scripts)
RUN curl -L -O https://github.com/WadeBarnes/dev-tools/archive/refs/heads/main.zip && \
    unzip main.zip && \
    mv ./dev-tools-main /usr/local/bin/dev-tools && \
    find /usr/local/bin/dev-tools/ -name *.sh -exec chmod +x {} \; && \
    rm -rf ./dev-tools-main main.zip

# Update Path
ENV PATH="$PATH:/usr/local/bin/openshift-developer-tools:/usr/local/bin/dev-tools/docker/scripts"