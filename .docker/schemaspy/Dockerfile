FROM schemaspy/schemaspy:latest

COPY ../../api/schemaspy.properties /config/schemaspy.properties

CMD [ "-t","pgsql","-db", "nest_api_dev","-host","postgres", "-u", "court_nestapi", "-p", "court_nest123" ]