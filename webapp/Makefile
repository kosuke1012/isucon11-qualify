deploy-app:
	cd go;\
	ssh isucon11q "sudo rm -f /home/isucon/webapp/go/isucondition"; \
	scp isucondition isucon11q:/home/isucon/webapp/go/
	cd sql;\
	ssh isucon11q "sudo rm -f /home/isucon/webapp/sql/0_Schema.sql"; \
	scp 0_Schema.sql isucon11q:/home/isucon/webapp/sql/	
	cd sql;\
	ssh isucon11q "sudo rm -f /home/isucon/webapp/sql/2_GenerateColumn.sql"; \
	scp 2_GenerateColumn.sql isucon11q:/home/isucon/webapp/sql/
	ssh isucon11q "sudo systemctl stop isucondition.go.service"
	ssh isucon11q "sudo systemctl start isucondition.go.service"

build:
	cd go;\
	GOOS=linux GOARCH=amd64 go build -o isucondition;
bench-run:
	ssh isucon11q " \
		cd bench;\
		./bench -all-addresses 127.0.0.11 -target 127.0.0.11:443 -tls -jia-service-url http://127.0.0.1:4999"
# mysql-deploy:
# 	ssh isucon11q "sudo dd of=/etc/mysql/mariadb.conf.d/50-server.cnf" < ./etc/mysql/mariadb.conf.d/50-server.cnf


rm-logs:
	rm -f my_slow.log
	rm -f my_access.log

init: rm-logs mysql-init nginx-init

mysql-init: mysql-rotate mysql-restart

mysql-rotate:
	ssh isucon11q "sudo rm -f /var/log/mysql/mariadb-slow.log"

mysql-restart:
	ssh isucon11q "sudo systemctl restart mariadb.service"

nginx-init: nginx-rotate nginx-restart
nginx-rotate:
	ssh isucon11q "sudo rm -f /var/log/nginx/access.log"

nginx-reload:
	ssh isucon11q "sudo systemctl reload nginx.service"

nginx-restart:
	ssh isucon11q "sudo systemctl restart nginx.service"

download-logs: download-slowlog download-accesslog
download-slowlog:
	ssh isucon11q "sudo cp /var/log/mysql/mariadb-slow.log my_slow.log";	
	ssh isucon11q "sudo chown isucon:isucon ~/my_slow.log";	
	scp isucon11q:~/my_slow.log .
	ssh isucon11q "sudo rm -f ~/my_slow.log";	

ptq:
	pt-query-digest my_slow.log

download-accesslog:
	ssh isucon11q "sudo cp /var/log/nginx/access.log my_access.log";	
	ssh isucon11q "sudo chown isucon:isucon ~/my_access.log"
	scp isucon11q:~/my_access.log .
	ssh isucon11q "sudo rm -f ~/my_access.log";

ALPSORT=sum
ALPM="/isu/[0-9a-f-]+/graph,/isu/[0-9a-f-]+,/api/condition/[0-9a-f-]+,/api/isu/[0-9a-f-]+/icon,/api/isu/[0-9a-f-]+,/?jwt=+,/isu/[0-9a-f-]+/condition"
OUTFORMAT=count,method,uri,min,max,sum,avg,p99

alp:
	alp ltsv --file=my_access.log --nosave-pos --pos /tmp/alp.pos --sort $(ALPSORT) --reverse -o $(OUTFORMAT) -m $(ALPM) -q

pprof-kill:
	ssh private-isu "pgrep -f 'pprof' | xargs kill;"

pprof:
	ssh isucon11q "/home/isucon/local/go/bin/go tool pprof webapp/go/isucondition http://localhost:3000/debug/pprof/profile?seconds=30"

show-pprof:
	$(eval latest := $(shell ssh isucon11q "ls -rt ~/pprof/ | tail -n 1"))
	scp isucon11q:~/pprof/$(latest) .
	go tool pprof -http=":8888" ./$(latest);