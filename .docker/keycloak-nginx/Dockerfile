FROM nginx:1.19.3

# support running as arbitrary user which belogs to the root group
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx /etc/nginx/conf.d
RUN rm /etc/nginx/conf.d/default.conf
EXPOSE 8081
# comment user directive as master process is run as user in OpenShift anyhow
RUN sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf

COPY entrypoint.sh /entrypoint.sh
RUN chmod g+x /entrypoint.sh

USER 1000
# TODO try dumping this script in /docker-entrypoint.d/ and not changing the entrypoint
ENTRYPOINT ["/entrypoint.sh"]
