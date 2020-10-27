FROM jboss/keycloak:11.0.2
ENV KEYCLOAK_IMPORT /tmp/realm-config.json
ENV KEYCLOAK_USER admin

USER 0
COPY entrypoint.sh /opt/entrypoint.sh
RUN chmod +x /opt/entrypoint.sh
USER 1000

ENTRYPOINT [ "/opt/entrypoint.sh" ]
